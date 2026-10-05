#!/usr/bin/env python3
"""Build a minimal, self-contained HTML archive of roulette spins.

GUI: python3 generate_real.py
CLI: python3 generate_real.py 2m-rng.txt -o real.html
     python3 generate_real.py 2m-rng.txt --start 100
     python3 generate_real.py 2m-rng.txt --random-start --seed 12345
     python3 generate_real.py 2m-rng.txt --start 100 --no-cycle
     python3 generate_real.py 2m-rng.txt --count 0

Input: one result (0 through 36) per line; record locations are 1-based.
Cyclic mode is on by default. Output defaults to at most 21,600 records,
starting at the chosen record and wrapping at the end when needed. Each
source record is used at most once. Set the record count to 0 for all available
records. With cyclic mode off, output stops at the last source record.
Random mode chooses only the starting record from the ENTIRE source file,
independently of the output count; it never shuffles the results. Formula:
    random.Random(seed).randint(1, total_records)
Both endpoints are inclusive: for 2 million inputs, records 1 to 2,000,000.

The first visible HTML row is "seed: N" in pre#seed (-1 for nonrandom starts).
Spin rows remain in pre#spins as tab-separated elapsed-time/result pairs.
Times use DDD:HH:MM:SS, start at 000:00:00:00, and advance by 30 seconds.
Days have at least three digits; hours roll over at 24, days never roll over.
All rows are immediately present in the static HTML. No automatic upload.
Requires Python 3.8+; the desktop GUI also requires Tkinter.
"""

import argparse
from dataclasses import dataclass
from itertools import chain, islice
import os
from pathlib import Path
import queue
import random
import secrets
import sys
import tempfile
import threading


INTERVAL_SECONDS = 30
DEFAULT_RECORD_COUNT = 21_600
PROGRESS_INTERVAL = 50_000
FOOTER = '</pre></body>\n</html>\n'


class GenerationCancelled(Exception):
    """The user stopped generation before the output was replaced."""


@dataclass(frozen=True)
class GenerationResult:
    total_records: int
    spin_count: int
    start_record: int
    seed: int
    cyclic: bool

    @property
    def last_time(self):
        return elapsed_time((self.spin_count - 1) * INTERVAL_SECONDS)


