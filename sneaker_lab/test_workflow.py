"""Regression checks for data leakage, feedback, downloads and the GUI workflow."""

from collections import Counter
import hashlib
import io
import json
from pathlib import Path
import tempfile
import time
import tkinter as tk
from tkinter import ttk
import unittest
from unittest.mock import patch

from app import Lab
import learning as ml


def quiet(_):
    pass


class LearningTests(unittest.TestCase):
    def test_split_counts_and_exact_image_independence(self):
        folder = ml.HOME_DIR / "data"
        with patch.object(ml, "read_shoes", wraps=ml.read_shoes) as reader:
            data = ml.prepare_data(folder, quiet)
            reader.assert_called_once_with(folder, "train")
        test = ml.read_shoes(folder, "t10k")
        groups = (data.base, data.review, data.tune, data.validation, test)
        for group, n in zip(groups, (100, 500, 4600, 800, 1000), strict=True):
            self.assertEqual(Counter(s.category for s in group), dict.fromkeys(ml.CATEGORIES, n))
        self.assertEqual(len({s.pixels for group in groups for s in group}), 21_000)
        self.assertEqual(len({s.index for group in groups[:-1] for s in group}), 18_000)
        first = ml.train_base(data, quiet)
        repeat = ml.train_base(data, quiet)
        self.assertEqual(first.weights, repeat.weights)
        self.assertEqual(first.history, repeat.history)
        selected_loss = first.history[first.best_pass - 1]["validation_loss"]
        self.assertEqual(selected_loss, min(r["validation_loss"] for r in first.history))

    def test_review_label_drives_reward_direction(self):
        base = ml.Model((0.0,) * 50, 0, [])
        shoe = ml.Shoe(9, 7, bytes(784), ml.extract_features(bytes(784)))
        for target in (0, 1):
            model, log = ml.reinforce(base, [(shoe, target)])
            self.assertEqual(log[0]["reward"],
                             1 if log[0]["sampled_answer"] == target else -1)
            after = ml.score(model.weights, shoe.features)
            self.assertGreater((after - 0.5) * (2 * target - 1), 0)
        self.assertEqual(base.weights, (0.0,) * 50)

    def test_cutoff_tie_and_undefined_precision(self):
        rows = [(1, 0.5), (0, 0.5), (1, 0.2), (0, 0.1)]
        at_half = ml.metrics(rows)
        self.assertEqual([at_half[k] for k in ("tp", "fp", "fn", "tn")], [1, 1, 1, 1])
        self.assertIsNone(ml.metrics(rows, 0.8)["precision"])

    def test_invalid_download_can_be_retried_without_losing_existing_file(self):
        name = "sample.gz"
        expected = hashlib.sha256(b"complete").hexdigest()
        with tempfile.TemporaryDirectory() as temp, patch.dict(
                ml.ARCHIVES, {name: expected}, clear=True):
            directory = Path(temp)
            path = directory / name
            path.write_bytes(b"old")
            with patch("urllib.request.urlopen", return_value=io.BytesIO(b"partial")):
                with self.assertRaisesRegex(ValueError, "Checksum"):
                    ml.prepare_archives(directory, quiet)
            self.assertEqual(path.read_bytes(), b"old")
            with patch("urllib.request.urlopen", return_value=io.BytesIO(b"complete")):
                ml.prepare_archives(directory, quiet)
            with patch("urllib.request.urlopen", side_effect=AssertionError("offline")):
                ml.prepare_archives(directory, quiet)
            self.assertEqual(path.read_bytes(), b"complete")


def click(root, caption):
    pending = [root]
    while pending:
        widget = pending.pop()
        pending.extend(widget.winfo_children())
        if isinstance(widget, ttk.Button) and widget.cget("text") == caption:
            if widget.instate(["disabled"]):
                raise AssertionError(f"Button disabled: {caption}")
            widget.invoke()
            return
    raise AssertionError(f"Button missing: {caption}")


def wait_for_job(lab):
    end = time.monotonic() + 30
    while lab.busy and time.monotonic() < end:
        lab.root.update()
        time.sleep(0.01)
    if lab.busy or lab.status.cget("style") == "Error.TLabel":
        raise AssertionError(lab.status.cget("text"))
    lab.root.update_idletasks()


class GuiTests(unittest.TestCase):
    def test_offline_wizard_seals_and_saves_choice(self):
        root = tk.Tk()
        root.attributes("-alpha", 0.0)
        self.addCleanup(root.destroy)
        with tempfile.TemporaryDirectory() as temp:
            lab = Lab(root, run_dir=temp)
            root.geometry("800x510")
            with patch("urllib.request.urlopen", side_effect=AssertionError("offline")):
                for action in ("Prepare data", "Go to base training",
                               "Train base model", "Review mistakes"):
                    click(root, action)
                    wait_for_job(lab)
            self.assertTrue(all(lab.cases.values()))
            for kind, target in ((ml.FALSE_ALARM, 0), (ml.MISS, 1)):
                lab.kind.set(kind)
                lab.show(2)
                shoe, probability = lab.cases[kind][0]
                self.assertEqual(shoe.target, target)
                self.assertNotEqual(int(probability >= 0.5), target)
                click(root, "Label sneaker" if target else "Label other shoe")
                self.assertEqual(lab.reviewed[shoe.index][1], target)
            for action in ("Use 10 of each", "Use 10 of each", "Apply rewards",
                           "Go to fine-tuning", "Fine-tune model", "Compare models"):
                click(root, action)
                wait_for_job(lab)
            self.assertEqual(len(lab.reviewed), 20)
            self.assertEqual(len(lab.reward_log), 20)
            self.assertEqual(len(lab.models[ml.TUNED].history), 4)
            for page in range(5):
                lab.show(page)
                root.update()
                for widget in lab.body.winfo_children():
                    if isinstance(widget, ttk.Label):
                        self.assertLessEqual(widget.winfo_reqwidth(),
                                             widget.winfo_width() + 2)
            lab.cutoff.set("0.65")
            lab.selected.set(ml.FEEDBACK)
            lab.show(4)
            click(root, "Lock and test")
            wait_for_job(lab)
            report = json.loads(lab.report_path.read_text(encoding="utf-8"))
            self.assertEqual(report["cutoff"], 0.65)
            self.assertEqual(report["selected_model"], ml.FEEDBACK)
            self.assertEqual(set(report["test"]), {ml.BASE, ml.FEEDBACK})
            self.assertEqual(len(report["models"][ml.TUNED]["weights"]), 50)
            for counts in report["test"].values():
                self.assertEqual(sum(counts[k] for k in ("tp", "fp", "fn", "tn")),
                                 report["test_size"])
            with self.assertRaisesRegex(AssertionError, "Button missing"):
                click(root, "Lock and test")
            click(root, "New experiment")
            self.assertFalse(lab.models)
            self.assertTrue(list(Path(temp).glob("run-*.json")))


if __name__ == "__main__":
    unittest.main(verbosity=2)
