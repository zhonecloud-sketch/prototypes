"""Launch the guided Fashion-MNIST experiment with a standard Python install."""

import os
from pathlib import Path
import queue
import sys
import threading
import tkinter as tk
from tkinter import ttk

import learning as ml


PAPER, INK, MUTED = "#f7f7f2", "#183332", "#526765"
RAIL, TEAL, LIGHT = "#193b39", "#116b60", "#dfede6"
FONT = "Roboto"
STEPS = ("Prepare data", "Train base model", "Review mistakes", "Fine-tune",
         "Evaluate")


def percent(value):
    return "—" if value is None else f"{value:.1%}"


def caption(parent, text, style="TLabel", **pack):
    label = ttk.Label(parent, text=text, style=style, wraplength=620,
                      justify="left")
    label.pack(anchor="w", fill="x", **pack)
    label.bind("<Configure>", lambda event: label.configure(
        wraplength=max(50, min(680, event.width - 4))))
    return label


def button(parent, text, command, primary=False, enabled=True):
    widget = ttk.Button(parent, text=text, command=command,
                        style="Primary.TButton" if primary else "TButton")
    if not enabled:
        widget.state(["disabled"])
    widget.pack(side="left", padx=(0, 8), pady=3)
    return widget


def table(parent, columns, rows):
    names = [name for name, width in columns]
    tree = ttk.Treeview(parent, columns=names, show="headings", selectmode="none",
                        height=len(rows))
    for i, (name, width) in enumerate(columns):
        anchor = "w" if i == 0 else "center"
        tree.heading(name, text=name, anchor=anchor)
        tree.column(name, width=width, minwidth=40, anchor=anchor)
    for i, row in enumerate(rows):
        tree.insert("", "end", values=row, tags=("stripe" if i % 2 else "plain",))
    tree.tag_configure("stripe", background="#eef2ed")
    tree.pack(fill="x", pady=(5, 12))
    return tree


