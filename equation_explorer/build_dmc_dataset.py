"""Build an Equation Explorer dataset from adjacent Da Ma Cai draws."""

import csv
import tkinter as tk
from datetime import datetime, timedelta
from pathlib import Path
from tempfile import NamedTemporaryFile
from tkinter import messagebox, ttk

from scrape_dmc import DEFAULT_OUTPUT as SOURCE_PATH, PRIZES_PER_GROUP, read_csv


OUTPUT_DIR = SOURCE_PATH.parent
DEFAULT_ROWS = 30
MAX_INPUTS = 12  # Equation Explorer's CSV importer limit.
MAX_ROWS = 20_000
PREVIEW_ROWS = 6
FIELDS = (
    ("date", "Date"),
    ("first_prize", "1st Prize"),
    ("second_prize", "2nd Prize"),
    ("third_prize", "3rd Prize"),
    *((f"starter_{n}", f"Starter {n}") for n in range(1, PRIZES_PER_GROUP + 1)),
    *((f"consolation_{n}", f"Consolation {n}") for n in range(1, PRIZES_PER_GROUP + 1)),
)
STARTERS = range(4, 4 + PRIZES_PER_GROUP)
CONSOLATIONS = range(STARTERS.stop, len(FIELDS))
DEFAULT_INPUTS = (0, *STARTERS)


def build_dataset(draws, start, count, result, inputs):
    if not 1 <= len(inputs) <= MAX_INPUTS:
        raise ValueError(f"Select 1 to {MAX_INPUTS} inputs from the previous draw.")
    if result in inputs:
        raise ValueError("Choose inputs other than the selected result field.")
    available = min(MAX_ROWS, len(draws) - start - 1)
    if available < 2:
        raise ValueError("Choose an earlier entry in the list with at least two prior draws.")
    if not 2 <= count <= available:
        raise ValueError(f"Enter a row count from 2 to {available:,} for this start draw.")

    header = [*(f"prev_{FIELDS[column][0]}" for column in inputs), f"result_{FIELDS[result][0]}"]
    rows = [
        [*(draws[i + 1][column] for column in inputs), draws[i][result]]
        for i in range(start, start + count)
    ]
    if all(row[:-1] == rows[0][:-1] for row in rows[1:]):
        raise ValueError("Equation Explorer needs at least two distinct input combinations.")
    return header, rows


def save_dataset(output_dir, header, rows):
    output = NamedTemporaryFile(mode="w", encoding="utf-8", newline="", dir=output_dir,
                                delete=False)
    temp_path = Path(output.name)
    try:
        with output:
            writer = csv.writer(output, lineterminator="\n")
            writer.writerow(header)
            writer.writerows(rows)
        timestamp = datetime.now()
        while True:
            path = output_dir / f"dataset{timestamp:%Y%m%d%H%M%S}.csv"
            try:
                path.hardlink_to(temp_path)
                return path
            except FileExistsError:
                timestamp += timedelta(seconds=1)
    finally:
        temp_path.unlink(missing_ok=True)


