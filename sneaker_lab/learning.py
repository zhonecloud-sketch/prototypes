"""Data preparation, training and scoring for the Sneaker Lab desktop app."""

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
import gzip
import hashlib
import json
import math
from pathlib import Path
import random
import shutil
import struct
import sys
import tempfile
import time
import urllib.request
from uuid import uuid4


HOME_DIR = Path(r"D:\Zhone\prototypes\sneaker_lab")
SOURCE = "https://raw.githubusercontent.com/zalandoresearch/fashion-mnist/master/"
ARCHIVES = {
    "train-images-idx3-ubyte.gz":
        "3aede38d61863908ad78613f6a32ed271626dd12800ba2636569512369268a84",
    "train-labels-idx1-ubyte.gz":
        "a04f17134ac03560a47e3764e11b92fc97de4d1bfaf8ba1a3aa29af54cc90845",
    "t10k-images-idx3-ubyte.gz":
        "346e55b948d973a97e58d2351dde16a484bd415d4595297633bb08f03db6a073",
    "t10k-labels-idx1-ubyte.gz":
        "67da17c76eaffca5446c3361aaab5c3cd6d1c2608764d35dfb1850b086bf8dd5",
}
CATEGORIES = {5: "Sandal", 7: "Sneaker", 9: "Ankle boot"}
SEED = 42
BASE, FEEDBACK, TUNED = "Base", "After feedback", "Fine-tuned"
FALSE_ALARM, MISS = "False alarms", "Missed sneakers"
BASE_PASSES, BASE_RATE, FEEDBACK_RATE, TUNE_RATE = 6, 0.08, 0.025, 0.02


@dataclass(frozen=True, slots=True)
class Shoe:
    index: int                 # Row number within the official train or test file
    category: int
    pixels: bytes
    features: tuple

    @property
    def target(self):
        return int(self.category == 7)


@dataclass
class Split:
    base: list
    review: list
    tune: list
    validation: list


@dataclass
class Model:
    weights: tuple
    seconds: float
    history: list
    best_pass: int | None = None


def file_digest(path):
    with path.open("rb") as file:
        return hashlib.file_digest(file, "sha256").hexdigest()


def prepare_archives(directory, progress):
    directory.mkdir(parents=True, exist_ok=True)
    for name, expected in ARCHIVES.items():
        path = directory / name
        progress(f"Checking {name} …")
        if path.is_file() and file_digest(path) == expected:
            continue
        progress(f"Downloading {name} …")
        # Stage on the same drive so concurrent launches see only complete files.
        with tempfile.TemporaryDirectory(dir=directory) as staging:
            pending = Path(staging) / name
            try:
                with urllib.request.urlopen(SOURCE + "data/fashion/" + name,
                                            timeout=45) as response:
                    with pending.open("wb") as output:
                        shutil.copyfileobj(response, output)
            except OSError as error:
                raise OSError(f"Could not download {name}. Check the connection "
                              f"or copy the official archive into {directory}. "
                              f"Details: {error}") from error
            if file_digest(pending) != expected:
                raise ValueError(f"Checksum failed for {name}. Retry Prepare data.")
            pending.replace(path)


def extract_features(pixels):
    # Average each 4 x 4 block. A final constant supplies the model's intercept.
    cells = []
    for top in range(0, 28, 4):
        rows = [pixels[y * 28:(y + 1) * 28] for y in range(top, top + 4)]
        columns = [sum(column) for column in zip(*rows)]
        for left in range(0, 28, 4):
            cells.append(sum(columns[left:left + 4]) / (16 * 255))
    return (*cells, 1.0)


def read_shoes(directory, prefix):
    expected = {"train": 60_000, "t10k": 10_000}[prefix]
    with gzip.open(directory / f"{prefix}-labels-idx1-ubyte.gz") as labels:
        if labels.read(8) != struct.pack(">II", 2049, expected):
            raise ValueError(f"Unexpected {prefix} label header.")
        categories = labels.read()
    if len(categories) != expected:
        raise ValueError(f"Incomplete {prefix} labels.")
    shoes = []
    with gzip.open(directory / f"{prefix}-images-idx3-ubyte.gz") as images:
        if images.read(16) != struct.pack(">IIII", 2051, expected, 28, 28):
            raise ValueError(f"Unexpected {prefix} image header.")
        for index, category in enumerate(categories):
            pixels = images.read(28 * 28)
            if len(pixels) != 28 * 28:
                raise ValueError(f"Incomplete {prefix} image at row {index}.")
            if category in CATEGORIES:
                shoes.append(Shoe(index, category, pixels, extract_features(pixels)))
    return shoes


def prepare_data(directory, progress):
    prepare_archives(directory, progress)
    progress("Reading training images and making four separate groups …")
    shoes = read_shoes(directory, "train")
    rng = random.Random(SEED)
    split = Split([], [], [], [])
    for category in CATEGORIES:
        group = [shoe for shoe in shoes if shoe.category == category]
        rng.shuffle(group)
        split.base.extend(group[:100])
        split.review.extend(group[100:600])
        split.validation.extend(group[600:1400])
        split.tune.extend(group[1400:])
    for group in (split.base, split.review, split.validation, split.tune):
        rng.shuffle(group)
    return split


def score(weights, features):
    value = math.sumprod(weights, features)
    return 1.0 / (1.0 + math.exp(-max(-40.0, min(40.0, value))))


def scored(weights, examples):
    return [(shoe.target, score(weights, shoe.features)) for shoe in examples]


