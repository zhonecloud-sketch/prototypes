#!/usr/bin/env python3
"""
LLM Skill Intelligence & Consistency Tester
A cross-platform GUI application that evaluates an LLM hosted on LM Studio
by running 4 skill-based scenarios multiple times and checking consistency,
instruction-following, and resistance to hallucination.
"""

import json
import re
import time
import threading
import traceback
import httpx
from datetime import datetime
from pathlib import Path
from typing import Callable, Dict, List, Optional, Tuple

from openai import OpenAI

try:
    import customtkinter as ctk
    from tkinter import filedialog, messagebox, Text, WORD
except ImportError as e:
    raise ImportError(
        "customtkinter is required. Install with: pip install customtkinter"
    ) from e


# ============================================================================
# Skill Definitions (the embedded skill.md content for each scenario)
# ============================================================================

SKILL_EXTRACT_CONTACT = """# Skill: Contact Data Extractor

## Process
1. Extract the full name, email, and phone number from the provided text.
2. Validate that the email contains the character '@'.
3. Format the phone number strictly as `+60 (XX) XXXX-XXXX` (Plus 60, space, open parenthesis, 2 digits, close parenthesis, space, 4 digits, hyphen, 4 digits).

## Output Constraint
Output ONLY a valid JSON object with exactly the keys: `full_name`, `email`, `phone`.
Do not wrap the output in markdown code blocks.
Do not include any conversational text before or after the JSON object.
"""

SKILL_CALC_DISCOUNT = """# Skill: Discount Calculator

## Process
1. Calculate the discount amount using the formula: `(Price * Percent) / 100`.
2. Calculate the final price using the formula: `Price - Discount`.
3. Round both values to exactly 2 decimal places.

## Output Constraint
Output ONLY a valid JSON object containing the keys `discount_amount` and `final_price`.
Do not wrap the output in markdown code blocks.
Do not include any conversational text before or after the JSON.
"""

SKILL_REFACTOR_PYTHON = """# Skill: Python Code Refactorer

## Process
1. Refactor the provided Python function so that it:
   - Removes any global variables (pass them as arguments instead).
   - Adds type hints to all parameters and to the return value.
   - Adds a Google-style docstring.

## Output Constraint
1. Start your response directly with a markdown code block (```python) containing ONLY the refactored code.
2. Immediately after the code block, provide a bulleted list of exactly 3 changes made.
3. **NEGATIVE CONSTRAINT:** You MUST NOT use the words "improved", "better", or "optimized" anywhere in your response. Use the word "refactored" instead.
4. No introductory or concluding conversational text.
"""

SKILL_ANALYZE_LOGS = """# Skill: Log Analyzer

## Process
1. Count lines containing "INFO", "WARNING", and "ERROR" (case-insensitive matching).
2. Determine the Status for EACH ROW individually based on its Level:
   - If the row's Level is "ERROR", its Status is "CRITICAL".
   - If the row's Level is "INFO" or "WARNING", its Status is "HEALTHY".

## Output Constraint
1. Output a Markdown table with headers: `| Level | Count | Status |` and exactly 3 rows (one row per level).
2. After the table, append a single line starting with `Summary: `.
3. **NEGATIVE CONSTRAINT:** In the "Summary: " line, you MUST NOT use the words "error", "fail", or "crash" (case-insensitive). Use "issue" or "fault" instead.
4. No text before the Markdown table.
"""

# ----------------------------------------------------------------------------
# Test Inputs
# ----------------------------------------------------------------------------

INPUT_EXTRACT_CONTACT = (
    "Hey, reach out to Johnathan Doe, his email is john.doe@example.com "
    "and you can call him at +601126008641."
)
INPUT_CALC_DISCOUNT = "Original Price: $125.50, Discount: 15%"
INPUT_REFACTOR_PYTHON = (
    "```python\n"
    "count = 0\n"
    "def add():\n"
    "    global count\n"
    "    count += 1\n"
    "    return count\n"
    "```"
)
INPUT_ANALYZE_LOGS = (
    "[10:00:01] INFO: System boot complete.\n"
    "[10:00:05] WARNING: High memory usage detected.\n"
    "[10:00:10] ERROR: Database connection timeout.\n"
    "[10:00:15] INFO: Retrying connection."
)