class DatasetBuilder:
    def __init__(self, root, draws, output_dir=OUTPUT_DIR):
        self.draws = draws
        self.output_dir = output_dir
        self.draw_indices = {draw[0]: i for i, draw in enumerate(draws)}
        self.result_columns = {label: i for i, (_, label) in enumerate(FIELDS) if i}
        self.result = tk.StringVar(master=root, value=FIELDS[1][1])
        self.start = tk.StringVar(master=root, value=draws[0][0])
        self.count = tk.StringVar(master=root, value=str(min(DEFAULT_ROWS, len(draws) - 1)))
        self.selected = [tk.BooleanVar(master=root, value=i in DEFAULT_INPUTS) for i in range(len(FIELDS))]
        self.input_count = tk.StringVar(master=root)
        self.feedback = tk.StringVar(master=root)
        self.preview_info = tk.StringVar(master=root)
        self.checkboxes = {}
        self.dataset = None

        root.title("Da Ma Cai Dataset Builder")
        desktop_width, desktop_height = root.maxsize()
        max_width = min(desktop_width, root.winfo_screenwidth())
        max_height = min(desktop_height, root.winfo_screenheight())
        min_width, min_height = min(780, max_width), min(515, max_height)
        root.maxsize(max_width, max_height)
        root.minsize(min_width, min_height)
        frame = ttk.Frame(root, padding=(16, 10))
        frame.pack(fill="both", expand=True)
        frame.columnconfigure(0, weight=1)
        frame.rowconfigure(7, weight=1)

        ttk.Label(frame, text="Da Ma Cai Dataset Builder", font=("TkDefaultFont", 19, "bold")).grid(
            row=0, column=0, sticky="w"
        )
        settings = ttk.Frame(frame)
        settings.grid(row=1, column=0, sticky="ew", pady=(8, 5))
        for column, label in enumerate(("Result", "First result draw (YYYYMMDD)", "Rows")):
            ttk.Label(settings, text=label).grid(row=0, column=column, sticky="w", pady=(0, 3))
        ttk.Combobox(settings, textvariable=self.result, values=tuple(self.result_columns),
                     state="readonly", width=19).grid(row=1, column=0, sticky="w", padx=(0, 16))
        ttk.Combobox(settings, textvariable=self.start, values=tuple(self.draw_indices)[:-2],
                     width=24).grid(row=1, column=1, sticky="w", padx=(0, 16))
        self.count_input = ttk.Spinbox(settings, textvariable=self.count, from_=2,
                                      to=min(MAX_ROWS, len(draws) - 1), width=8)
        self.count_input.grid(row=1, column=2, sticky="w")

        actions = ttk.Frame(frame)
        actions.grid(row=2, column=0, sticky="ew", pady=2)
        ttk.Label(actions, text="Previous draw inputs").pack(side="left")
        ttk.Label(actions, textvariable=self.input_count).pack(side="left", padx=12)
        ttk.Button(actions, text="Clear", command=lambda: self.set_inputs(())).pack(side="right")
        ttk.Button(actions, text="Date + Starters", command=lambda: self.set_inputs(DEFAULT_INPUTS)).pack(
            side="right", padx=6
        )
        for row, label, columns in (
            (3, "Date and top prizes", range(4)),
            (4, "Starter Prizes", STARTERS),
            (5, "Consolation Prizes", CONSOLATIONS),
        ):
            group = ttk.LabelFrame(frame, text=label, padding=(8, 1))
            group.grid(row=row, column=0, sticky="ew", pady=(0, 2))
            for i, column in enumerate(columns):
                checkbox = ttk.Checkbutton(group, text=FIELDS[column][1], variable=self.selected[column],
                                           command=self.refresh)
                checkbox.grid(row=i // 5, column=i % 5, sticky="w")
                group.columnconfigure(i % 5, weight=1, uniform=label)
                self.checkboxes[column] = checkbox

        ttk.Label(frame, textvariable=self.preview_info).grid(row=6, column=0, sticky="w", pady=(4, 2))
        preview = ttk.Frame(frame)
        preview.grid(row=7, column=0, sticky="nsew")
        preview.columnconfigure(0, weight=1)
        preview.rowconfigure(0, weight=1)
        self.table = ttk.Treeview(preview, show="headings", height=PREVIEW_ROWS, selectmode="none")
        self.table.grid(row=0, column=0, sticky="nsew")
        bottom = ttk.Scrollbar(preview, orient="horizontal", command=self.table.xview)
        bottom.grid(row=1, column=0, sticky="ew")
        right = ttk.Scrollbar(preview, orient="vertical", command=self.table.yview)
        right.grid(row=0, column=1, sticky="ns")
        self.table.configure(xscrollcommand=bottom.set, yscrollcommand=right.set)

        footer = ttk.Frame(frame)
        footer.grid(row=8, column=0, sticky="ew", pady=(6, 0))
        self.save_button = ttk.Button(footer, text="Save CSV", command=self.save)
        self.save_button.pack(side="right")
        status = ttk.Label(footer, textvariable=self.feedback, wraplength=610)
        status.pack(side="left", fill="x", expand=True, padx=(0, 8))
        status.bind("<Configure>", lambda event: status.configure(wraplength=event.width))

        for setting in (self.result, self.start, self.count):
            setting.trace_add("write", self.refresh)
        self.refresh()
        root.update_idletasks()
        # Fix the initial size so adding preview columns only changes its scroll range.
        width = min(max_width, max(min_width, root.winfo_reqwidth()))
        height = min(max_height, max(min_height, root.winfo_reqheight()))
        root.geometry(f"{width}x{height}")

    def set_inputs(self, columns):
        for column, selected in enumerate(self.selected):
            selected.set(column in columns)
        self.refresh()

    def refresh(self, *_):
        result = self.result_columns[self.result.get()]
        self.selected[result].set(False)
        inputs = [i for i, selected in enumerate(self.selected) if selected.get()]
        self.input_count.set(f"{len(inputs)} of {MAX_INPUTS} selected")
        for column, checkbox in self.checkboxes.items():
            disabled = column == result or (len(inputs) >= MAX_INPUTS and column not in inputs)
            checkbox.state(["disabled" if disabled else "!disabled"])

        self.table.delete(*self.table.get_children())
        self.table.configure(columns=())
        self.preview_info.set("Preview")
        self.dataset = None
        self.save_button.state(["disabled"])
        try:
            start = self.draw_indices.get(self.start.get().strip())
            if start is None:
                raise ValueError("Enter or select a draw date from the archive.")
            self.count_input.configure(to=max(2, min(MAX_ROWS, len(self.draws) - start - 1)))
            try:
                count = int(self.count.get())
            except ValueError:
                raise ValueError("Enter a whole number for the row count.") from None
            self.dataset = build_dataset(self.draws, start, count, result, inputs)
        except ValueError as error:
            self.feedback.set(str(error))
            return

        header, rows = self.dataset
        self.table.configure(columns=header)
        for name, column in zip(header, (*inputs, result)):
            label = FIELDS[column][1]
            self.table.heading(name, text=f"Result · {label}" if column == result else label)
            self.table.column(name, width=155 if column == result else 100, anchor="center", stretch=False)
        for row in rows[:PREVIEW_ROWS]:
            self.table.insert("", "end", values=row)
        self.preview_info.set(f"Preview · {min(PREVIEW_ROWS, count)} of {count:,} rows")
        self.feedback.set(f"First pair · {self.draws[start][0]} result with {self.draws[start + 1][0]} inputs")
        self.save_button.state(["!disabled"])

    def save(self):
        if self.dataset is None:
            return
        try:
            path = save_dataset(self.output_dir, *self.dataset)
        except OSError as error:
            messagebox.showerror("Unable to save dataset", str(error), parent=self.save_button)
            return
        self.feedback.set(f"Saved {len(self.dataset[1]):,} rows to {path}")


def main():
    root = tk.Tk()
    root.withdraw()
    try:
        archive = read_csv(SOURCE_PATH)
        if len(archive) < 3:
            raise ValueError(f"At least three draws are needed in {SOURCE_PATH}.")
    except (OSError, ValueError, csv.Error) as error:
        messagebox.showerror("Unable to load draw archive", str(error), parent=root)
        root.destroy()
        return 1
    DatasetBuilder(root, [archive[date] for date in sorted(archive, reverse=True)])
    root.deiconify()
    root.mainloop()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
