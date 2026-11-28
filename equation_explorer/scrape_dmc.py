"""Download Da Ma Cai's past 1+3D results with curl."""

import argparse
import csv
import json
import re
import shutil
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path
from tempfile import NamedTemporaryFile
from urllib.parse import urlencode


SITE = "https://www.damacai.com.my"
DEFAULT_OUTPUT = Path(__file__).resolve().parent / "db" / "dmc" / "dmc_261129.csv"
PRIZES_PER_GROUP = 10
ROW_WIDTH = 1 + 3 + 2 * PRIZES_PER_GROUP


def get_json(url, headers=()):
    command = ["curl", "-fLsS", "--max-time", "20", "--proto", "=https"]
    for header in headers:
        command.extend(("--header", header))
    response = subprocess.run([*command, "--", url], capture_output=True)
    if response.returncode:
        raise RuntimeError(response.stderr.decode(errors="replace").strip())
    return json.loads(response.stdout)


def retry(operation):
    for attempt in range(4):
        try:
            return operation()
        except (RuntimeError, json.JSONDecodeError):
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)


def draw_dates():
    calendar = retry(lambda: get_json(f"{SITE}/ListPastResult"))
    dates = calendar["drawdate"].split()
    if not dates:
        raise ValueError("Da Ma Cai returned an empty draw calendar")
    for date in dates:
        if not re.fullmatch(r"[0-9]{8}", date):
            raise ValueError(f"Invalid calendar date: {date!r}")
        datetime.strptime(date, "%Y%m%d")
    return sorted(set(dates), reverse=True)


def fetch_draw(date):
    def download():
        query = urlencode({"pastdate": date})
        lookup = get_json(
            f"{SITE}/callpassresult?{query}",
            ("cookiesession: 844",),
        )
        return get_json(lookup["link"])

    draw = retry(download)
    actual_date = datetime.strptime(draw["drawDate"], "%d/%m/%Y").strftime("%Y%m%d")
    if actual_date != date:
        raise ValueError(f"site returned draw {actual_date}")

    prizes = [draw[field] for field in ("p1", "p2", "p3")]
    for field in ("starterList", "consolidateList"):
        group = draw[field]
        if not isinstance(group, list) or len(group) != PRIZES_PER_GROUP:
            raise ValueError(f"expected {PRIZES_PER_GROUP} numbers in {field}")
        # The desktop page renders the first five down the left column.
        prizes.extend(group)

    numbers = [str(prize) for prize in prizes]
    if not all(re.fullmatch(r"[0-9]{1,4}", number) for number in numbers):
        raise ValueError("invalid 1+3D prize number")
    return [date, *(number.zfill(4) for number in numbers)]


def read_csv(path):
    rows = {}
    if path.exists():
        with path.open(encoding="utf-8", newline="") as source:
            for row in csv.reader(source, strict=True):
                if len(row) != ROW_WIDTH or not all(
                    re.fullmatch(r"[0-9]{4}", number) for number in row[1:]
                ) or not re.fullmatch(r"[0-9]{8}", row[0]):
                    raise ValueError(f"Invalid draw row in {path}: {row!r}")
                datetime.strptime(row[0], "%Y%m%d")
                rows[row[0]] = row
    return rows


def write_csv(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    output = NamedTemporaryFile(mode="w", dir=path.parent, encoding="utf-8", newline="",
                                delete=False)
    temp_path = Path(output.name)
    try:
        with output:
            writer = csv.writer(output, lineterminator="\n")
            writer.writerows(rows[date] for date in sorted(rows, reverse=True))
        temp_path.replace(path)
    finally:
        temp_path.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT,
                        help="CSV to create or update (default: %(default)s)")
    args = parser.parse_args()
    if not shutil.which("curl"):
        parser.exit(1, "Da Ma Cai: curl is required.\n")

    rows = read_csv(args.output)
    dates = draw_dates()
    pending = [date for date in dates if date not in rows]
    print(f"Calendar: {len(dates):,} draws ({dates[-1]} to {dates[0]}). "
          f"Fetching {len(pending):,} missing draws.", flush=True)

    failures = 0
    since_save = 0
    with ThreadPoolExecutor(max_workers=6) as pool:
        jobs = {pool.submit(fetch_draw, date): date for date in pending}
        try:
            for job in as_completed(jobs):
                date = jobs[job]
                try:
                    rows[date] = job.result()
                except (OSError, RuntimeError, ValueError, KeyError, TypeError) as error:
                    failures += 1
                    print(f"{date}: {error}", file=sys.stderr)
                    continue
                since_save += 1
                if since_save == 100:
                    write_csv(args.output, rows)
                    since_save = 0
                    print(f"Saved {len(rows):,} draws.", flush=True)
        finally:
            for job in jobs:
                job.cancel()
            if rows:
                write_csv(args.output, rows)

    if failures:
        print(f"{failures:,} dates failed. Run again to retry missing draws.", file=sys.stderr)
        return 1
    print(f"{len(rows):,} draws in {args.output}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OSError, RuntimeError, ValueError, KeyError, TypeError, csv.Error) as error:
        sys.exit(f"Da Ma Cai: {error}")