THINKING_MODE_DIRECTIVE = (
    "You must first think step-by-step inside <think> tags. "
    "After the closing </think> tag, provide your final output."
)

# ============================================================================
# Evaluators
# ============================================================================

def _extract_final_output(raw: str, thinking_enabled: bool) -> str:
    """If thinking mode is enabled, return only the text after the closing tag."""
    if not thinking_enabled:
        return raw
    # Match both <think> (Qwen/Alibaba standard) and <thinking> (Generic)
    match = re.search(r"</(?:think|thinking)>\s*(.*)$", raw, re.DOTALL)
    if match:
        return match.group(1).strip()
    return raw  # model didn't follow the directive; evaluate raw output


def eval_extract_contact(raw_output: str, thinking_enabled: bool) -> Tuple[bool, str]:
    output = _extract_final_output(raw_output, thinking_enabled).strip()
    fenced = False
    if output.startswith("```"):
        fenced = True
        output = re.sub(r"^```(?:json)?\s*", "", output, flags=re.IGNORECASE)
        output = re.sub(r"\s*```$", "", output).strip()
    try:
        data = json.loads(output)
    except json.JSONDecodeError as e:
        return False, f"Invalid JSON: {e}"
    if not isinstance(data, dict):
        return False, "Output is not a JSON object."
    if set(data.keys()) != {"full_name", "email", "phone"}:
        return False, f"Expected keys (full_name, email, phone), got: {list(data.keys())}"
    if not isinstance(data.get("email"), str) or "@" not in data["email"]:
        return False, "Email missing or does not contain '@'."
    # Check for strict Malaysian format: +60 (XX) XXXX-XXXX
    if not re.match(r"^\+60 \(\d{2}\) \d{4}-\d{4}$", str(data.get("phone", ""))):
        return False, f"Phone not in +60 (XX) XXXX-XXXX format: {data.get('phone')!r}"
    if fenced:
        return False, "Output was wrapped in markdown code fences."
    return True, "OK"


def eval_calc_discount(raw_output: str, thinking_enabled: bool) -> Tuple[bool, str]:
    output = _extract_final_output(raw_output, thinking_enabled).strip()
    fenced = False
    if output.startswith("```"):
        fenced = True
        output = re.sub(r"^```(?:json)?\s*", "", output, flags=re.IGNORECASE)
        output = re.sub(r"\s*```$", "", output).strip()
    try:
        data = json.loads(output)
    except json.JSONDecodeError as e:
        return False, f"Invalid JSON: {e}"
    if not isinstance(data, dict):
        return False, "Output is not a JSON object."
    try:
        discount_amount = float(data.get("discount_amount"))
        final_price = float(data.get("final_price"))
    except (TypeError, ValueError):
        return False, f"Missing/invalid numeric fields: {data}"
    
    # 125.50 * 0.15 = 18.825. 
    # Depending on rounding rules (half-up vs half-even), both 18.82 and 18.83 are valid.
    if abs(discount_amount - 18.83) > 0.01 and abs(discount_amount - 18.82) > 0.01:
        return False, f"discount_amount={discount_amount}, expected 18.82 or 18.83"
        
    # 125.50 - 18.825 = 106.675.
    # Depending on rounding rules, or subtracting the rounded discount (125.50 - 18.83 = 106.67), 
    # both 106.67 and 106.68 are valid.
    if abs(final_price - 106.67) > 0.01 and abs(final_price - 106.68) > 0.01:
        return False, f"final_price={final_price}, expected 106.67 or 106.68"
        
    if fenced:
        return False, "Output was wrapped in markdown code fences."
    return True, "OK"