def elapsed_time(seconds: int) -> str:
    """Format elapsed seconds as DDD:HH:MM:SS, with unbounded days."""
    days, remainder = divmod(seconds, 86400)
    hours, remainder = divmod(remainder, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{days:03d}:{hours:02d}:{minutes:02d}:{seconds:02d}"


def check_cancelled(cancel_event):
    if cancel_event is not None and cancel_event.is_set():
        raise GenerationCancelled()


def generate_html(
    source: Path,
    destination: Path,
    *,
    start_record: int = 1,
    random_start: bool = False,
    seed=None,
    cyclic: bool = True,
    record_count: int = DEFAULT_RECORD_COUNT,
    progress=None,
    cancel_event=None,
) -> GenerationResult:
    """Validate, rotate, and atomically write the sequence using ~1 byte/record.

    progress, when supplied, receives (phase, completed, total); total is None
    during loading. It runs on the caller's thread and must not modify Tk UI.
    An omitted random seed is generated automatically and returned/recorded.
    record_count is an output limit, not a random-start range. Zero means all
    available records; output never exceeds one full pass through the source.
    Invalid input or cancellation leaves any existing output unchanged.
    """
    source, destination = Path(source), Path(destination)
    if source.resolve() == destination.resolve():
        raise ValueError("Input and output paths must be different.")
    if seed is not None and (type(seed) is not int or seed < 0):
        raise ValueError("Random seed must be a nonnegative integer; -1 is reserved.")
    if not random_start and seed is not None:
        raise ValueError("A seed can only be used with a random start.")
    if type(start_record) is not int or start_record < 1:
        raise ValueError("Starting record must be a positive integer (first record is 1).")
    if type(record_count) is not int or record_count < 0:
        raise ValueError("Record count must be a nonnegative integer; 0 means all available.")

    def report(phase, completed, total):
        if progress is not None:
            progress(phase, completed, total)

    records = bytearray()
    report("Loading", 0, None)
    with source.open(encoding="utf-8-sig") as input_file:
        for line_number, line in enumerate(input_file, start=1):
            check_cancelled(cancel_event)
            value = line.strip()
            if not (value.isascii() and value.isdecimal()):
                raise ValueError(
                    f"Line {line_number}: expected an integer from 0 to 36."
                )
            number = int(value)
            if not 0 <= number <= 36:
                raise ValueError(f"Line {line_number}: {number} is outside 0 to 36.")
            records.append(number)
            if line_number % PROGRESS_INTERVAL == 0:
                report("Loading", line_number, None)

    total = len(records)
    if not total:
        raise ValueError("Input contains no spins.")
    if random_start:
        actual_seed = seed if seed is not None else secrets.randbits(64)
        start_record = random.Random(actual_seed).randint(1, total)
    else:
        actual_seed = -1
    if start_record > total:
        raise ValueError(f"Starting record must be between 1 and {total:,}.")

    available = total if cyclic else total - start_record + 1
    spin_count = min(record_count, available) if record_count else available
    header = (
        '<!doctype html>\n'
        '<html lang="en">\n'
        '<head><meta charset="utf-8"><title>Roulette spins</title></head>\n'
        f'<body><pre id="seed">seed: {actual_seed}</pre>\n'
        f'<pre id="spins" data-interval-seconds="{INTERVAL_SECONDS}" '
        f'data-start-record="{start_record}" data-total-records="{total}" '
        f'data-output-records="{spin_count}" data-requested-records="{record_count}" '
        f'data-time-format="ddd:hh:mm:ss" data-cyclic="{str(cyclic).lower()}">'
    )
    indices = chain(
        range(start_record - 1, total),
        range(start_record - 1) if cyclic else (),
    )
    temporary_path = None
    try:
        check_cancelled(cancel_event)
        report("Writing", 0, spin_count)
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", newline="\n",
            dir=destination.parent, prefix=f".{destination.name}.",
            suffix=".tmp", delete=False,
        ) as output_file:
            temporary_path = Path(output_file.name)
            output_file.write(header)
            for output_index, source_index in enumerate(islice(indices, spin_count)):
                check_cancelled(cancel_event)
                time = elapsed_time(output_index * INTERVAL_SECONDS)
                output_file.write(f"{time}\t{records[source_index]}\n")
                if (output_index + 1) % PROGRESS_INTERVAL == 0:
                    report("Writing", output_index + 1, spin_count)
            output_file.write(FOOTER)
        check_cancelled(cancel_event)
        os.replace(temporary_path, destination)
        temporary_path = None
    finally:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)

    report("Done", spin_count, spin_count)
    return GenerationResult(total, spin_count, start_record, actual_seed, cyclic)


def default_input_path():
    candidates = (
        Path.cwd() / "2m-rng.txt",
        Path(__file__).resolve().parent / "2m-rng.txt",
        Path(__file__).resolve().parent / "upload" / "2m-rng.txt",
    )
    return next((path for path in candidates if path.is_file()), candidates[0])


