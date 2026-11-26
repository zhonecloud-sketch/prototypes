# /// script
# requires-python = ">=3.11"
# dependencies = ["numpy>=2.3,<3"]
# ///
"""Equation Explorer desktop application."""

import csv
import math
import tkinter as tk
from pathlib import Path
from tkinter import filedialog, messagebox, ttk

import numpy as np

from dataset import Dataset, generate_dataset, parse_equation, read_dataset, write_dataset
from engine import Fit, Round, Search


BACKGROUND = "#eef2f8"
PAPER = "#ffffff"
INK = "#17253c"
MUTED = "#52627a"
BORDER = "#d7dfed"
GRID = "#e7edf5"
ACCENT = "#444cc0"
DARK_ACCENT = "#343ca3"
POINT = "#466686"
VALIDATION = "#00826c"
FONT = ("Segoe UI", 10)
SMALL = ("Segoe UI", 9)


def metric(value: float | None) -> str:
    return "—" if value is None else f"{value:.5g}"


class Plot(tk.Canvas):
    def __init__(self, parent):
        super().__init__(parent, background=PAPER, highlightthickness=0, width=360, height=220)
        self.data: Dataset | None = None
        self.model: Fit | None = None
        self.validation_mask = None
        self.bind("<Configure>", self.redraw)

    def show(self, data, model=None, validation_mask=None):
        self.data, self.model, self.validation_mask = data, model, validation_mask
        self.redraw()

    def redraw(self, _event=None):
        self.delete("all")
        width, height = self.winfo_width(), self.winfo_height()
        if width < 150 or height < 130:
            return
        if self.data is None:
            self.create_text(width / 2, height / 2, text="Observations will appear here",
                             fill=MUTED, font=FONT)
            return

        x, y = self.data.x, self.data.y
        x_label, y_label = self.data.inputs[0], self.data.target
        parity = self.model is not None and len(self.data.inputs) > 1
        if parity:
            x, y = self.data.y, self.model.predict(self.data.features)
            x_label, y_label = f"Observed {self.data.target}", f"Predicted {self.data.target}"
        finite = np.isfinite(y)
        if not np.any(finite):
            return
        x_scale = float(np.max(np.abs(x))) or 1
        y_scale = float(np.max(np.abs(y[finite]))) or 1
        if parity:
            x_scale = y_scale = max(x_scale, y_scale)
        x_norm, y_norm = x / x_scale, y / y_scale
        x_min, x_max = float(np.min(x_norm)), float(np.max(x_norm))
        y_min, y_max = float(np.min(y_norm[finite])), float(np.max(y_norm[finite]))
        if parity:
            y_min, y_max = min(x_min, y_min), max(x_max, y_max)
        y_padding = (y_max - y_min) * 0.087 or 0.1
        y_min, y_max = y_min - y_padding, y_max + y_padding
        if parity:
            x_min, x_max = y_min, y_max
        left, right = 67, width - 25
        top, bottom = 16, height - 43

        def px(value):
            return left + (value - x_min) / (x_max - x_min or 1) * (right - left)

        def py(value):
            return bottom - (value - y_min) / (y_max - y_min) * (bottom - top)

        for value in np.linspace(y_min, y_max, 5):
            pos = py(value)
            self.create_line(left, pos, right, pos, fill=GRID)
            self.create_text(left - 9, pos, text=f"{float(value) * y_scale:.4g}",
                             anchor="e", fill=MUTED, font=SMALL)
        for value in np.linspace(x_min, x_max, min(6, max(3, (right - left) // 74))):
            pos = px(value)
            self.create_line(pos, top, pos, bottom, fill=GRID)
            self.create_text(pos, bottom + 13, text=f"{float(value) * x_scale:.4g}",
                             fill=MUTED, font=SMALL)
        self.create_line(left, top, left, bottom, right, bottom, fill=BORDER, width=1)
        self.create_text(10, (top + bottom) / 2, text=y_label, angle=90, fill=INK, font=FONT)
        self.create_text((right + left) / 2, height - 9, text=x_label, fill=INK, font=FONT)

        if parity:
            self.create_line(left, bottom, right, top, fill=ACCENT, width=2, dash=(5, 3))
        elif self.model is not None:
            curve_x = np.linspace(x_min, x_max, 420)
            if self.model.family.domain == "nonzero" and x_min < 0 < x_max:
                curve_x = np.sort(np.append(curve_x, 0))
            with np.errstate(all="ignore"):
                curve_y = self.model.predict(curve_x * x_scale) / y_scale
            points = []
            for xx, yy in zip(curve_x, curve_y):
                if math.isfinite(yy) and y_min <= yy <= y_max:
                    points.extend((px(xx), py(yy)))
                else:
                    if len(points) >= 4:
                        self.create_line(*points, fill=ACCENT, width=2)
                    points = []
            if len(points) >= 4:
                self.create_line(*points, fill=ACCENT, width=2)

        if self.validation_mask is None:
            self.draw_points(np.flatnonzero(finite), x_norm, y_norm, px, py, POINT, False)
        else:
            self.draw_points(np.flatnonzero(finite & ~self.validation_mask), x_norm, y_norm, px, py, POINT, False)
            self.draw_points(np.flatnonzero(finite & self.validation_mask), x_norm, y_norm, px, py, VALIDATION, True)

    def draw_points(self, indices, x, y, px, py, color, square):
        if len(indices) > 900:
            indices = indices[np.linspace(0, len(indices) - 1, 900, dtype=int)]
        draw = self.create_rectangle if square else self.create_oval
        radius = 2 if len(indices) > 120 else 3
        for index in indices:
            a, b = px(x[index]), py(y[index])
            draw(a - radius, b - radius, a + radius, b + radius,
                 fill=PAPER if square else color, outline=color)


class Application:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.data: Dataset | None = None
        self.generated: Dataset | None = None
        self.search: Search | None = None
        self.history: list[Round] = []
        self.finished = False
        self.playing = False
        self.job = None
        root.title("Equation Explorer")
        root.geometry("1180x815")
        root.minsize(960, 710)
        root.configure(background=BACKGROUND)
        self.configure_styles()

        header = ttk.Frame(root, padding=(26, 18, 26, 12))
        header.pack(fill="x")
        ttk.Label(header, text="Equation Explorer", style="Title.TLabel").pack(anchor="w")
        ttk.Label(header, text="Fit equations to observed data or generate a dataset from your own equation.",
                  style="Muted.TLabel").pack(anchor="w", pady=(3, 0))
        self.tabs = ttk.Notebook(root)
        self.tabs.pack(fill="both", expand=True, padx=25, pady=(0, 23))
        self.search_tab = ttk.Frame(self.tabs, padding=16)
        self.generator_tab = ttk.Frame(self.tabs, padding=16)
        self.tabs.add(self.search_tab, text="Equation search")
        self.tabs.add(self.generator_tab, text="Dataset generator")
        self.build_search()
        self.build_generator()
        root.protocol("WM_DELETE_WINDOW", self.close)

    def configure_styles(self):
        style = ttk.Style(self.root)
        style.theme_use("clam")
        style.configure(".", font=FONT, background=BACKGROUND, foreground=INK, bordercolor=BORDER,
                        darkcolor=BORDER, lightcolor=PAPER, troughcolor=BACKGROUND,
                        fieldbackground=PAPER, focuscolor=ACCENT)
        style.configure("TFrame", background=BACKGROUND)
        style.configure("Card.TFrame", background=PAPER, relief="flat")
        style.configure("Title.TLabel", font=("Segoe UI", 27, "bold"))
        style.configure("Muted.TLabel", foreground=MUTED)
        style.configure("Card.TLabel", background=PAPER)
        style.configure("CardMuted.TLabel", background=PAPER, foreground=MUTED, font=SMALL)
        style.configure("CardHeading.TLabel", background=PAPER, font=("Segoe UI", 12, "bold"))
        style.configure("TNotebook", background=BACKGROUND, borderwidth=0, tabmargins=(0, 1, 0, 0))
        style.configure("TNotebook.Tab", padding=(17, 9), font=("Segoe UI", 10, "bold"))
        style.map("TNotebook.Tab", background=[("selected", PAPER), ("!selected", "#e1e8f3")],
                  foreground=[("selected", ACCENT), ("!selected", MUTED)],
                  expand=[("selected", (0, 0, 0, 0)), ("!selected", (0, 0, 0, 0))])
        style.configure("TButton", padding=(12, 6), background=PAPER, borderwidth=1)
        style.map("TButton", background=[("active", "#e8ecfd"), ("disabled", "#e7edf5")],
                  foreground=[("disabled", "#657487")])
        style.configure("Action.TButton", padding=(13, 6), background=ACCENT, foreground=PAPER,
                        bordercolor=ACCENT, lightcolor=ACCENT, darkcolor=ACCENT)
        style.map("Action.TButton", background=[("disabled", "#e4e9f4"), ("active", DARK_ACCENT)],
                  foreground=[("disabled", "#657487")])
        style.configure("TEntry", padding=(7, 5), insertcolor=INK)
        style.configure("Formula.TEntry", font=("Consolas", 13), padding=(8, 6))
        style.map("Formula.TEntry", fieldbackground=[("readonly", "#f4f6fc")])
        style.configure("TRadiobutton", background=PAPER)
        style.map("TRadiobutton", background=[("active", PAPER)])
        style.configure("Treeview", background=PAPER, fieldbackground=PAPER, rowheight=27, borderwidth=0)
        style.configure("Treeview.Heading", background="#edf1fa", font=("Segoe UI", 9, "bold"),
                        foreground=INK, relief="flat", padding=(4, 4))
        style.map("Treeview", background=[("selected", "#e1e5fd")], foreground=[("selected", INK)])

    def card(self, parent):
        return ttk.Frame(parent, style="Card.TFrame", padding=13)

    def table(self, parent, columns, height):
        frame = ttk.Frame(parent, style="Card.TFrame")
        frame.columnconfigure(0, weight=1)
        frame.rowconfigure(0, weight=1)
        tree = ttk.Treeview(frame, columns=[column[0] for column in columns],
                            show="headings", height=height, selectmode="browse")
        self.set_table_columns(tree, columns)
        scroll = ttk.Scrollbar(frame, orient="vertical", command=tree.yview)
        tree.configure(yscrollcommand=scroll.set)
        tree.grid(row=0, column=0, sticky="nsew")
        scroll.grid(row=0, column=1, sticky="ns")
        tree.tag_configure("alternate", background="#f6f8fc")
        return frame, tree

    def set_table_columns(self, tree, columns):
        tree.configure(columns=[column[0] for column in columns])
        for key, label, width, anchor, stretch in columns:
            tree.heading(key, text=label, anchor=anchor)
            tree.column(key, width=width, minwidth=min(width, 60), anchor=anchor, stretch=stretch)

    def build_search(self):
        page = self.search_tab
        page.columnconfigure(0, weight=1)
        page.rowconfigure(2, weight=1)
        toolbar = ttk.Frame(page)
        toolbar.grid(row=0, column=0, sticky="ew", pady=(0, 12))
        toolbar.columnconfigure(1, weight=1)
        ttk.Button(toolbar, text="Open dataset…", command=self.open_file).grid(row=0, column=0, padx=(0, 10))
        self.dataset_label = tk.StringVar(value="CSV, TSV or JSON · result column last")
        ttk.Label(toolbar, textvariable=self.dataset_label, style="Muted.TLabel").grid(row=0, column=1, sticky="w")
        self.step_button = ttk.Button(toolbar, text="Next step", command=self.advance)
        self.step_button.grid(row=0, column=2, padx=(6, 8))
        self.run_button = ttk.Button(toolbar, text="Run search", style="Action.TButton", command=self.toggle_run)
        self.run_button.grid(row=0, column=3)

        result = self.card(page)
        result.grid(row=1, column=0, sticky="ew", pady=(0, 12))
        result.columnconfigure(0, weight=1)
        self.result_title = tk.StringVar(value="Equation")
        ttk.Label(result, textvariable=self.result_title, style="CardHeading.TLabel").grid(row=0, column=0, sticky="w")
        self.result_metrics = tk.StringVar()
        ttk.Label(result, textvariable=self.result_metrics, style="CardMuted.TLabel").grid(row=0, column=1, sticky="e")
        self.equation = tk.StringVar()
        self.formula = ttk.Entry(result, textvariable=self.equation, style="Formula.TEntry", state="readonly")
        self.formula.grid(row=1, column=0, sticky="ew", pady=(7, 0))
        self.copy_button = ttk.Button(result, text="Copy equation", command=self.copy_equation, state="disabled")
        self.copy_button.grid(row=1, column=1, sticky="e", padx=(8, 0), pady=(7, 0))

        work = ttk.Frame(page)
        work.grid(row=2, column=0, sticky="nsew")
        work.columnconfigure(0, weight=1, minsize=360)
        work.columnconfigure(1, weight=1, minsize=484)
        work.rowconfigure(0, weight=1)
        chart = self.card(work)
        chart.grid(row=0, column=0, sticky="nsew", padx=(0, 12))
        chart.columnconfigure(0, weight=1)
        chart.rowconfigure(1, weight=1)
        ttk.Label(chart, text="Data and fit", style="CardHeading.TLabel").grid(row=0, column=0, sticky="w")
        self.search_plot = Plot(chart)
        self.search_plot.grid(row=1, column=0, sticky="nsew", pady=(7, 8))
        legend = ttk.Frame(chart, style="Card.TFrame")
        legend.grid(row=2, column=0, sticky="w")
        for text, color in (("● Observed", POINT), ("□ Held out", VALIDATION)):
            ttk.Label(legend, text=text, foreground=color, style="Card.TLabel", font=SMALL).pack(side="left", padx=(0, 12))
        self.fit_legend = ttk.Label(legend, text="━ Fitted curve", foreground=ACCENT, style="Card.TLabel", font=SMALL)
        self.fit_legend.pack(side="left")

        timeline = self.card(work)
        timeline.grid(row=0, column=1, sticky="nsew")
        timeline.columnconfigure(0, weight=1)
        timeline.rowconfigure(1, weight=1)
        ttk.Label(timeline, text="Training steps", style="CardHeading.TLabel").grid(row=0, column=0, sticky="w")
        columns = (("step", "#", 32, "center", False), ("phase", "Phase", 78, "w", False),
                   ("family", "Candidate", 128, "w", True), ("fit", "Fit RMSE", 69, "e", False),
                   ("val", "Val. RMSE", 69, "e", False), ("score", "Score", 58, "e", False))
        frame, self.timeline = self.table(timeline, columns, height=8)
        frame.grid(row=1, column=0, sticky="nsew", pady=(8, 7))
        self.timeline.bind("<<TreeviewSelect>>", self.inspect_step)
        self.timeline.tag_configure("final", background="#e7e9fc", foreground=DARK_ACCENT)
        self.detail = tk.Text(timeline, height=3, width=28, background="#f4f6fc", foreground=INK,
                              relief="flat", borderwidth=0, wrap="word", padx=8, pady=6,
                              font=SMALL, state="disabled", takefocus=False)
        self.detail.grid(row=2, column=0, sticky="ew")
        self.set_detail("Open a dataset or send one from Dataset generator. Run automatically or advance one step at a time.")
        self.status = tk.StringVar(value="Waiting for a dataset")
        ttk.Label(page, textvariable=self.status, style="Muted.TLabel").grid(row=3, column=0, sticky="w", pady=(9, 0))
        self.update_controls()

    def build_generator(self):
        page = self.generator_tab
        page.columnconfigure(0, minsize=348)
        page.columnconfigure(1, weight=1)
        page.rowconfigure(0, weight=1)
        form = self.card(page)
        form.grid(row=0, column=0, sticky="nsew", padx=(0, 12))
        form.columnconfigure((0, 1), weight=1, uniform="generator")
        ttk.Label(form, text="Generation settings", style="CardHeading.TLabel").grid(row=0, column=0, columnspan=2, sticky="w")
        self.generator_vars = {key: tk.StringVar(value=value) for key, value in (
            ("expression", "1/x^2"), ("count", "100"), ("seed", ""), ("noise", "0"), ("mode", "Random"),
        )}
        ttk.Label(form, text="Equation", style="Card.TLabel").grid(row=1, column=0, columnspan=2, sticky="w", pady=(10, 4))
        equation_entry = ttk.Entry(form, textvariable=self.generator_vars["expression"], width=26)
        equation_entry.grid(row=2, column=0, columnspan=2, sticky="ew")
        equation_entry.bind("<Return>", lambda _event: self.generate())
        ttk.Label(form, text="Use ^ for powers and * for multiplication.\nExample  z = 1/x^2 + 2*y^3",
                  style="CardMuted.TLabel", wraplength=315).grid(row=3, column=0, columnspan=2, sticky="ew", pady=(6, 2))
        self.input_summary = tk.StringVar()
        ttk.Label(form, textvariable=self.input_summary, style="CardMuted.TLabel", wraplength=315).grid(
            row=4, column=0, columnspan=2, sticky="ew", pady=(1, 3))
        range_form = ttk.Frame(form, style="Card.TFrame")
        range_form.grid(row=5, column=0, columnspan=2, sticky="ew", pady=(4, 0))
        range_form.columnconfigure((0, 1, 2), weight=1, uniform="ranges")
        for column, label in enumerate(("Input range", "Minimum", "Maximum")):
            ttk.Label(range_form, text=label, style="Card.TLabel").grid(row=0, column=column, sticky="w", pady=(0, 4))
        self.range_vars: dict[str, tuple[tk.StringVar, tk.StringVar]] = {}
        self.range_name = tk.StringVar()
        self.range_picker = ttk.Combobox(range_form, textvariable=self.range_name, state="readonly", width=7)
        self.range_picker.grid(row=1, column=0, sticky="ew", padx=(0, 8))
        self.range_entries = [ttk.Entry(range_form, width=7) for _ in range(2)]
        for column, entry in enumerate(self.range_entries, start=1):
            entry.grid(row=1, column=column, sticky="ew", padx=(0, 8) if column == 1 else 0)
        self.range_name.trace_add("write", self.switch_range)
        for row, col, key, label in ((6, 0, "count", "Rows"), (6, 1, "seed", "Random seed (optional)"),
                                      (8, 0, "noise", "Noise standard deviation")):
            ttk.Label(form, text=label, style="Card.TLabel").grid(row=row, column=col, sticky="w", pady=(8, 4))
            ttk.Entry(form, textvariable=self.generator_vars[key], width=12).grid(
                row=row + 1, column=col, sticky="ew", padx=(0, 9) if col == 0 else 0)
        ttk.Label(form, text="Sampling", style="Card.TLabel").grid(row=10, column=0, columnspan=2, sticky="w", pady=(9, 3))
        for column, mode in enumerate(("Random", "Sequential")):
            ttk.Radiobutton(form, text=mode, variable=self.generator_vars["mode"], value=mode).grid(
                row=11, column=column, sticky="w")
        ttk.Label(form, text="Random samples each range independently. Sequential spaces each input evenly.",
                  style="CardMuted.TLabel", wraplength=315).grid(row=12, column=0, columnspan=2, sticky="ew", pady=(4, 10))
        ttk.Button(form, text="Generate dataset", style="Action.TButton", command=self.generate).grid(
            row=13, column=0, columnspan=2, sticky="ew")

        preview = self.card(page)
        preview.grid(row=0, column=1, sticky="nsew")
        preview.columnconfigure(0, weight=1)
        preview.rowconfigure(1, weight=1)
        ttk.Label(preview, text="Dataset preview", style="CardHeading.TLabel").grid(row=0, column=0, sticky="w")
        self.generator_plot = Plot(preview)
        self.generator_plot.grid(row=1, column=0, sticky="nsew", pady=(5, 9))
        frame, self.preview_table = self.table(preview, (), height=5)
        frame.grid(row=2, column=0, sticky="ew")
        self.preview_scroll = ttk.Scrollbar(frame, orient="horizontal", command=self.preview_table.xview)
        self.preview_table.configure(xscrollcommand=self.preview_scroll.set)
        self.preview_scroll.grid(row=1, column=0, sticky="ew")
        self.preview_signature = ()
        actions = ttk.Frame(preview, style="Card.TFrame")
        actions.grid(row=3, column=0, sticky="ew", pady=(10, 0))
        self.preview_status = tk.StringVar(value="Generate data to preview and export it.")
        ttk.Label(actions, textvariable=self.preview_status, style="CardMuted.TLabel").pack(side="left")
        self.use_button = ttk.Button(actions, text="Use in search", style="Action.TButton", command=self.send_to_search, state="disabled")
        self.use_button.pack(side="right")
        self.save_button = ttk.Button(actions, text="Save CSV or JSON…", command=self.save_generated, state="disabled")
        self.save_button.pack(side="right", padx=(0, 7))
        for variable in self.generator_vars.values():
            variable.trace_add("write", self.invalidate_generated)
        self.generator_vars["expression"].trace_add("write", self.refresh_ranges)
        self.refresh_ranges()
        self.configure_preview(("x", "y"))

    def open_file(self):
        file = filedialog.askopenfilename(parent=self.root, title="Open a dataset",
                                          filetypes=(("Datasets", "*.csv *.tsv *.json *.txt"), ("All files", "*")))
        if file:
            try:
                self.set_dataset(read_dataset(Path(file)))
            except (OSError, ValueError, csv.Error) as error:
                messagebox.showerror("Could not open dataset", str(error), parent=self.root)

    def set_dataset(self, data: Dataset):
        self.data = data
        name = data.name if len(data.name) <= 45 else data.name[:41] + "…"
        input_count = len(data.inputs)
        self.dataset_label.set(f"{name}  ·  {len(data.x):,} rows  ·  {input_count} {'input' if input_count == 1 else 'inputs'}")
        self.reset_search()
        self.set_detail("Run the search or inspect each round with Next step.")
        self.status.set("Ready to search")

    def reset_search(self):
        self.pause()
        self.search = None
        self.history.clear()
        self.finished = False
        self.timeline.delete(*self.timeline.get_children())
        self.show_step(None)
        self.update_controls()

    def set_detail(self, text: str):
        self.detail.configure(state="normal")
        self.detail.delete("1.0", "end")
        self.detail.insert("1.0", text)
        self.detail.configure(state="disabled")

    def update_controls(self):
        self.run_button.configure(state="normal" if self.data is not None else "disabled",
                                  text="Pause" if self.playing else "Run again" if self.finished
                                  else "Resume" if self.search is not None else "Run search")
        self.step_button.configure(state="normal" if self.data is not None and not self.playing
                                   and not self.finished else "disabled")

    def pause(self):
        self.playing = False
        if self.job is not None:
            self.root.after_cancel(self.job)
            self.job = None
        self.update_controls()

    def toggle_run(self):
        if self.playing:
            self.pause()
            self.status.set(f"Paused at step {len(self.history)}")
            return
        if self.finished:
            self.reset_search()
        self.playing = True
        self.update_controls()
        self.tick()

    def tick(self):
        self.job = None
        self.advance()
        if self.playing:
            self.job = self.root.after(45, self.tick)

    def advance(self):
        if self.data is None or self.finished:
            return
        try:
            if self.search is None:
                self.search = Search(self.data)
            step = next(self.search.rounds)
        except (ValueError, ArithmeticError, np.linalg.LinAlgError) as error:
            self.pause()
            self.finished = True
            self.update_controls()
            self.status.set("Search stopped")
            messagebox.showerror("Could not finish the search", str(error), parent=self.root)
            return
        self.history.append(step)
        index = len(self.history)
        identifier = str(index)
        model = step.model
        values = (index, step.phase, step.family, metric(model.train_rmse if model else None),
                  metric(model.validation_rmse if model else None),
                  metric(model.score if model and step.ranked else None))
        tag = "final" if step.final else "alternate" if index % 2 == 0 else ""
        self.timeline.insert("", "end", identifier, values=values, tags=(tag,))
        self.timeline.focus(identifier)
        self.timeline.selection_set(identifier)
        self.timeline.see(identifier)
        if step.final:
            self.finished = True
            self.pause()
            self.status.set(f"Search complete  ·  {len(self.search.rankings)} ranked candidates  ·  {index} steps")
        else:
            self.status.set(f"Step {index}  ·  {step.phase}  ·  {len(self.search.rankings)} ranked candidates")
        self.update_controls()

    def inspect_step(self, _event=None):
        selected = self.timeline.selection()
        if selected and int(selected[0]) <= len(self.history):
            self.show_step(self.history[int(selected[0]) - 1])

    def show_step(self, step: Round | None):
        model = step.model if step else None
        self.result_title.set(f"Selected equation  ·  {step.family}" if step and step.final
                              else f"Trial equation  ·  {step.family}" if model else "Equation")
        self.equation.set(model.equation if model else "")
        self.formula.xview_moveto(0)
        self.copy_button.configure(state="normal" if model else "disabled")
        stats = ""
        if model is not None:
            label = "All-data RMSE" if step.final and model.validation_rmse is None else "Fit RMSE"
            stats = f"{label}  {metric(model.train_rmse)}"
            if model.validation_rmse is not None:
                stats += f"    Held-out RMSE  {metric(model.validation_rmse)}"
        self.result_metrics.set(stats)
        if step is not None:
            self.set_detail(step.detail)
        mask = self.search.validation_mask if self.search else None
        multi = self.data is not None and len(self.data.inputs) > 1
        legend = ("┄ Perfect agreement" if model else "") if multi else "━ Fitted curve"
        self.fit_legend.configure(text=legend)
        self.search_plot.show(self.data, model, mask)

    def copy_equation(self):
        self.root.clipboard_clear()
        self.root.clipboard_append(self.equation.get())

    def invalidate_generated(self, *_args):
        if self.generated is not None:
            self.generated = None
            self.update_preview("Settings changed. Generate a new dataset.")

    def refresh_ranges(self, *_args):
        try:
            equation = parse_equation(self.generator_vars["expression"].get())
        except ValueError as error:
            self.input_summary.set(str(error))
            return
        for name in equation.inputs:
            if name not in self.range_vars:
                limits = (tk.StringVar(value="1"), tk.StringVar(value="10"))
                for variable in limits:
                    variable.trace_add("write", self.invalidate_generated)
                self.range_vars[name] = limits
        short_names = ", ".join(equation.inputs)
        description = f"Inputs  {short_names}" if len(short_names) <= 24 else f"{len(equation.inputs)} inputs"
        self.input_summary.set(f"{description}  ·  Result  {equation.target}")
        self.configure_preview((*equation.inputs, equation.target))
        self.range_picker.configure(values=equation.inputs)
        if self.range_name.get() not in equation.inputs:
            self.range_name.set(equation.inputs[0])

    def switch_range(self, *_args):
        for entry, variable in zip(self.range_entries, self.range_vars.get(self.range_name.get(), ())):
            entry.configure(textvariable=variable)

    def generate(self):
        settings = {name: variable.get().strip() for name, variable in self.generator_vars.items()}
        try:
            equation = parse_equation(settings["expression"])
            ranges = {}
            for name in equation.inputs:
                try:
                    minimum, maximum = (float(var.get()) for var in self.range_vars[name])
                except ValueError as error:
                    raise ValueError(f"Enter numeric minimum and maximum values for {name}.") from error
                ranges[name] = (minimum, maximum)
            start, stop = ranges[equation.inputs[0]]
            self.generated = generate_dataset(equation, start, stop, int(settings["count"]),
                                               settings["mode"], int(settings["seed"]) if settings["seed"] else None,
                                               float(settings["noise"]), input_ranges=ranges)
        except (ValueError, OverflowError) as error:
            messagebox.showerror("Could not generate dataset", str(error), parent=self.root)
            return
        self.update_preview(f"{len(self.generated.x):,} rows generated")

    def configure_preview(self, labels):
        if labels == self.preview_signature:
            return
        self.preview_signature = labels
        many = len(labels) > 4
        columns = [("index", "Row", 62, "center", False)]
        columns.extend((f"c{index}", text, 130 if many else 95, "e", not many)
                       for index, text in enumerate(labels))
        self.set_table_columns(self.preview_table, columns)
        if many:
            self.preview_scroll.grid()
        else:
            self.preview_scroll.grid_remove()

    def update_preview(self, status: str):
        self.preview_status.set(status)
        self.preview_table.delete(*self.preview_table.get_children())
        self.generator_plot.show(self.generated)
        state = "normal" if self.generated is not None else "disabled"
        self.use_button.configure(state=state)
        self.save_button.configure(state=state)
        if self.generated is not None:
            self.configure_preview(self.generated.columns)
            for index, row in enumerate(self.generated.rows(), start=1):
                if index > 200:
                    break
                self.preview_table.insert("", "end", values=(index, *(f"{value:.10g}" for value in row)),
                                          tags=("alternate",) if index % 2 == 0 else ())
            if len(self.generated.x) > 200:
                self.preview_status.set(f"{len(self.generated.x):,} rows  ·  first 200 shown")

    def save_generated(self):
        if self.generated is None:
            return
        file = filedialog.asksaveasfilename(parent=self.root, title="Save the generated dataset",
                                            defaultextension=".csv", initialfile="dataset",
                                            filetypes=(("CSV", "*.csv"), ("JSON", "*.json")))
        if file:
            try:
                write_dataset(Path(file), self.generated)
                self.preview_status.set(f"Saved {len(self.generated.x):,} rows to {Path(file).suffix.upper()[1:]}")
            except (OSError, ValueError) as error:
                messagebox.showerror("Could not save dataset", str(error), parent=self.root)

    def send_to_search(self):
        if self.generated is not None:
            self.set_dataset(self.generated)
            self.tabs.select(self.search_tab)

    def close(self):
        self.pause()
        self.root.destroy()


def main():
    root = tk.Tk()
    Application(root)
    root.mainloop()


if __name__ == "__main__":
    main()