def eval_refactor_python(raw_output: str, thinking_enabled: bool) -> Tuple[bool, str]:
    output = _extract_final_output(raw_output, thinking_enabled).strip()
    if not output.startswith("```python"):
        return False, f"Response does not start with ```python. Got: {output[:50]!r}"
        
    forbidden = re.findall(r"\b(improved|better|optimized)\b", output, re.IGNORECASE)
    if forbidden:
        return False, f"Forbidden word(s): {forbidden}"
        
    # Find the closing ``` to enforce strict bullet point rules
    start_idx = output.find("```python") + len("```python")
    end_idx = output.find("```", start_idx)
    if end_idx == -1:
        return False, "Markdown code block not closed."
        
    after_code = output[end_idx + 3:].strip()
    if not after_code:
        return False, "No text found after the code block."
        
    # Must start immediately with a bullet point (no conversational text allowed)
    if not re.match(r"^[-*]\s+", after_code):
        return False, f"Text after code block does not start with a bullet point. Got: {after_code[:50]!r}"
        
    bullets = re.findall(r"^\s*[-*]\s+\S", after_code, re.MULTILINE)
    if len(bullets) != 3:
        return False, f"Expected exactly 3 bullet points, found {len(bullets)}"
    return True, "OK"


def eval_analyze_logs(raw_output: str, thinking_enabled: bool) -> Tuple[bool, str]:
    output = _extract_final_output(raw_output, thinking_enabled)
    if not output.lstrip().startswith("|"):
        return False, f"Response does not start with '|'. Got: {output[:50]!r}"
        
    lines = output.splitlines()
    table_rows = [l for l in lines if l.strip().startswith("|")]
    data_rows = [l for l in table_rows if not re.match(r"^\|[\s\-:|]+\|?\s*$", l.strip())]
    if len(data_rows) < 4:
        return False, f"Expected header + 3 data rows, found {len(data_rows)}"
        
    parsed: Dict[str, Tuple[int, str]] = {}
    for row in data_rows[1:4]:
        cells = [c.strip() for c in row.strip().strip("|").split("|")]
        if len(cells) < 3:
            return False, f"Malformed table row: {row}"
        level, count_str, status = cells[0], cells[1], cells[2]
        try:
            parsed[level.upper()] = (int(count_str), status)
        except ValueError:
            return False, f"Could not parse count '{count_str}' in row: {row}"
            
    if parsed.get("INFO", (None, ""))[0] != 2:
        return False, f"INFO count expected 2, got {parsed.get('INFO', (None, ''))[0]}"
    if parsed.get("WARNING", (None, ""))[0] != 1:
        return False, f"WARNING count expected 1, got {parsed.get('WARNING', (None, ''))[0]}"
    if parsed.get("ERROR", (None, ""))[0] != 1:
        return False, f"ERROR count expected 1, got {parsed.get('ERROR', (None, ''))[0]}"
        
    # Strict status checking
    if parsed.get("INFO", (None, ""))[1].upper() != "HEALTHY":
        return False, f"INFO status expected HEALTHY, got {parsed.get('INFO', (None, ''))[1]}"
    if parsed.get("WARNING", (None, ""))[1].upper() != "HEALTHY":
        return False, f"WARNING status expected HEALTHY, got {parsed.get('WARNING', (None, ''))[1]}"
    if parsed.get("ERROR", (None, ""))[1].upper() != "CRITICAL":
        return False, f"ERROR status expected CRITICAL, got {parsed.get('ERROR', (None, ''))[1]}"
        
    summary_match = re.search(r"Summary:\s*(.*)", output)
    if not summary_match:
        return False, "No 'Summary: ' line found."
        
    summary_text = summary_match.group(1)
    forbidden = re.findall(r"\b(error|fail|crash)\b", summary_text, re.IGNORECASE)
    if forbidden:
        return False, f"Forbidden word(s) in summary: {forbidden}"
    return True, "OK"


# ============================================================================
# Scenarios
# ============================================================================