class Lab:
    def __init__(self, root, data_dir=None, run_dir=None):
        self.root = root
        self.data_dir = Path(data_dir or ml.HOME_DIR / "data")
        self.run_dir = Path(run_dir or ml.HOME_DIR / "runs")
        root.title("Sneaker Lab")
        root.geometry(f"{min(1000, root.winfo_screenwidth() - 35)}x"
                      f"{min(745, root.winfo_screenheight() - 90)}")
        root.minsize(800, 510)
        root.configure(background=PAPER)
        style = ttk.Style(root)
        style.theme_use("clam")
        style.configure(".", font=(FONT, 10), background=PAPER, foreground=INK)
        style.configure("TLabel", background=PAPER, foreground=INK)
        style.configure("Title.TLabel", font=(FONT, 25, "bold"))
        style.configure("Section.TLabel", font=(FONT, 13, "bold"))
        style.configure("Muted.TLabel", foreground=MUTED)
        style.configure("Result.TLabel", foreground=TEAL, font=(FONT, 11, "bold"))
        style.configure("Error.TLabel", foreground="#933721")
        style.configure("TButton", padding=(9, 6), background="#e6eae3")
        style.configure("Primary.TButton", background=TEAL, foreground="white")
        style.map("Primary.TButton", background=[("disabled", "#d4dbd5"),
                                                   ("active", "#0a564f")],
                  foreground=[("disabled", "#5c6a64")])
        style.configure("Treeview", rowheight=25, background="white",
                        fieldbackground="white", borderwidth=0)
        style.configure("Treeview.Heading", background=LIGHT, padding=(3, 4),
                        font=(FONT, 10, "bold"))

        rail = tk.Frame(root, bg=RAIL, padx=12, pady=22)
        rail.pack(side="left", fill="y")
        tk.Label(rail, text="Sneaker Lab", bg=RAIL, fg="white",
                 font=(FONT, 20, "bold")).pack(anchor="w", padx=5, pady=(0, 25))
        self.nav = []
        for index, title in enumerate(STEPS):
            item = tk.Button(rail, text=f"{index + 1}   {title}", anchor="w",
                             font=(FONT, 11), relief="flat", borderwidth=0,
                             padx=10, pady=9, activebackground=TEAL,
                             activeforeground="white", disabledforeground="#9ab1aa",
                             command=lambda i=index: self.show(i))
            item.pack(fill="x", pady=2)
            self.nav.append(item)

        main = ttk.Frame(root, padding=(22, 18, 14, 8))
        main.pack(side="left", fill="both", expand=True)
        self.heading = caption(main, "", "Title.TLabel", pady=(0, 8))
        viewport = ttk.Frame(main)
        viewport.pack(fill="both", expand=True)
        self.canvas = tk.Canvas(viewport, bg=PAPER, highlightthickness=0)
        self.canvas.pack(side="left", fill="both", expand=True)
        scroll = ttk.Scrollbar(viewport, command=self.canvas.yview)
        scroll.pack(side="right", fill="y")
        self.canvas.configure(yscrollcommand=scroll.set)
        self.body = ttk.Frame(self.canvas, padding=(0, 2, 9, 3))
        window = self.canvas.create_window((0, 0), window=self.body, anchor="nw")
        self.body.bind("<Configure>", lambda _: self.canvas.configure(
            scrollregion=self.canvas.bbox("all")))
        self.canvas.bind("<Configure>", lambda e: self.canvas.itemconfigure(
            window, width=e.width))
        root.bind("<MouseWheel>", self.mouse_wheel, add="+")
        ttk.Separator(main).pack(fill="x", pady=(6, 5))
        self.actions = ttk.Frame(main)
        self.actions.pack(fill="x")
        self.status = caption(main, "", "Muted.TLabel", pady=(4, 0))
        self.busy = False
        self.data = None
        self.photos = []
        self.experiment()

    def experiment(self):
        self.models = {}
        self.validation = {}
        self.cases = {}
        self.reviewed = {}
        self.reward_log = []
        self.report = self.report_path = None
        self.kind = tk.StringVar(value=ml.FALSE_ALARM)
        self.position = {ml.FALSE_ALARM: 0, ml.MISS: 0}
        self.passes = tk.StringVar(value="4")
        self.selected = tk.StringVar(value=ml.TUNED)
        self.cutoff = tk.StringVar(value="0.50")
        self.notice("Ready.")
        self.show(0)

    def mouse_wheel(self, event):
        if self.canvas.yview() != (0.0, 1.0):
            self.canvas.yview_scroll(-int(event.delta / 120), "units")

    def notice(self, text, error=False):
        self.status.configure(text=text, style="Error.TLabel" if error else "Muted.TLabel")

    def show(self, page):
        available = 1 + len(self.models) if self.data is not None else 0
        if self.busy or page > available:
            return
        self.page = page
        for index, item in enumerate(self.nav):
            item.configure(bg=TEAL if index == page else RAIL, fg="white",
                           state="normal" if index <= available else "disabled")
        for frame in (self.body, self.actions):
            for widget in frame.winfo_children():
                widget.destroy()
        self.photos.clear()
        self.canvas.yview_moveto(0)
        self.heading.configure(text=STEPS[page])
        (self.prepare_page, self.base_page, self.review_page, self.tune_page,
         self.evaluate_page)[page]()

    def job(self, message, work, done):
        """Only the Tk thread touches widgets. A failed operation can be retried."""
        if self.busy:
            return
        self.busy = True
        self.notice(message)
        for item in self.nav:
            item.configure(state="disabled")
        pending = [self.body, self.actions]
        while pending:
            widget = pending.pop()
            pending.extend(widget.winfo_children())
            if isinstance(widget, (ttk.Button, ttk.Combobox)):
                widget.state(["disabled"])
        events = queue.Queue()

        def worker():
            try:
                value = work(lambda text: events.put(("progress", text)))
                events.put(("done", value))
            except Exception as error:
                events.put(("error", str(error)))

        def poll():
            while True:
                try:
                    kind, value = events.get_nowait()
                except queue.Empty:
                    self.root.after(35, poll)
                    return
                if kind == "progress":
                    self.notice(value)
                    continue
                self.busy = False
                if kind == "error":
                    self.show(self.page)
                    self.notice(value, error=True)
                else:
                    done(value)
                return

        threading.Thread(target=worker, daemon=True).start()
        self.root.after(20, poll)

    def image_tile(self, parent, pixels, size, zoom, label):
        tile = ttk.Frame(parent, padding=(0, 3, 14, 3))
        tile.pack(side="left", anchor="n")
        pgm = f"P5\n{size} {size}\n255\n".encode() + pixels
        photo = tk.PhotoImage(master=self.root, data=pgm, format="PPM").zoom(zoom)
        self.photos.append(photo)
        ttk.Label(tile, image=photo).pack(anchor="w")
        caption(tile, label, "Muted.TLabel", pady=(3, 0))

    def next_button(self, label):
        button(self.actions, label, lambda: self.show(self.page + 1), primary=True)

    def prepare_page(self):
        caption(self.body, "Can a model tell a sneaker from a sandal or an ankle "
                "boot? Train it on labeled catalog photos, then inspect its mistakes.")
        caption(self.body, "Fashion-MNIST footwear", "Section.TLabel", pady=(15, 2))
        if self.data:
            samples = ttk.Frame(self.body)
            samples.pack(anchor="w", pady=(0, 6))
            for category, name in ml.CATEGORIES.items():
                shoe = next(s for s in self.data.base if s.category == category)
                self.image_tile(samples, shoe.pixels, 28, 3, name)
        table(self.body, [("Group", 140), ("Images", 55), ("Used for", 220)], [
            ("Base training", "300", "Learn the first weights"),
            ("Mistake review", "1,500", "Find and label mistakes"),
            ("Fine-tuning", "13,800", "Continue training"),
            ("Validation", "2,400", "Choose the model and cutoff"),
            ("Final test", "3,000", "Measure the frozen choice"),
        ])
        caption(self.body, "Images stay on this computer. Prepare data checks the "
                "local archives and downloads any missing or damaged file.")
        caption(self.body, str(self.data_dir), "Muted.TLabel", pady=(4, 2))
        if self.data:
            self.next_button("Go to base training")
        else:
            button(self.actions, "Prepare data", self.prepare, primary=True)

    def prepare(self):
        def ready(data):
            self.data = data
            self.show(0)
            self.notice("Data ready. Open base training to learn the first model.")
        self.job("Preparing the images …",
                 lambda progress: ml.prepare_data(self.data_dir, progress), ready)

    def history_table(self, model):
        caption(self.body, "Training history", "Section.TLabel", pady=(12, 0))
        table(self.body, [("Pass", 45), ("Validation loss", 115), ("Precision", 85),
                          ("Recall", 75)], [
            (r["pass"], f"{r['validation_loss']:.4f}", percent(r["precision"]),
             percent(r["recall"])) for r in model.history
        ])
        caption(self.body, f"Kept pass {model.best_pass} of {len(model.history)} "
                f"with the lowest validation loss. Training took {model.seconds:.3f} s.",
                "Result.TLabel")

    def base_page(self):
        caption(self.body, "Start with 100 labeled images of each shoe type. The "
                "model measures brightness in 49 squares and learns how much each "
                "square contributes to a sneaker score.")
        shoe = next(s for s in self.data.base if s.target)
        self.feature_pair(shoe)
        caption(self.body, "One pass visits every training shoe. After each pass, "
                "validation loss measures prediction error on separate images. "
                "A lower loss is better.", pady=(7, 1))
        if ml.BASE in self.models:
            self.history_table(self.models[ml.BASE])
            self.next_button("Review mistakes")
        else:
            button(self.actions, "Train base model", self.train_base, primary=True)

    def feature_pair(self, shoe):
        row = ttk.Frame(self.body)
        row.pack(anchor="w", pady=(9, 4))
        self.image_tile(row, shoe.pixels, 28, 4, "Original · 28 × 28")
        cells = bytes(round(f * 255) for f in shoe.features[:-1])
        self.image_tile(row, cells, 7, 16, "Model input · 7 × 7")

    def keep_model(self, name, model):
        self.models[name] = model
        self.validation[name] = ml.scored(model.weights, self.data.validation)

    def train_base(self):
        def ready(model):
            self.keep_model(ml.BASE, model)
            self.cases = ml.review_mistakes(model.weights, self.data.review)
            self.show(1)
            self.notice("Base model ready. Review real errors from the review group.")
        self.job("Training the base model …",
                 lambda progress: ml.train_base(self.data, progress), ready)

    def review_page(self):
        caption(self.body, "A false positive (false alarm) calls another shoe a "
                "sneaker. A false negative (miss) overlooks a sneaker. Inspect a "
                "case and choose the label you trust.")
        kind = self.kind.get()
        cases = self.cases[kind]
        line = ttk.Frame(self.body)
        line.pack(anchor="w", pady=(10, 2))
        choices = ttk.Combobox(line, textvariable=self.kind, values=list(self.cases),
                               state="readonly", width=17)
        choices.pack(side="left", padx=(0, 10))
        choices.bind("<<ComboboxSelected>>", lambda _: self.show(2))
        ttk.Label(line, text=f"{len(cases)} cases at cutoff 0.50").pack(side="left")
        if cases:
            index = self.position[kind]
            shoe, probability = cases[index]
            pred = "Sneaker" if probability >= 0.5 else "Other shoe"
            caption(self.body, f"Case {index + 1} of {len(cases)}    ·    Catalog "
                    f"label  {ml.CATEGORIES[shoe.category]}", "Section.TLabel")
            self.feature_pair(shoe)
            caption(self.body, f"Base prediction  {pred}    ·    Sneaker score  "
                    f"{probability:.2f}")
            for name in (ml.FEEDBACK, ml.TUNED):
                if name in self.models:
                    updated = ml.score(self.models[name].weights, shoe.features)
                    caption(self.body, f"{name} score on this shoe  {updated:.2f}",
                            "Muted.TLabel")
            if shoe.index in self.reviewed:
                label = "Sneaker" if self.reviewed[shoe.index][1] else "Other shoe"
                caption(self.body, f"Your label  {label}", "Result.TLabel")
            row = ttk.Frame(self.body)
            row.pack(anchor="w", pady=(5, 0))
            if ml.FEEDBACK not in self.models:
                button(row, "Label sneaker", lambda: self.next_case(1))
                button(row, "Label other shoe", lambda: self.next_case(0))
            button(row, "Next image", lambda: self.next_case(None))
        caption(self.body, f"{len(self.reviewed)} reviewed examples selected",
                "Result.TLabel", pady=(9, 2))
        if ml.FEEDBACK in self.models:
            plus = sum(entry["reward"] == 1 for entry in self.reward_log)
            caption(self.body, f"Sampled answers earned {plus} positive rewards "
                    f"and {len(self.reward_log) - plus} negative rewards.")
            self.metric_table(self.body, {name: ml.metrics(self.validation[name])
                              for name in (ml.BASE, ml.FEEDBACK)})
            self.next_button("Go to fine-tuning")
        else:
            caption(self.body, "For a quick demo, use the catalog labels for the "
                    "first 10 cases of each kind. Apply rewards lets the model try "
                    "one answer per reviewed shoe. It earns +1 for a match and "
                    "−1 for a disagreement with your label.")
            button(self.actions, "Apply rewards", self.apply_rewards, primary=True,
                   enabled=bool(self.reviewed) or not any(self.cases.values()))
            button(self.actions, "Use 10 of each", self.batch_review)

    def next_case(self, label):
        kind = self.kind.get()
        cases = self.cases[kind]
        index = self.position[kind]
        if label is not None:
            shoe = cases[index][0]
            self.reviewed[shoe.index] = (shoe, label)
        self.position[kind] = (index + 1) % len(cases)
        self.show(2)

    def batch_review(self):
        for cases in self.cases.values():
            for shoe, _ in cases[:10]:
                self.reviewed.setdefault(shoe.index, (shoe, shoe.target))
        self.show(2)
        self.notice("Catalog examples added. Your existing labels were kept.")

    def apply_rewards(self):
        def ready(result):
            model, self.reward_log = result
            self.keep_model(ml.FEEDBACK, model)
            self.show(2)
            self.notice("Feedback applied. Compare validation results below.")
        self.job("Learning from reviewed examples …",
                 lambda _: ml.reinforce(self.models[ml.BASE], self.reviewed.values()),
                 ready)

    def tune_page(self):
        caption(self.body, f"Continue from the feedback weights using "
                f"{len(self.data.tune):,} fresh labeled images and "
                f"{len(self.reviewed)} reviewed examples. Each update is smaller "
                "than in base training.")
        if ml.TUNED in self.models:
            self.history_table(self.models[ml.TUNED])
            self.next_button("Compare models")
        else:
            row = ttk.Frame(self.body)
            row.pack(anchor="w", pady=(14, 7))
            ttk.Label(row, text="Training passes").pack(side="left", padx=(0, 9))
            ttk.Combobox(row, textvariable=self.passes, values=list(range(1, 9)),
                         state="readonly", width=4).pack(side="left")
            caption(self.body, "The app keeps the pass with the lowest validation "
                    "loss. Extra passes can improve or worsen that score.")
            button(self.actions, "Fine-tune model", self.train_more, primary=True)

    def train_more(self):
        passes = int(self.passes.get())

        def ready(model):
            self.keep_model(ml.TUNED, model)
            self.show(3)
            self.notice("Fine-tuning complete. Choose using the validation set.")
        self.job("Fine-tuning …", lambda progress: ml.fine_tune(
            self.models[ml.FEEDBACK], self.data, self.reviewed.values(),
            passes, progress), ready)

    def metric_table(self, parent, summaries):
        return table(parent, [("Model", 105), ("Accuracy", 69), ("Precision", 69),
                              ("Recall", 63), ("False alarms", 83), ("Misses", 52)], [
            (name, percent(m["accuracy"]), percent(m["precision"]),
             percent(m["recall"]), m["fp"], m["fn"])
            for name, m in summaries.items()
        ])

    def evaluate_page(self):
        if self.report:
            caption(self.body, f"{self.report['selected_model']}    ·    Frozen "
                    f"cutoff {self.report['cutoff']:.2f}", "Result.TLabel")
            caption(self.body, "Final test · 3,000 shoes", "Section.TLabel",
                    pady=(11, 0))
            self.metric_table(self.body, self.report["test"])
            final = self.report["test"][self.report["selected_model"]]
            caption(self.body, "Every test shoe", "Section.TLabel", pady=(8, 0))
            table(self.body, [("Catalog label", 150), ("Called sneaker", 110),
                              ("Called other", 110)], [
                ("Sneaker", final["tp"], final["fn"]),
                ("Other shoe", final["fp"], final["tn"]),
            ])
            caption(self.body, "Saved model weights, labels, settings and results",
                    "Section.TLabel", pady=(8, 1))
            caption(self.body, str(self.report_path), "Muted.TLabel")
            button(self.actions, "Open results folder",
                   lambda: os.startfile(self.report_path.parent), primary=True)
            button(self.actions, "New experiment", self.experiment)
            return
        caption(self.body, "Choose a model and the minimum sneaker score needed "
                "to call a shoe a sneaker. Try a higher cutoff to reduce false "
                "alarms, or a lower cutoff to catch more sneakers.")
        row = ttk.Frame(self.body)
        row.pack(anchor="w", pady=(14, 6))
        for title, variable, options, width in (
                ("Model", self.selected, list(self.models), 15),
                ("Cutoff", self.cutoff, [f"{i / 100:.2f}" for i in range(10, 91, 5)], 6)):
            ttk.Label(row, text=title).pack(side="left", padx=(0, 5))
            field = ttk.Combobox(row, textvariable=variable, values=options,
                                 state="readonly", width=width)
            field.pack(side="left", padx=(0, 12))
            field.bind("<<ComboboxSelected>>", lambda _: self.show(4))
        caption(self.body, "Validation · 2,400 shoes", "Section.TLabel", pady=(9, 0))
        self.metric_table(self.body, {name: ml.metrics(scores, float(self.cutoff.get()))
                          for name, scores in self.validation.items()})
        caption(self.body, "Precision asks how many sneaker calls were right. "
                "Recall asks how many actual sneakers were found.")
        caption(self.body, "Lock and test saves your choice and scores it once on "
                "3,000 unseen shoes. The base model uses the same cutoff for a "
                "fair comparison.", "Muted.TLabel", pady=(12, 0))
        button(self.actions, "Lock and test", self.final_test, primary=True)

    def final_test(self):
        selected, cutoff = self.selected.get(), float(self.cutoff.get())

        def ready(result):
            self.report_path, self.report = result
            self.show(4)
            self.notice("Experiment saved. The test result is fixed for this run.")
        self.job("Evaluating the frozen choice on the official test images …",
                 lambda _: ml.finish_run(self.data_dir, self.run_dir, self.data,
                                         self.models, self.reward_log, selected, cutoff),
                 ready)


if __name__ == "__main__":
    if sys.version_info < (3, 12):
        raise SystemExit("Sneaker Lab requires Python 3.12 or newer with Tk.")
    root = tk.Tk()
    Lab(root)
    root.mainloop()