def launch_gui(args) -> int:
    try:
        import tkinter as tk
        from tkinter import filedialog, messagebox, ttk
    except ImportError:
        print("The GUI requires Tkinter in your desktop Python installation.", file=sys.stderr)
        return 1

    try:
        root = tk.Tk()
    except tk.TclError as error:
        print(f"Cannot open the desktop GUI: {error}", file=sys.stderr)
        print("Use the command-line options on a system without a display.", file=sys.stderr)
        return 1

    root.title("Roulette HTML Generator")
    root.minsize(700, 570)
    root.columnconfigure(0, weight=1)
    root.rowconfigure(0, weight=1)
    frame = ttk.Frame(root, padding=20)
    frame.grid(sticky="nsew")
    frame.columnconfigure(1, weight=1)
    frame.rowconfigure(11, weight=1)

    input_path = tk.StringVar(value=str(args.input.resolve()))
    output_path = tk.StringVar(value=str(args.output.resolve()))
    initial_mode = "random" if args.random_start else ("specific" if args.start != 1 else "first")
    mode = tk.StringVar(value=initial_mode)
    record = tk.StringVar(value=str(args.start))
    seed_value = tk.StringVar(value="" if args.seed is None else str(args.seed))
    output_count = tk.StringVar(value=str(args.count))
    cyclic = tk.BooleanVar(value=not args.no_cycle)
    status = tk.StringVar(value="Choose your input, starting record, and output file.")
    messages = queue.Queue()
    cancel_event = threading.Event()
    busy = False
    closing = False
    controls = []

    ttk.Label(frame, text="Roulette HTML Generator", font=("", 17, "bold")).grid(
        row=0, column=0, columnspan=3, sticky="w", pady=(0, 8)
    )
    ttk.Label(frame, text="Create a static archive with spins spaced 30 seconds apart.").grid(
        row=1, column=0, columnspan=3, sticky="w", pady=(0, 18)
    )

    def browse_input():
        selected = filedialog.askopenfilename(
            parent=root, title="Choose spin results",
            filetypes=[("Text files", "*.txt"), ("All files", "*")],
        )
        if selected:
            input_path.set(selected)

    def browse_output():
        current = Path(output_path.get())
        selected = filedialog.asksaveasfilename(
            parent=root, title="Save generated HTML", defaultextension=".html",
            initialdir=str(current.parent), initialfile=current.name,
            filetypes=[("HTML files", "*.html"), ("All files", "*")],
        )
        if selected:
            output_path.set(selected)

    for row, label, variable, command in (
        (2, "Input file", input_path, browse_input),
        (3, "Output HTML", output_path, browse_output),
    ):
        ttk.Label(frame, text=label).grid(row=row, column=0, sticky="w", padx=(0, 12), pady=5)
        entry = ttk.Entry(frame, textvariable=variable)
        entry.grid(row=row, column=1, sticky="ew", pady=5)
        button = ttk.Button(frame, text="Browse…", command=command)
        button.grid(row=row, column=2, padx=(10, 0), pady=5)
        controls.extend((entry, button))

    starts = ttk.LabelFrame(frame, text="Starting record and output size", padding=12)
    starts.grid(row=4, column=0, columnspan=3, sticky="ew", pady=(14, 10))
    starts.columnconfigure(2, weight=1)

    def refresh_fields():
        record_entry.configure(state="normal" if not busy and mode.get() == "specific" else "disabled")
        seed_entry.configure(state="normal" if not busy and mode.get() == "random" else "disabled")

    for row, text, value in (
        (0, "First record", "first"),
        (1, "Specific record", "specific"),
        (2, "Random starting record", "random"),
    ):
        button = ttk.Radiobutton(starts, text=text, variable=mode, value=value, command=refresh_fields)
        button.grid(row=row, column=0, sticky="w", padx=(0, 15), pady=4)
        controls.append(button)
    record_entry = ttk.Entry(starts, textvariable=record, width=18)
    record_entry.grid(row=1, column=1, sticky="w", pady=4)
    ttk.Label(starts, text="Locations start at 1").grid(row=1, column=2, sticky="w", padx=10)
    seed_entry = ttk.Entry(starts, textvariable=seed_value, width=24)
    seed_entry.grid(row=2, column=1, sticky="w", pady=4)
    ttk.Label(starts, text="Seed (blank = automatic)").grid(row=2, column=2, sticky="w", padx=10)
    ttk.Label(starts, text="The same seed and input reproduce the same starting record.").grid(
        row=3, column=0, columnspan=3, sticky="w", pady=(9, 0)
    )
    ttk.Label(starts, text="Records to publish").grid(row=4, column=0, sticky="w", pady=(12, 0))
    count_entry = ttk.Entry(starts, textvariable=output_count, width=18)
    count_entry.grid(row=4, column=1, sticky="w", pady=(12, 0))
    controls.append(count_entry)
    ttk.Label(starts, text="0 = all available records").grid(
        row=4, column=2, sticky="w", padx=10, pady=(12, 0)
    )

    cycle_button = ttk.Checkbutton(frame, text="Cyclic sequence (wrap once to the beginning)", variable=cyclic)
    cycle_button.grid(row=5, column=0, columnspan=3, sticky="w", pady=(0, 5))
    controls.append(cycle_button)
    ttk.Label(frame, text="On: wrap at the end. Off: stop at the last record.\n"
              "The count is a maximum; each source record is used at most once.").grid(
        row=6, column=0, columnspan=3, sticky="w", pady=(0, 12)
    )

    action_frame = ttk.Frame(frame)
    action_frame.grid(row=7, column=0, columnspan=3, sticky="w", pady=(0, 12))
    progress_bar = ttk.Progressbar(frame, mode="indeterminate")
    progress_bar.grid(row=8, column=0, columnspan=3, sticky="ew")
    ttk.Label(frame, textvariable=status, wraplength=640).grid(
        row=9, column=0, columnspan=3, sticky="w", pady=(8, 10)
    )
    ttk.Label(frame, text="Generation details").grid(row=10, column=0, columnspan=3, sticky="w")
    details = tk.Text(frame, height=5, wrap="word", state="disabled")
    details.grid(row=11, column=0, columnspan=3, sticky="nsew", pady=(5, 0))

    def set_details(text):
        details.configure(state="normal")
        details.delete("1.0", "end")
        details.insert("1.0", text)
        details.configure(state="disabled")

    def set_busy(value):
        nonlocal busy
        busy = value
        for widget in controls:
            widget.configure(state="disabled" if busy else "normal")
        generate_button.configure(state="disabled" if busy else "normal")
        cancel_button.configure(state="normal" if busy else "disabled")
        refresh_fields()

    def cancel():
        cancel_event.set()
        cancel_button.configure(state="disabled")
        status.set("Cancelling…")

    def generate():
        source_text, destination_text = input_path.get().strip(), output_path.get().strip()
        try:
            if not source_text or not destination_text:
                raise ValueError("Choose both an input file and an output HTML path.")
            source, destination = Path(source_text).expanduser(), Path(destination_text).expanduser()
            selected_start = int(record.get()) if mode.get() == "specific" else 1
            selected_count = int(output_count.get().strip().replace(",", ""))
            is_random = mode.get() == "random"
            chosen_seed = int(seed_value.get().strip()) if is_random and seed_value.get().strip() else None
            if selected_start < 1:
                raise ValueError("Starting record must be at least 1.")
            if selected_count < 0:
                raise ValueError("Record count must be nonnegative; 0 means all available records.")
            if chosen_seed is not None and chosen_seed < 0:
                raise ValueError("Random seed must be nonnegative; -1 is reserved for nonrandom starts.")
            if source.resolve() == destination.resolve():
                raise ValueError("Input and output paths must be different.")
            if destination.exists() and not messagebox.askyesno(
                "Replace HTML?", f"Replace the existing file?\n{destination}", parent=root
            ):
                return
        except ValueError as error:
            messagebox.showerror("Check settings", str(error), parent=root)
            return

        is_cyclic = cyclic.get()
        cancel_event.clear()
        set_busy(True)
        set_details("")
        status.set("Loading and validating source records…")
        progress_bar.configure(mode="indeterminate", value=0)
        progress_bar.start(12)

        def worker():
            try:
                result = generate_html(
                    source, destination, start_record=selected_start,
                    random_start=is_random, seed=chosen_seed, cyclic=is_cyclic,
                    record_count=selected_count,
                    progress=lambda phase, completed, total: messages.put(
                        ("progress", (phase, completed, total))
                    ),
                    cancel_event=cancel_event,
                )
                messages.put(("success", (result, destination, is_random)))
            except GenerationCancelled:
                messages.put(("cancelled", None))
            except Exception as error:
                messages.put(("error", str(error)))

        threading.Thread(target=worker, daemon=True).start()

    generate_button = ttk.Button(action_frame, text="Generate HTML", command=generate)
    generate_button.grid(row=0, column=0, padx=(0, 10))
    cancel_button = ttk.Button(action_frame, text="Cancel", command=cancel, state="disabled")
    cancel_button.grid(row=0, column=1)

    def poll_messages():
        try:
            while True:
                kind, payload = messages.get_nowait()
                if kind == "progress":
                    phase, completed, total = payload
                    if total is None:
                        status.set(f"Loading and validating: {completed:,} records…")
                    else:
                        progress_bar.stop()
                        progress_bar.configure(mode="determinate", maximum=total, value=completed)
                        status.set(f"{phase}: {completed:,} / {total:,} spins")
                else:
                    progress_bar.stop()
                    set_busy(False)
                    if kind == "success":
                        result, destination, was_random = payload
                        if was_random:
                            seed_value.set(str(result.seed))
                        status.set(f"Saved {result.spin_count:,} spins to {destination.name}.")
                        set_details(
                            f"Start: record {result.start_record:,} of {result.total_records:,} | "
                            f"seed: {result.seed} | cyclic: {'on' if result.cyclic else 'off'}\n"
                            f"Timeline: 000:00:00:00 to {result.last_time} | 30 seconds per spin\n"
                            f"Output: {destination.resolve()}"
                        )
                    elif kind == "cancelled":
                        status.set("Generation cancelled. Existing output was preserved.")
                        progress_bar.configure(value=0)
                    else:
                        status.set("Generation failed. Existing output was preserved.")
                        progress_bar.configure(value=0)
                        if not closing:
                            messagebox.showerror("Generation failed", payload, parent=root)
                    if closing:
                        root.destroy()
                        return
        except queue.Empty:
            pass
        root.after(100, poll_messages)

    def close():
        nonlocal closing
        if busy:
            closing = True
            cancel()
        else:
            root.destroy()

    root.protocol("WM_DELETE_WINDOW", close)
    refresh_fields()
    root.after(100, poll_messages)
    root.mainloop()
    return 0