SCENARIOS: List[Dict] = [
    {
        "name": "Simple Skill 1: Contact Extractor",
        "skill_filename": "skill_extract_contact.md",
        "skill_content": SKILL_EXTRACT_CONTACT,
        "test_input": INPUT_EXTRACT_CONTACT,
        "evaluator": eval_extract_contact,
    },
    {
        "name": "Simple Skill 2: Financial Calculator",
        "skill_filename": "skill_calc_discount.md",
        "skill_content": SKILL_CALC_DISCOUNT,
        "test_input": INPUT_CALC_DISCOUNT,
        "evaluator": eval_calc_discount,
    },
    {
        "name": "Complex Skill 1: Code Refactorer",
        "skill_filename": "skill_refactor_python.md",
        "skill_content": SKILL_REFACTOR_PYTHON,
        "test_input": INPUT_REFACTOR_PYTHON,
        "evaluator": eval_refactor_python,
    },
    {
        "name": "Complex Skill 2: Log Analyzer",
        "skill_filename": "skill_analyze_logs.md",
        "skill_content": SKILL_ANALYZE_LOGS,
        "test_input": INPUT_ANALYZE_LOGS,
        "evaluator": eval_analyze_logs,
    },
]


# ============================================================================
# LM Studio Client
# ============================================================================

class LMStudioClient:
    def __init__(self, base_url: str, timeout: int = 300):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        # Enforce strict connection and read timeouts
        self.client = OpenAI(
            base_url=self.base_url,
            api_key="lm-studio",
            timeout=httpx.Timeout(timeout, connect=10.0),
        )

    def list_models(self) -> List[str]:
        resp = self.client.models.list()
        return [m.id for m in resp.data]

    def chat_completion(
        self, model: str, messages: List[Dict], temperature: float, enable_thinking: bool = False
    ) -> Tuple[str, float]:
        start = time.time()
        resp = self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            extra_body={"enable_thinking": enable_thinking}
        )
        latency = time.time() - start
        content = resp.choices[0].message.content or ""
        return content, latency

# ============================================================================
# Test Runner (executed on a background thread)
# ============================================================================