def metrics(predictions, cutoff=0.5):
    tp = fp = fn = tn = 0
    for target, probability in predictions:
        if probability >= cutoff:
            tp += target
            fp += 1 - target
        else:
            fn += target
            tn += 1 - target
    return {
        "tp": tp, "fp": fp, "fn": fn, "tn": tn,
        "accuracy": (tp + tn) / len(predictions) if predictions else None,
        "precision": tp / (tp + fp) if tp + fp else None,
        "recall": tp / (tp + fn) if tp + fn else None,
    }


def adjust(weights, features, step):
    for column, brightness in enumerate(features):
        weights[column] += step * brightness


def fit(start, labeled, validation, passes, rate, seed, progress):
    """Return the pass with the lowest validation loss, keeping start intact."""
    started = time.perf_counter()
    weights = list(start)
    ordered = list(labeled)
    rng = random.Random(seed)
    history = []
    best_loss = math.inf
    best_weights, best_pass = tuple(start), 0
    for epoch in range(1, passes + 1):
        rng.shuffle(ordered)
        for shoe, target in ordered:
            probability = score(weights, shoe.features)
            adjust(weights, shoe.features, rate * (target - probability))
        predictions = scored(weights, validation)
        loss = -sum(math.log(max(1e-15, p if y else 1 - p))
                    for y, p in predictions) / len(predictions)
        row = {"pass": epoch, "validation_loss": loss, **metrics(predictions)}
        history.append(row)
        if loss < best_loss:
            best_loss, best_weights, best_pass = loss, tuple(weights), epoch
        progress(f"Pass {epoch}/{passes}    Validation loss {loss:.4f}")
    return Model(best_weights, time.perf_counter() - started, history, best_pass)


def train_base(data, progress):
    return fit((0.0,) * 50, [(s, s.target) for s in data.base], data.validation,
               BASE_PASSES, BASE_RATE, SEED, progress)


def review_mistakes(weights, pool):
    cases = {FALSE_ALARM: [], MISS: []}
    for shoe in pool:
        probability = score(weights, shoe.features)
        if (probability >= 0.5) != shoe.target:
            cases[MISS if shoe.target else FALSE_ALARM].append((shoe, probability))
    return cases


def reinforce(base, reviewed):
    """Sample one answer per reviewed shoe. Reward agreement with its label."""
    started = time.perf_counter()
    weights = list(base.weights)
    rng = random.Random(SEED + 1)
    # Stable order makes manual and batch review reproducible from the report.
    ordered = sorted(reviewed, key=lambda pair: pair[0].index)
    rng.shuffle(ordered)
    log = []
    for shoe, target in ordered:
        probability = score(weights, shoe.features)
        answer = int(rng.random() < probability)
        reward = 1 if answer == target else -1
        # One-step policy gradient for a binary (Bernoulli) action.
        adjust(weights, shoe.features, FEEDBACK_RATE * reward * (answer - probability))
        log.append({"train_row": shoe.index, "catalog": CATEGORIES[shoe.category],
                    "review_label": target, "score_before": probability,
                    "sampled_answer": answer, "reward": reward})
    return Model(tuple(weights), time.perf_counter() - started, []), log


def fine_tune(start, data, reviewed, passes, progress):
    if passes not in range(1, 9):
        raise ValueError("Choose between 1 and 8 training passes.")
    labeled = [(s, s.target) for s in data.tune]
    labeled.extend(sorted(reviewed, key=lambda pair: pair[0].index))
    return fit(start.weights, labeled, data.validation, passes, TUNE_RATE,
               SEED + 2, progress)


def finish_run(data_dir, run_dir, data, models, feedback, selected, cutoff):
    """Score the sealed choice and its baseline, then publish one complete report."""
    test = read_shoes(data_dir, "t10k")
    checkpoints = {}
    for name, model in models.items():
        checkpoints[name] = {
            **asdict(model),
            "validation": metrics(scored(model.weights, data.validation), cutoff),
        }
    now = datetime.now(timezone.utc)
    report = {
        "created_utc": now.isoformat(), "python": sys.version.split()[0],
        "dataset": "Zalando Fashion-MNIST", "dataset_source": SOURCE,
        "archives_sha256": ARCHIVES, "positive_label": "Sneaker (7)",
        "negative_labels": ["Sandal (5)", "Ankle boot (9)"],
        "features": "49 row-major 4x4 block means / 255, then a constant 1",
        "split_seed": SEED, "base_rate": BASE_RATE, "reward_rate": FEEDBACK_RATE,
        "fine_tune_rate": TUNE_RATE, "selected_model": selected, "cutoff": cutoff,
        "sizes": {name: len(getattr(data, name))
                  for name in ("base", "review", "tune", "validation")},
        "review_feedback": feedback, "models": checkpoints, "test_size": len(test),
        "test": {name: metrics(scored(models[name].weights, test), cutoff)
                 for name in dict.fromkeys((BASE, selected))},
    }
    run_dir.mkdir(parents=True, exist_ok=True)
    filename = f"run-{now:%Y%m%d-%H%M%S}-{uuid4().hex[:8]}.json"
    path = run_dir / filename
    with tempfile.TemporaryDirectory(dir=run_dir) as staging:
        pending = Path(staging) / filename
        pending.write_text(json.dumps(report, indent=2, allow_nan=False),
                           encoding="utf-8")
        pending.replace(path)
    return path, report