def main(argv=None) -> int:
    arguments = sys.argv[1:] if argv is None else argv
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("input", nargs="?", type=Path, default=default_input_path())
    parser.add_argument("-o", "--output", type=Path, default=Path("real.html"))
    parser.add_argument("--gui", action="store_true", help="Open the desktop GUI with these settings.")
    starts = parser.add_mutually_exclusive_group()
    starts.add_argument("--start", type=int, default=1, help="Starting record (1-based; default: 1).")
    starts.add_argument("--random-start", action="store_true", help="Choose a starting record using a seed.")
    parser.add_argument("--seed", type=int, help="Nonnegative random seed; omitted means generate one.")
    parser.add_argument("--no-cycle", action="store_true", help="Stop at the last record without wrapping.")
    parser.add_argument(
        "--count", type=int, default=DEFAULT_RECORD_COUNT,
        help="Maximum output records (default: 21600; 0: all available, up to one full pass).",
    )
    args = parser.parse_args(arguments)
    if args.seed is not None and not args.random_start:
        parser.error("--seed requires --random-start")
    if args.seed is not None and args.seed < 0:
        parser.error("--seed must be nonnegative; -1 is reserved")
    if args.count < 0:
        parser.error("--count must be nonnegative; 0 means all available")
    if not arguments or args.gui:
        return launch_gui(args)

    try:
        result = generate_html(
            args.input, args.output, start_record=args.start,
            random_start=args.random_start, seed=args.seed, cyclic=not args.no_cycle,
            record_count=args.count,
        )
    except (OSError, UnicodeError, ValueError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    print(f"Wrote {result.spin_count:,} spins to {args.output}")
    print(f"Start record: {result.start_record:,} / {result.total_records:,}; seed: {result.seed}; cyclic: {result.cyclic}")
    print(f"Timeline: 000:00:00:00 to {result.last_time}; {INTERVAL_SECONDS} seconds per spin")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