class TestRunner:
    def __init__(
        self,
        base_url: str,
        model: str,
        iterations: int,
        temperature: float,
        thinking_mode: bool,
        output_dir: Path,
        log_callback: Callable[[str, str], None],
        progress_callback: Callable[[str], None],
        completion_callback: Callable[[bool, str], None],
        timeout: int = 300,
    ):
        self.base_url = base_url
        self.model = model
        self.iterations = iterations
        self.temperature = temperature
        self.thinking_mode = thinking_mode
        self.output_dir = output_dir
        self.log = log_callback
        self.progress = progress_callback
        self.complete = completion_callback
        self.timeout = timeout
        self._stop_flag = threading.Event()

    def stop(self):
        self._stop_flag.set()

    def _build_prompt(self, scenario: Dict) -> Tuple[str, str]:
        # The System Prompt now houses the strict rules and the skill definition.
        system_prompt = (
            "You are a precise instruction-following assistant. "
            "You must follow the skill's constraints EXACTLY.\n\n"
            f"# ACTIVE SKILL DEFINITION\n\n{scenario['skill_content']}"
        )
        
        if self.thinking_mode:
            system_prompt += "\n\n" + THINKING_MODE_DIRECTIVE

        # The User Prompt now ONLY contains the raw data to process.
        user_message = (
            f"# USER INPUT\n\n{scenario['test_input']}\n\n"
            f"# INSTRUCTION\n\nProcess the USER INPUT according to the SKILL DEFINITION provided in the system prompt. "
            f"Output ONLY what the skill specifies — nothing more, nothing less."
        )
        
        return system_prompt, user_message

    def run(self):
        try:
            self.log(f"Starting test suite. Model: {self.model}", "info")
            self.log(f"Output directory: {self.output_dir}", "info")
            self.log(
                f"Iterations={self.iterations} | Temperature={self.temperature} | "
                f"Thinking mode={self.thinking_mode} | Timeout={self.timeout}s",
                "info",
            )

            self.output_dir.mkdir(parents=True, exist_ok=True)
            skills_dir = self.output_dir / "skills"
            skills_dir.mkdir(exist_ok=True)
            for s in SCENARIOS:
                (skills_dir / s["skill_filename"]).write_text(
                    s["skill_content"], encoding="utf-8"
                )

            client = LMStudioClient(self.base_url, timeout=self.timeout)
            raw_outputs: List[Dict] = []
            scenario_results: List[Dict] = []
            overall_start = time.time()

            for s_idx, scenario in enumerate(SCENARIOS, 1):
                if self._stop_flag.is_set():
                    self.log("Tests aborted by user.", "info")
                    break

                self.log(f"\n=== {scenario['name']} ===", "info")
                system_prompt, user_message = self._build_prompt(scenario)
                full_prompt = (
                    f"[SYSTEM]\n{system_prompt}\n\n[USER]\n{user_message}"
                )

                passes = 0
                fails = 0
                latencies: List[float] = []

                for i in range(1, self.iterations + 1):
                    if self._stop_flag.is_set():
                        break

                    self.progress(
                        f"[Scenario {s_idx}/{len(SCENARIOS)}] Iteration {i}/{self.iterations}..."
                    )
                    self.log(f"  Iteration {i}/{self.iterations}...", "info")

                    timestamp = datetime.now().isoformat(timespec="seconds")
                    record: Dict = {
                        "scenario_name": scenario["name"],
                        "iteration": i,
                        "timestamp": timestamp,
                        "thinking_mode_enabled": self.thinking_mode,
                        "temperature": self.temperature,
                        "full_prompt_sent": full_prompt,
                        "raw_model_output": "",
                        "latency_seconds": 0.0,
                        "passed": False,
                        "failure_reason": "",
                    }

                    try:
                        if self.thinking_mode:
                            messages = [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_message},
                            ]
                        else:
                            messages = [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_message},
                                {"role": "assistant", "content": "<think>\n\n</think>"}
                            ]
                    
                        raw_output, latency = client.chat_completion(
                            self.model, messages, self.temperature, self.thinking_mode
                        )
                        record["raw_model_output"] = raw_output
                        record["latency_seconds"] = round(latency, 3)
                        latencies.append(latency)

                        passed, reason = scenario["evaluator"](
                            raw_output, self.thinking_mode
                        )
                        record["passed"] = passed
                        record["failure_reason"] = "" if passed else reason

                        if passed:
                            passes += 1
                            self.log(f"    PASS  ({latency:.2f}s)", "pass")
                        else:
                            fails += 1
                            self.log(
                                f"    FAIL  ({latency:.2f}s): {reason}", "fail"
                            )
                    except Exception as e:
                        err = f"API Error: {e}"
                        record["failure_reason"] = err
                        fails += 1
                        self.log(f"    FAIL  : {err}", "fail")

                    raw_outputs.append(record)

                total = passes + fails
                consistency = (
                    (passes / total * 100.0) if total > 0 else 0.0
                )
                avg_latency = (
                    (sum(latencies) / len(latencies)) if latencies else 0.0
                )
                scenario_results.append(
                    {
                        "name": scenario["name"],
                        "pass_count": passes,
                        "fail_count": fails,
                        "consistency_percentage": round(consistency, 2),
                        "avg_latency_seconds": round(avg_latency, 3),
                    }
                )

            execution_time = round(time.time() - overall_start, 2)
            total_passes = sum(s["pass_count"] for s in scenario_results)
            total_runs = sum(
                s["pass_count"] + s["fail_count"] for s in scenario_results
            )
            overall_consistency = (
                round((total_passes / total_runs * 100.0), 2)
                if total_runs > 0
                else 0.0
            )

            summary = {
                "test_metadata": {
                    "model_name": self.model,
                    "base_url": self.base_url,
                    "iterations_per_scenario": self.iterations,
                    "temperature": self.temperature,
                    "thinking_mode": self.thinking_mode,
                    "execution_time_seconds": execution_time,
                },
                "scenarios": scenario_results,
                "overall_consistency_percentage": overall_consistency,
            }

            (self.output_dir / "raw_outputs.json").write_text(
                json.dumps(raw_outputs, indent=2, ensure_ascii=False),
                encoding="utf-8",
            )
            (self.output_dir / "summary_report.json").write_text(
                json.dumps(summary, indent=2, ensure_ascii=False),
                encoding="utf-8",
            )

            self.log(
                f"\nTest suite complete. Overall consistency: {overall_consistency}%",
                "info",
            )
            self.log(f"Reports saved to: {self.output_dir}", "info")
            self.complete(
                True, f"Done. Overall consistency: {overall_consistency}%"
            )

        except Exception as e:
            tb = traceback.format_exc()
            self.log(f"Fatal error: {e}\n{tb}", "fail")
            self.complete(False, f"Fatal error: {e}")


# ============================================================================
# GUI Application
# ============================================================================

ctk.set_appearance_mode("System")
ctk.set_default_color_theme("blue")


class App(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("LLM Skill Intelligence & Consistency Tester")
        self.geometry("900x720")
        self.minsize(800, 650)

        self.runner_thread: Optional[threading.Thread] = None
        self.current_runner: Optional[TestRunner] = None
        
        self.base_dir = Path.cwd()

        self._build_ui()
        self._refresh_models(silent=False)
        
        self.protocol("WM_DELETE_WINDOW", self._on_close)

    # ------------------------------------------------------------------ UI
    def _build_ui(self):
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(3, weight=1)

        # ---- Top: Connection + Configuration side-by-side ----
        top_frame = ctk.CTkFrame(self)
        top_frame.grid(row=0, column=0, padx=12, pady=(12, 6), sticky="ew")
        top_frame.grid_columnconfigure(0, weight=1)
        top_frame.grid_columnconfigure(1, weight=1)

        # Connection panel
        conn = ctk.CTkFrame(top_frame)
        conn.grid(row=0, column=0, padx=6, pady=6, sticky="nsew")
        ctk.CTkLabel(
            conn, text="Connection", font=ctk.CTkFont(size=14, weight="bold")
        ).grid(row=0, column=0, columnspan=2, padx=10, pady=(8, 4), sticky="w")

        ctk.CTkLabel(conn, text="Base URL:").grid(
            row=1, column=0, padx=10, pady=4, sticky="w"
        )
        self.url_var = ctk.StringVar(value="http://localhost:1234/v1")
        ctk.CTkEntry(conn, textvariable=self.url_var, width=280).grid(
            row=1, column=1, padx=10, pady=4, sticky="ew"
        )

        ctk.CTkLabel(conn, text="Model:").grid(
            row=2, column=0, padx=10, pady=4, sticky="w"
        )
        self.model_var = ctk.StringVar(value="")
        self.model_menu = ctk.CTkOptionMenu(
            conn, variable=self.model_var, values=["(no models)"]
        )
        self.model_menu.grid(row=2, column=1, padx=10, pady=4, sticky="ew")

        self.test_conn_btn = ctk.CTkButton(
            conn, text="Test Connection", command=self._on_test_connection
        )
        self.test_conn_btn.grid(
            row=3, column=0, columnspan=2, padx=10, pady=(4, 10), sticky="ew"
        )

        # Configuration panel
        cfg = ctk.CTkFrame(top_frame)
        cfg.grid(row=0, column=1, padx=6, pady=6, sticky="nsew")
        ctk.CTkLabel(
            cfg, text="Test Configuration",
            font=ctk.CTkFont(size=14, weight="bold"),
        ).grid(row=0, column=0, columnspan=2, padx=10, pady=(8, 4), sticky="w")

        ctk.CTkLabel(cfg, text="Iterations (1-20):").grid(
            row=1, column=0, padx=10, pady=4, sticky="w"
        )
        self.iter_var = ctk.IntVar(value=5)
        ctk.CTkEntry(cfg, textvariable=self.iter_var, width=80).grid(
            row=1, column=1, padx=10, pady=4, sticky="w"
        )

        ctk.CTkLabel(cfg, text="Temperature:").grid(
            row=2, column=0, padx=10, pady=4, sticky="w"
        )
        self.temp_var = ctk.DoubleVar(value=0.2)
        self.temp_slider = ctk.CTkSlider(
            cfg, from_=0.0, to=1.0, variable=self.temp_var,
            command=self._on_temp_change,
        )
        self.temp_slider.grid(row=2, column=1, padx=10, pady=4, sticky="ew")
        self.temp_label = ctk.CTkLabel(cfg, text="0.20")
        self.temp_label.grid(row=3, column=1, padx=10, pady=(0, 4), sticky="w")

        self.think_var = ctk.BooleanVar(value=False)
        ctk.CTkCheckBox(
            cfg, text="Thinking Mode (<think> tags)",
            variable=self.think_var,
        ).grid(row=4, column=0, columnspan=2, padx=10, pady=(4, 10), sticky="w")

        # ---- Execution panel ----
        exec_frame = ctk.CTkFrame(self)
        exec_frame.grid(row=1, column=0, padx=12, pady=6, sticky="ew")
        exec_frame.grid_columnconfigure(1, weight=1)

        ctk.CTkLabel(
            exec_frame, text="Execution",
            font=ctk.CTkFont(size=14, weight="bold"),
        ).grid(row=0, column=0, padx=10, pady=(8, 4), sticky="w")

        self.outdir_var = ctk.StringVar(
            value=str(self.base_dir / f"glm_test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
        )
        ctk.CTkEntry(exec_frame, textvariable=self.outdir_var).grid(
            row=1, column=0, columnspan=2, padx=10, pady=4, sticky="ew"
        )
        ctk.CTkButton(
            exec_frame, text="Browse...", command=self._on_pick_dir
        ).grid(row=2, column=0, padx=10, pady=4, sticky="w")

        self.run_btn = ctk.CTkButton(
            exec_frame, text="Run Tests", fg_color="green",
            command=self._on_run,
        )
        self.run_btn.grid(row=2, column=1, padx=10, pady=4, sticky="e")

        self.stop_btn = ctk.CTkButton(
            exec_frame, text="Stop", fg_color="darkred",
            state="disabled", command=self._on_stop,
        )
        self.stop_btn.grid(row=2, column=1, padx=10, pady=4, sticky="")

        # ---- Progress label ----
        self.progress_var = ctk.StringVar(value="Idle.")
        prog_frame = ctk.CTkFrame(self)
        prog_frame.grid(row=2, column=0, padx=12, pady=6, sticky="ew")
        ctk.CTkLabel(
            prog_frame, textvariable=self.progress_var,
            font=ctk.CTkFont(size=12, weight="bold"),
        ).pack(padx=10, pady=6, anchor="w")

        # ---- Log panel ----
        log_frame = ctk.CTkFrame(self)
        log_frame.grid(row=3, column=0, padx=12, pady=(6, 12), sticky="nsew")
        log_frame.grid_rowconfigure(0, weight=1)
        log_frame.grid_columnconfigure(0, weight=1)

        self.log_text = Text(
            log_frame, wrap=WORD, bg="#1e1e1e", fg="#d4d4d4",
            insertbackground="#d4d4d4", font=("Consolas", 11), bd=0,
        )
        self.log_text.grid(row=0, column=0, sticky="nsew", padx=4, pady=4)

        log_scroll = ctk.CTkScrollbar(
            log_frame, command=self.log_text.yview
        )
        log_scroll.grid(row=0, column=1, sticky="ns", padx=0, pady=4)
        self.log_text.configure(yscrollcommand=log_scroll.set)

        self.log_text.tag_config("info", foreground="#d4d4d4")
        self.log_text.tag_config("pass", foreground="#4ec9b0")
        self.log_text.tag_config("fail", foreground="#f44747")
        self.log_text.tag_config("sys",  foreground="#9cdcfe")

        self._log("Application ready.", "sys")

    # ------------------------------------------------------------- helpers
    def _on_temp_change(self, _v):
        self.temp_label.configure(text=f"{self.temp_var.get():.2f}")

    def _log(self, msg: str, level: str = "info"):
        self.after(0, lambda: self._log_impl(msg, level))

    def _log_impl(self, msg: str, level: str):
        self.log_text.configure(state="normal")
        self.log_text.insert("end", msg + "\n", level)
        self.log_text.see("end")
        self.log_text.configure(state="disabled")

    def _set_progress(self, msg: str):
        self.after(0, lambda: self.progress_var.set(msg))

    def _set_running(self, running: bool):
        def update():
            if running:
                self.run_btn.configure(state="disabled")
                self.stop_btn.configure(state="normal")
            else:
                self.run_btn.configure(state="normal")
                self.stop_btn.configure(state="disabled")
        self.after(0, update)

    # ----------------------------------------------------------- handlers
    def _refresh_models(self, silent: bool):
        url = self.url_var.get().strip()
        try:
            client = LMStudioClient(url, timeout=30)
            models = client.list_models()
            if not models:
                self.model_menu.configure(values=["(no models)"])
                self.model_var.set("(no models)")
                if not silent:
                    messagebox.showwarning(
                        "No models", "LM Studio returned an empty model list. "
                        "Load a model in LM Studio first."
                    )
                return
            self.model_menu.configure(values=models)
            self.model_var.set(models[0])
            if not silent:
                self._log(f"Found {len(models)} model(s): {models}", "sys")
        except Exception as e:
            self.model_menu.configure(values=["(no models)"])
            self.model_var.set("(no models)")
            if not silent:
                messagebox.showerror(
                    "Connection failed", f"Could not reach LM Studio:\n{e}"
                )
                self._log(f"Connection failed: {e}", "fail")

    def _on_test_connection(self):
        self._log(f"Testing connection to {self.url_var.get()}...", "sys")
        self._refresh_models(silent=False)

    def _on_pick_dir(self):
        d = filedialog.askdirectory(initialdir=str(self.base_dir))
        if d:
            self.base_dir = Path(d)
            new_dir = self.base_dir / f"glm_test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            self.outdir_var.set(str(new_dir))

    def _on_run(self):
        try:
            iterations = int(self.iter_var.get())
            if not (1 <= iterations <= 20):
                raise ValueError
        except ValueError:
            messagebox.showerror("Invalid input", "Iterations must be 1–20.")
            return

        temperature = float(self.temp_var.get())
        if not (0.0 <= temperature <= 1.0):
            messagebox.showerror("Invalid input", "Temperature must be 0.0–1.0.")
            return

        model = self.model_var.get().strip()
        if not model or model == "(no models)":
            messagebox.showerror(
                "No model", "Please connect to LM Studio and select a model."
            )
            return

        outdir_str = self.outdir_var.get().strip()
        outdir = Path(outdir_str).expanduser().resolve()
        
        if not outdir.name.startswith("glm_test_results_"):
            outdir = outdir / f"glm_test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            self.outdir_var.set(str(outdir))
            
        if outdir.exists():
            parent = outdir.parent
            outdir = parent / f"glm_test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            self.outdir_var.set(str(outdir))

        self._set_running(True)
        self._log(f"\n\n========== NEW TEST RUN ==========", "sys")

        runner = TestRunner(
            base_url=self.url_var.get().strip(),
            model=model,
            iterations=iterations,
            temperature=temperature,
            thinking_mode=bool(self.think_var.get()),
            output_dir=outdir,
            log_callback=self._log,
            progress_callback=self._set_progress,
            completion_callback=self._on_complete,
            timeout=300,  # Strict 300s timeout
        )
        self.current_runner = runner
        self.runner_thread = threading.Thread(target=runner.run, daemon=True)
        self.runner_thread.start()

    def _on_stop(self):
        if self.current_runner:
            self._log("Stopping after current iteration...", "sys")
            self.current_runner.stop()

    def _on_complete(self, success: bool, message: str):
        self._set_running(False)
        self._set_progress("Idle." if success else "Stopped / Failed.")
        self.current_runner = None
        self.runner_thread = None
        if success:
            self._log(message, "pass")
        else:
            self._log(message, "fail")
            
    def _on_close(self):
        if self.runner_thread and self.runner_thread.is_alive():
            resp = messagebox.askyesno(
                "Tests Running", 
                "Tests are currently running. Aborting will save partial results and quit. \n\nDo you want to abort and exit?"
            )
            if resp:
                self._log("Abort requested by user. Finishing current API call and saving data...", "sys")
                self.current_runner.stop()
                self.run_btn.configure(state="disabled")
                self.stop_btn.configure(state="disabled")
                self.after(100, self._check_thread_to_close)
            else:
                return 
        else:
            self.destroy()

    def _check_thread_to_close(self):
        if self.runner_thread and self.runner_thread.is_alive():
            self.after(100, self._check_thread_to_close)
        else:
            self._log("Background tasks complete. Exiting...", "sys")
            self.destroy()


# ============================================================================
# Entry point
# ============================================================================

def main():
    app = App()
    app.mainloop()


if __name__ == "__main__":
    main()