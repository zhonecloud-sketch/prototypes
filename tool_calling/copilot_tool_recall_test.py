"""copilot_tool_recall_test.py - Tool Recall Capacity Test via GitHub Copilot API

Purpose:
    Adapts tool_recall_test.py to test GitHub Copilot-accessible models via
    the Copilot API (api.githubcopilot.com). Tests how many tools a model can
    reliably remember and correctly select from.

    Supports Claude (Opus, Sonnet, Haiku) and GPT models available through
    your GitHub Copilot subscription.

Prerequisites:
    - GitHub CLI (gh) installed and authenticated with 'copilot' scope:
        gh auth login
        gh auth refresh -s copilot
    - OR set GITHUB_TOKEN env var with a token that has copilot scope

Sequence:
    1. lms_showdown.py            - Baseline tool call test (LM Studio local)
    2. lms_audio_media_tools.py   - Multi-step chaining (LM Studio local)
    3. lms_tool_recall_test.py    - Capacity stress test (LM Studio local)
    4. THIS SCRIPT                - Same capacity test against GitHub Copilot models

Dependencies: Python stdlib only (works on Windows and macOS)

Usage:
    python copilot_tool_recall_test.py                         # GUI mode
    python copilot_tool_recall_test.py --cli                   # terminal mode
    python copilot_tool_recall_test.py --cli --model gpt-5.5   # specific model
"""

import time
import json
import urllib.request
import urllib.error
import os
import subprocess
import tkinter as tk
from tkinter import ttk, scrolledtext
import threading
import sys
import random
import platform

COPILOT_API_URL = "https://api.githubcopilot.com"

# Models available via GitHub Copilot API that support tool calling
AVAILABLE_MODELS = [
    "claude-opus-4.7",
    "claude-opus-4.6",
    "claude-sonnet-4.5",
    "claude-haiku-4.5",
    "gpt-5.4",
    "gpt-5.2",
    "gpt-4.1",
    "gpt-4o",
    "gemini-2.5-pro",
]

# --- Large pool of diverse mock tools (same as tool_recall_test.py) ---

TOOL_POOL = [
    {
        "name": "get_weather",
        "description": "Get the current weather conditions for a specified city.",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name (e.g., Tokyo, London)."}
            },
            "required": ["city"],
        },
        "test_prompt": "What's the weather like in Berlin right now?",
        "expected_args": {"city": "Berlin"},
        "mock_result": "Berlin: 18C, partly cloudy, humidity 62%.",
    },
    {
        "name": "send_email",
        "description": "Send an email to a recipient with a subject and body.",
        "parameters": {
            "type": "object",
            "properties": {
                "to": {"type": "string", "description": "Recipient email address."},
                "subject": {"type": "string", "description": "Email subject line."},
                "body": {"type": "string", "description": "Email body content."},
            },
            "required": ["to", "subject", "body"],
        },
        "test_prompt": "Send an email to alice@example.com with subject 'Meeting Tomorrow' and body 'Hi Alice, let's meet at 10am.'",
        "expected_args": {"to": "alice@example.com"},
        "mock_result": "Email sent to alice@example.com successfully.",
    },
    {
        "name": "calculate_tip",
        "description": "Calculate the tip amount for a restaurant bill.",
        "parameters": {
            "type": "object",
            "properties": {
                "bill_amount": {"type": "number", "description": "Total bill amount in dollars."},
                "tip_percentage": {"type": "number", "description": "Desired tip percentage (e.g., 15, 20)."},
            },
            "required": ["bill_amount", "tip_percentage"],
        },
        "test_prompt": "How much tip should I leave on a $85 bill at 20%?",
        "expected_args": {"bill_amount": 85},
        "mock_result": "Tip: $17.00. Total with tip: $102.00.",
    },
    {
        "name": "translate_text",
        "description": "Translate text from one language to another.",
        "parameters": {
            "type": "object",
            "properties": {
                "text": {"type": "string", "description": "The text to translate."},
                "source_language": {"type": "string", "description": "Source language (e.g., English)."},
                "target_language": {"type": "string", "description": "Target language (e.g., Spanish)."},
            },
            "required": ["text", "target_language"],
        },
        "test_prompt": "Translate 'Good morning, how are you?' into Japanese.",
        "expected_args": {"target_language": "Japanese"},
        "mock_result": "Translation: おはようございます、お元気ですか？",
    },
    {
        "name": "set_timer",
        "description": "Set a countdown timer for a specified duration.",
        "parameters": {
            "type": "object",
            "properties": {
                "duration_minutes": {"type": "integer", "description": "Timer duration in minutes."},
                "label": {"type": "string", "description": "Optional label for the timer."},
            },
            "required": ["duration_minutes"],
        },
        "test_prompt": "Set a timer for 25 minutes labeled 'Pomodoro'.",
        "expected_args": {"duration_minutes": 25},
        "mock_result": "Timer 'Pomodoro' set for 25 minutes.",
    },
    {
        "name": "search_wikipedia",
        "description": "Search Wikipedia for articles matching a query.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query for Wikipedia."},
            },
            "required": ["query"],
        },
        "test_prompt": "Search Wikipedia for information about the Apollo 11 mission.",
        "expected_args": {"query": "Apollo 11"},
        "mock_result": "Found: Apollo 11 was the spaceflight that first landed humans on the Moon on July 20, 1969.",
    },
    {
        "name": "convert_currency",
        "description": "Convert an amount from one currency to another using current exchange rates.",
        "parameters": {
            "type": "object",
            "properties": {
                "amount": {"type": "number", "description": "Amount to convert."},
                "from_currency": {"type": "string", "description": "Source currency code (e.g., USD)."},
                "to_currency": {"type": "string", "description": "Target currency code (e.g., EUR)."},
            },
            "required": ["amount", "from_currency", "to_currency"],
        },
        "test_prompt": "Convert 500 USD to Japanese Yen.",
        "expected_args": {"from_currency": "USD"},
        "mock_result": "500 USD = 74,850 JPY (rate: 149.70).",
    },
    {
        "name": "create_calendar_event",
        "description": "Create a new event on the user's calendar.",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Event title."},
                "date": {"type": "string", "description": "Event date (YYYY-MM-DD)."},
                "time": {"type": "string", "description": "Event start time (HH:MM)."},
                "duration_minutes": {"type": "integer", "description": "Event duration in minutes."},
            },
            "required": ["title", "date", "time"],
        },
        "test_prompt": "Create a calendar event called 'Dentist Appointment' on 2026-06-15 at 14:30.",
        "expected_args": {"title": "Dentist Appointment"},
        "mock_result": "Event 'Dentist Appointment' created for 2026-06-15 at 14:30.",
    },
    {
        "name": "get_stock_price",
        "description": "Get the current stock price for a given ticker symbol.",
        "parameters": {
            "type": "object",
            "properties": {
                "ticker": {"type": "string", "description": "Stock ticker symbol (e.g., AAPL, TSLA)."},
            },
            "required": ["ticker"],
        },
        "test_prompt": "What's the current stock price of NVIDIA (NVDA)?",
        "expected_args": {"ticker": "NVDA"},
        "mock_result": "NVDA: $1,247.83 (+2.4% today).",
    },
    {
        "name": "resize_image",
        "description": "Resize an image file to specified dimensions.",
        "parameters": {
            "type": "object",
            "properties": {
                "filepath": {"type": "string", "description": "Path to the image file."},
                "width": {"type": "integer", "description": "Target width in pixels."},
                "height": {"type": "integer", "description": "Target height in pixels."},
            },
            "required": ["filepath", "width", "height"],
        },
        "test_prompt": "Resize the image at 'photo.png' to 800x600 pixels.",
        "expected_args": {"filepath": "photo.png"},
        "mock_result": "Image 'photo.png' resized to 800x600.",
    },
    {
        "name": "play_music",
        "description": "Play a song or playlist by name from the music library.",
        "parameters": {
            "type": "object",
            "properties": {
                "song_name": {"type": "string", "description": "Name of the song or playlist to play."},
                "shuffle": {"type": "boolean", "description": "Whether to shuffle playback."},
            },
            "required": ["song_name"],
        },
        "test_prompt": "Play 'Bohemian Rhapsody' by Queen.",
        "expected_args": {"song_name": "Bohemian Rhapsody"},
        "mock_result": "Now playing: Bohemian Rhapsody - Queen.",
    },
    {
        "name": "compress_file",
        "description": "Compress a file or directory into a ZIP archive.",
        "parameters": {
            "type": "object",
            "properties": {
                "source_path": {"type": "string", "description": "Path to file or directory to compress."},
                "output_zip": {"type": "string", "description": "Output ZIP file path."},
            },
            "required": ["source_path", "output_zip"],
        },
        "test_prompt": "Compress the folder 'project_files' into 'project_backup.zip'.",
        "expected_args": {"source_path": "project_files"},
        "mock_result": "Compressed 'project_files' into 'project_backup.zip' (23 files, 4.2 MB).",
    },
    {
        "name": "get_directions",
        "description": "Get driving directions from one location to another.",
        "parameters": {
            "type": "object",
            "properties": {
                "origin": {"type": "string", "description": "Starting location."},
                "destination": {"type": "string", "description": "Destination location."},
                "mode": {"type": "string", "description": "Travel mode: driving, walking, transit."},
            },
            "required": ["origin", "destination"],
        },
        "test_prompt": "Get driving directions from San Francisco to Los Angeles.",
        "expected_args": {"origin": "San Francisco"},
        "mock_result": "Route: I-5 South, 382 miles, approximately 5h 45m.",
    },
    {
        "name": "check_spelling",
        "description": "Check text for spelling and grammar errors.",
        "parameters": {
            "type": "object",
            "properties": {
                "text": {"type": "string", "description": "Text to check for errors."},
            },
            "required": ["text"],
        },
        "test_prompt": "Check this text for spelling errors: 'The quik brown fox jumps ovar the lazy dog.'",
        "expected_args": {"text": "The quik brown fox jumps ovar the lazy dog."},
        "mock_result": "Found 2 errors: 'quik' -> 'quick', 'ovar' -> 'over'.",
    },
    {
        "name": "generate_password",
        "description": "Generate a secure random password with specified criteria.",
        "parameters": {
            "type": "object",
            "properties": {
                "length": {"type": "integer", "description": "Password length."},
                "include_symbols": {"type": "boolean", "description": "Include special characters."},
                "include_numbers": {"type": "boolean", "description": "Include numbers."},
            },
            "required": ["length"],
        },
        "test_prompt": "Generate a 16-character password with symbols and numbers.",
        "expected_args": {"length": 16},
        "mock_result": "Generated password: kR#9mP$2xLw&7nQf",
    },
    {
        "name": "lookup_word",
        "description": "Look up the definition, synonyms, and usage of a word in the dictionary.",
        "parameters": {
            "type": "object",
            "properties": {
                "word": {"type": "string", "description": "The word to look up."},
            },
            "required": ["word"],
        },
        "test_prompt": "What does the word 'ephemeral' mean?",
        "expected_args": {"word": "ephemeral"},
        "mock_result": "ephemeral (adj): lasting for a very short time. Synonyms: transient, fleeting, momentary.",
    },
    {
        "name": "create_reminder",
        "description": "Create a reminder that triggers at a specified time.",
        "parameters": {
            "type": "object",
            "properties": {
                "message": {"type": "string", "description": "Reminder message."},
                "remind_at": {"type": "string", "description": "When to remind (ISO datetime or relative like 'in 2 hours')."},
            },
            "required": ["message", "remind_at"],
        },
        "test_prompt": "Remind me to call the plumber tomorrow at 9am.",
        "expected_args": {"message": "call the plumber"},
        "mock_result": "Reminder set: 'call the plumber' at tomorrow 09:00.",
    },
    {
        "name": "scan_port",
        "description": "Check if a specific network port is open on a host.",
        "parameters": {
            "type": "object",
            "properties": {
                "host": {"type": "string", "description": "Hostname or IP address."},
                "port": {"type": "integer", "description": "Port number to check."},
            },
            "required": ["host", "port"],
        },
        "test_prompt": "Check if port 443 is open on server 192.168.1.100.",
        "expected_args": {"host": "192.168.1.100", "port": 443},
        "mock_result": "Port 443 on 192.168.1.100: OPEN (HTTPS).",
    },
    {
        "name": "convert_units",
        "description": "Convert a measurement from one unit to another (length, weight, temperature, etc.).",
        "parameters": {
            "type": "object",
            "properties": {
                "value": {"type": "number", "description": "The numeric value to convert."},
                "from_unit": {"type": "string", "description": "Source unit (e.g., kilometers, pounds, celsius)."},
                "to_unit": {"type": "string", "description": "Target unit (e.g., miles, kilograms, fahrenheit)."},
            },
            "required": ["value", "from_unit", "to_unit"],
        },
        "test_prompt": "Convert 72 degrees Fahrenheit to Celsius.",
        "expected_args": {"value": 72},
        "mock_result": "72F = 22.2C.",
    },
    {
        "name": "find_restaurant",
        "description": "Find nearby restaurants matching cuisine type and budget.",
        "parameters": {
            "type": "object",
            "properties": {
                "cuisine": {"type": "string", "description": "Type of cuisine (e.g., Italian, Sushi, Mexican)."},
                "location": {"type": "string", "description": "Area or address to search near."},
                "budget": {"type": "string", "description": "Budget level: cheap, moderate, expensive."},
            },
            "required": ["cuisine", "location"],
        },
        "test_prompt": "Find a moderate-budget Italian restaurant near downtown Portland.",
        "expected_args": {"cuisine": "Italian"},
        "mock_result": "Found: Piazza Italia (4.5 stars, $$), 0.3 mi from downtown Portland.",
    },
    {
        "name": "extract_text_from_pdf",
        "description": "Extract all text content from a PDF file.",
        "parameters": {
            "type": "object",
            "properties": {
                "pdf_filepath": {"type": "string", "description": "Path to the PDF file."},
                "page_range": {"type": "string", "description": "Optional page range (e.g., '1-5' or 'all')."},
            },
            "required": ["pdf_filepath"],
        },
        "test_prompt": "Extract the text from 'report.pdf' pages 1 through 3.",
        "expected_args": {"pdf_filepath": "report.pdf"},
        "mock_result": "Extracted 2,340 words from pages 1-3 of 'report.pdf'.",
    },
    {
        "name": "run_code_snippet",
        "description": "Execute a code snippet in a sandboxed environment and return the output.",
        "parameters": {
            "type": "object",
            "properties": {
                "language": {"type": "string", "description": "Programming language (python, javascript, etc.)."},
                "code": {"type": "string", "description": "The code to execute."},
            },
            "required": ["language", "code"],
        },
        "test_prompt": "Run this Python code: print(sum(range(1, 101)))",
        "expected_args": {"language": "python"},
        "mock_result": "Output: 5050",
    },
    {
        "name": "get_news_headlines",
        "description": "Fetch the latest news headlines for a given topic or category.",
        "parameters": {
            "type": "object",
            "properties": {
                "topic": {"type": "string", "description": "News topic or category (e.g., technology, sports, politics)."},
                "count": {"type": "integer", "description": "Number of headlines to fetch."},
            },
            "required": ["topic"],
        },
        "test_prompt": "Get me the top 5 technology news headlines.",
        "expected_args": {"topic": "technology"},
        "mock_result": "1. AI Chip Sales Surge... 2. New Quantum Computing Breakthrough... (5 headlines)",
    },
    {
        "name": "book_flight",
        "description": "Search and book a flight between two airports.",
        "parameters": {
            "type": "object",
            "properties": {
                "departure_airport": {"type": "string", "description": "Departure airport code (e.g., SFO, JFK)."},
                "arrival_airport": {"type": "string", "description": "Arrival airport code."},
                "date": {"type": "string", "description": "Flight date (YYYY-MM-DD)."},
                "passengers": {"type": "integer", "description": "Number of passengers."},
            },
            "required": ["departure_airport", "arrival_airport", "date"],
        },
        "test_prompt": "Find a flight from JFK to LAX on 2026-07-20 for 2 passengers.",
        "expected_args": {"departure_airport": "JFK"},
        "mock_result": "Found: AA 1042 JFK->LAX, departs 08:15, $289/person.",
    },
    {
        "name": "analyze_sentiment",
        "description": "Analyze the emotional sentiment of a given text (positive, negative, neutral).",
        "parameters": {
            "type": "object",
            "properties": {
                "text": {"type": "string", "description": "The text to analyze for sentiment."},
            },
            "required": ["text"],
        },
        "test_prompt": "Analyze the sentiment of: 'I absolutely loved the movie, it was fantastic!'",
        "expected_args": {"text": "I absolutely loved the movie, it was fantastic!"},
        "mock_result": "Sentiment: POSITIVE (confidence: 0.96). Keywords: loved, fantastic.",
    },
    {
        "name": "shorten_url",
        "description": "Create a shortened URL from a long URL.",
        "parameters": {
            "type": "object",
            "properties": {
                "long_url": {"type": "string", "description": "The original long URL to shorten."},
            },
            "required": ["long_url"],
        },
        "test_prompt": "Shorten this URL: https://www.example.com/very/long/path/to/some/resource?param=value",
        "expected_args": {"long_url": "https://www.example.com/very/long/path/to/some/resource?param=value"},
        "mock_result": "Shortened: https://sho.rt/x7Kp2",
    },
    {
        "name": "get_system_info",
        "description": "Get current system information (CPU, RAM, disk usage, OS).",
        "parameters": {
            "type": "object",
            "properties": {
                "detail_level": {"type": "string", "description": "Level of detail: basic, detailed, full."},
            },
            "required": [],
        },
        "test_prompt": "Show me detailed system information about this computer.",
        "expected_args": {},
        "mock_result": "OS: macOS 14.5, CPU: Apple M3 (8 cores), RAM: 16GB (9.2GB used), Disk: 512GB (340GB free).",
    },
    {
        "name": "create_qr_code",
        "description": "Generate a QR code image from text or URL content.",
        "parameters": {
            "type": "object",
            "properties": {
                "content": {"type": "string", "description": "The text or URL to encode in the QR code."},
                "output_file": {"type": "string", "description": "Output image file path."},
            },
            "required": ["content", "output_file"],
        },
        "test_prompt": "Create a QR code for 'https://mywebsite.com' and save it as 'qr.png'.",
        "expected_args": {"content": "https://mywebsite.com"},
        "mock_result": "QR code generated and saved to 'qr.png'.",
    },
    {
        "name": "query_database",
        "description": "Execute a read-only SQL query against the application database.",
        "parameters": {
            "type": "object",
            "properties": {
                "sql": {"type": "string", "description": "The SQL SELECT query to execute."},
                "database": {"type": "string", "description": "Database name to query."},
            },
            "required": ["sql", "database"],
        },
        "test_prompt": "Query the 'users' database to count how many users signed up this month: SELECT COUNT(*) FROM users WHERE created_at >= '2026-05-01'",
        "expected_args": {"database": "users"},
        "mock_result": "Query result: COUNT(*) = 1,247.",
    },
    {
        "name": "record_voice_note",
        "description": "Record an audio voice note for a specified duration.",
        "parameters": {
            "type": "object",
            "properties": {
                "duration_seconds": {"type": "integer", "description": "Recording duration in seconds."},
                "output_file": {"type": "string", "description": "Output audio file path."},
            },
            "required": ["duration_seconds", "output_file"],
        },
        "test_prompt": "Record a 30-second voice note and save it as 'memo.wav'.",
        "expected_args": {"duration_seconds": 30},
        "mock_result": "Recorded 30 seconds of audio, saved to 'memo.wav'.",
    },
    {
        "name": "brightness_control",
        "description": "Adjust the screen brightness level.",
        "parameters": {
            "type": "object",
            "properties": {
                "level": {"type": "integer", "description": "Brightness percentage (0-100)."},
            },
            "required": ["level"],
        },
        "test_prompt": "Set screen brightness to 40%.",
        "expected_args": {"level": 40},
        "mock_result": "Screen brightness set to 40%.",
    },
]


# --- GitHub Copilot API helpers ---


def get_token() -> str:
    """Get GitHub token from environment variable or GitHub CLI."""
    token = os.environ.get("GITHUB_TOKEN", "")
    if not token:
        token = os.environ.get("GH_TOKEN", "")
    if not token:
        # Try to get token from GitHub CLI - try 'gh' then full path
        gh_paths = ["gh"]
        if platform.system() == "Windows":
            gh_paths.append(r"C:\Program Files\GitHub CLI\gh.exe")
        for gh_cmd in gh_paths:
            try:
                result = subprocess.run(
                    [gh_cmd, "auth", "token"],
                    capture_output=True, text=True, timeout=5
                )
                if result.returncode == 0 and result.stdout.strip():
                    token = result.stdout.strip()
                    break
            except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
                continue
    return token


def _get_log_path() -> str:
    """Return log file path with timestamp for this run."""
    ts = time.strftime("%Y%m%d_%H%M%S")
    return f"copilot_tool_recall_{ts}.log"


def _write_log(log_path: str, lines: list):
    """Append lines to log file."""
    with open(log_path, "a", encoding="utf-8") as f:
        for line in lines:
            f.write(line + "\n")


def github_models_chat(model: str, messages: list, tool_list: list, token: str) -> dict:
    """Send a chat completion request to GitHub Copilot API."""
    url = f"{COPILOT_API_URL}/chat/completions"
    payload = {
        "model": model,
        "messages": messages,
        "tools": tool_list,
        "tool_choice": "auto",
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
            "Editor-Version": "vscode/1.100.0",
            "Copilot-Integration-Id": "copilot-chat",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode("utf-8"))


def verify_connection(token: str) -> bool:
    """Verify that the token works with GitHub Copilot API."""
    url = f"{COPILOT_API_URL}/models"
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Editor-Version": "vscode/1.100.0",
        },
        method="GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status == 200
    except Exception:
        return False


# --- Test runner ---


def build_tool_schema(tool_def: dict) -> dict:
    """Convert a tool pool entry into OpenAI tool schema."""
    return {
        "type": "function",
        "function": {
            "name": tool_def["name"],
            "description": tool_def["description"],
            "parameters": tool_def["parameters"],
        },
    }


def test_single_call(model: str, target_tool: dict, all_tool_schemas: list, token: str) -> dict:
    """Test if the model selects the correct tool from the available set."""
    prompt = target_tool["test_prompt"]
    expected_name = target_tool["name"]

    start = time.perf_counter()
    try:
        response = github_models_chat(
            model, [{"role": "user", "content": prompt}], all_tool_schemas, token
        )
        elapsed = round(time.perf_counter() - start, 3)

        choices = response.get("choices", [])
        if not choices:
            return {"correct": False, "called": None, "elapsed": elapsed, "error": "No choices"}

        message = choices[0].get("message", {})
        tool_calls = message.get("tool_calls", [])

        if not tool_calls:
            return {"correct": False, "called": None, "elapsed": elapsed, "error": "No tool call made"}

        first_call = tool_calls[0]
        called_name = first_call.get("function", {}).get("name", "")
        correct = called_name == expected_name

        return {
            "correct": correct,
            "called": called_name,
            "expected": expected_name,
            "elapsed": elapsed,
            "error": None,
        }

    except urllib.error.HTTPError as e:
        elapsed = round(time.perf_counter() - start, 3)
        body = ""
        try:
            body = e.read().decode("utf-8", errors="replace")[:200]
        except Exception:
            pass
        return {"correct": False, "called": None, "elapsed": elapsed, "error": f"HTTP {e.code}: {body}"}
    except Exception as e:
        elapsed = round(time.perf_counter() - start, 3)
        return {"correct": False, "called": None, "elapsed": elapsed, "error": str(e)}


def run_capacity_test(model: str, token: str, max_tools: int = None, log_callback=None) -> list:
    """Progressively test the model with increasing numbers of tools."""
    if max_tools is None:
        max_tools = len(TOOL_POOL)
    max_tools = min(max_tools, len(TOOL_POOL))

    def log(msg):
        if log_callback:
            log_callback(msg)

    # Define test levels
    test_levels = []
    level = 2
    while level <= max_tools:
        test_levels.append(level)
        if level < 5:
            level += 1
        elif level < 10:
            level += 2
        elif level < 20:
            level += 5
        else:
            level += 5
    if test_levels and test_levels[-1] != max_tools and max_tools > test_levels[-1]:
        test_levels.append(max_tools)

    results = []
    rng = random.Random(42)

    for tool_count in test_levels:
        log(f"\n{'='*50}")
        log(f"Testing with {tool_count} tools available...")
        log(f"{'='*50}")

        subset = TOOL_POOL[:tool_count]
        schemas = [build_tool_schema(t) for t in subset]

        # Sample up to 5 tools to test per level
        test_targets = subset if tool_count <= 5 else rng.sample(subset, min(5, tool_count))
        correct_count = 0
        total_count = len(test_targets)
        level_details = []

        for target in test_targets:
            result = test_single_call(model, target, schemas, token)
            level_details.append(result)

            if result["correct"]:
                correct_count += 1
                log(f"  [PASS] '{target['name']}' correctly called ({result['elapsed']}s)")
            else:
                called = result["called"] or "none"
                err = result.get("error", "")
                log(f"  [FAIL] Expected '{target['name']}', got '{called}' {err} ({result['elapsed']}s)")

            # Small delay to respect rate limits
            time.sleep(0.5)

        accuracy = correct_count / total_count if total_count > 0 else 0
        log(f"  >> Accuracy at {tool_count} tools: {correct_count}/{total_count} = {accuracy:.0%}")

        results.append({
            "tool_count": tool_count,
            "accuracy": accuracy,
            "correct": correct_count,
            "total": total_count,
            "details": level_details,
        })

    return results


# --- GUI ---


class _Tooltip:
    """Minimal tooltip helper for tk widgets."""

    def __init__(self, widget, text: str):
        self.widget = widget
        self.text = text
        self._tip = None
        widget.bind("<Enter>", self._show)
        widget.bind("<Leave>", self._hide)
        widget.bind("<ButtonPress>", self._hide)

    def _show(self, _event=None):
        if self._tip or not self.text:
            return
        x, y, _, _ = self.widget.bbox("insert") if self.widget.winfo_class() == "TEntry" else (0, 0, 0, 0)
        x += self.widget.winfo_rootx() + 20
        y += self.widget.winfo_rooty() + 25
        self._tip = tw = tk.Toplevel(self.widget)
        tw.wm_overrideredirect(True)
        tw.wm_geometry(f"+{x}+{y}")
        tk.Label(
            tw, text=self.text, justify="left",
            background="#ffffe0", relief="solid", borderwidth=1,
            font=("Segoe UI", 9), padx=4, pady=2,
        ).pack()

    def _hide(self, _event=None):
        if self._tip:
            self._tip.destroy()
            self._tip = None


class ToolRecallCopilotGUI:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Tool Recall Capacity Test (GitHub Copilot / GitHub Models)")

        screen_w = self.root.winfo_screenwidth()
        screen_h = self.root.winfo_screenheight()
        win_w = min(1000, int(screen_w * 0.8))
        win_h = min(780, int(screen_h * 0.8))
        x = (screen_w - win_w) // 2
        y = (screen_h - win_h) // 2
        self.root.geometry(f"{win_w}x{win_h}+{x}+{y}")
        self.root.minsize(700, 500)

        self._running = False
        self._log_lines = []
        self._log_path = None
        self._build_ui()

    def _build_ui(self):
        # Controls
        ctrl = ttk.Frame(self.root, padding=10)
        ctrl.pack(fill=tk.X)

        ttk.Label(ctrl, text="GitHub Token:").grid(row=0, column=0, sticky=tk.W)
        self.token_var = tk.StringVar(value=get_token())
        token_entry = ttk.Entry(ctrl, textvariable=self.token_var, width=40, show="*")
        token_entry.grid(row=0, column=1, padx=5)

        ttk.Label(ctrl, text="Model:").grid(row=0, column=2, padx=(10, 0))
        self.model_var = tk.StringVar(value=AVAILABLE_MODELS[0])  # default claude-opus-4.6-high
        model_combo = ttk.Combobox(ctrl, textvariable=self.model_var, values=AVAILABLE_MODELS, width=20)
        model_combo.grid(row=0, column=3, padx=5)

        ttk.Label(ctrl, text="Max tools:").grid(row=0, column=4, padx=(10, 0))
        self.max_tools_var = tk.StringVar(value=str(len(TOOL_POOL)))
        vcmd = (self.root.register(self._validate_max_tools), "%P")
        max_entry = ttk.Entry(
            ctrl,
            textvariable=self.max_tools_var,
            width=4,
            validate="key",
            validatecommand=vcmd,
        )
        max_entry.grid(row=0, column=5, padx=5)
        max_entry.bind("<FocusOut>", lambda _e: self._clamp_max_tools())
        max_entry.bind("<Return>", lambda _e: self._clamp_max_tools())
        _Tooltip(max_entry, f"Max tools to test (1-{len(TOOL_POOL)}). Lower = faster run.")

        self.run_btn = ttk.Button(ctrl, text="Run Test", command=self._start)
        self.run_btn.grid(row=0, column=6, padx=15)

        # Phase selection (row 1)
        ttk.Label(ctrl, text="Phase:").grid(row=1, column=0, sticky=tk.W, pady=(8, 0))
        self.phase_var = tk.StringVar(value="both")
        phase_frame = ttk.Frame(ctrl)
        phase_frame.grid(row=1, column=1, columnspan=6, sticky=tk.W, pady=(8, 0))
        ttk.Radiobutton(phase_frame, text="Both", variable=self.phase_var, value="both").pack(side=tk.LEFT, padx=(0, 10))
        ttk.Radiobutton(phase_frame, text="Phase 1 only (capacity)", variable=self.phase_var, value="phase1").pack(side=tk.LEFT, padx=(0, 10))
        ttk.Radiobutton(phase_frame, text="Phase 2 only (adversarial)", variable=self.phase_var, value="phase2").pack(side=tk.LEFT)

        # Info
        info_frame = ttk.Frame(self.root, padding=(10, 0))
        info_frame.pack(fill=tk.X)
        ttk.Label(
            info_frame,
            text=f"Pool: {len(TOOL_POOL)} tools | API: GitHub Copilot (api.githubcopilot.com) | Auth: 'gh auth token' or GITHUB_TOKEN env var",
            foreground="gray",
        ).pack(anchor=tk.W)

        # Results
        results_frame = ttk.LabelFrame(self.root, text="Results", padding=5)
        results_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        self.results_text = scrolledtext.ScrolledText(
            results_frame, wrap=tk.WORD, font=("Consolas", 10)
        )
        self.results_text.pack(fill=tk.BOTH, expand=True)

        # Status
        self.status_var = tk.StringVar(value="Ready - Enter your GitHub token and click Run Test")
        ttk.Label(self.root, textvariable=self.status_var, relief=tk.SUNKEN, anchor=tk.W).pack(
            fill=tk.X, side=tk.BOTTOM, padx=10, pady=(0, 5)
        )

    def _log(self, msg: str):
        self._log_lines.append(msg)
        self.root.after(0, self._append_log, msg + "\n")

    def _append_log(self, text: str):
        self.results_text.config(state=tk.NORMAL)
        self.results_text.insert(tk.END, text)
        self.results_text.see(tk.END)

    def _start(self):
        if self._running:
            return

        token = self.token_var.get().strip()
        if not token:
            self._set_status("ERROR: No GitHub token provided. Set GITHUB_TOKEN or paste above.")
            return

        self._running = True
        self.run_btn.config(state=tk.DISABLED)
        self.results_text.config(state=tk.NORMAL)
        self.results_text.delete("1.0", tk.END)

        # Init log buffer for this run
        self._log_lines = []
        self._log_path = _get_log_path()

        model = self.model_var.get().strip()
        self._clamp_max_tools()
        try:
            max_t = int(self.max_tools_var.get())
        except ValueError:
            max_t = len(TOOL_POOL)
        max_t = max(1, min(max_t, len(TOOL_POOL)))

        phase = self.phase_var.get()
        threading.Thread(target=self._run, args=(token, model, max_t, phase), daemon=True).start()

    def _run(self, token: str, model: str, max_tools: int, phase: str = "both"):
        self._set_status("Verifying connection to GitHub Copilot API...")
        self._log("Verifying GitHub Copilot API connection...")

        if not verify_connection(token):
            self._log("ERROR: Cannot authenticate with GitHub Copilot API.")
            self._log("Run: gh auth login && gh auth refresh -s copilot")
            self._log("Or set GITHUB_TOKEN with a token that has copilot scope.")
            self._finish()
            return

        self._log(f"Connected successfully.\n")
        self._log(f"Model: {model}")
        self._log(f"Tool pool: {len(TOOL_POOL)} tools, testing up to {max_tools}")
        self._log(f"Phase selection: {phase}\n")

        self._set_status(f"Testing: {model}")

        results = []
        if phase in ("both", "phase1"):
            results = run_capacity_test(model, token, max_tools, self._log)
            self._log_phase1_summary(model, results)

        if phase in ("both", "phase2"):
            self._set_status(f"Phase 2 (adversarial): {model}")
            run_phase2_test(model, token, log_callback=self._log)

        # Save full log to timestamped file
        if self._log_path:
            try:
                _write_log(self._log_path, self._log_lines)
                self._log(f"\nLog saved to: {self._log_path}")
            except Exception as e:
                self._log(f"\nWARNING: failed to write log file: {e}")

        self._finish()

    def _log_phase1_summary(self, model: str, results: list):
        self._log(f"\n{'='*50}")
        self._log("PHASE 1 SUMMARY")
        self._log(f"{'='*50}")
        self._log(f"Model: {model}")
        self._log(f"Tool pool size: {len(TOOL_POOL)}")
        self._log(f"{'Tools':<8} {'Correct':<10} {'Total':<8} {'Accuracy'}")
        for r in results:
            self._log(f"{r['tool_count']:<8} {r['correct']:<10} {r['total']:<8} {r['accuracy']:.0%}")

        any_failures = False
        for r in results:
            failures = [d for d in r["details"] if not d["correct"]]
            if failures:
                if not any_failures:
                    self._log("\nDetailed Failures:")
                    any_failures = True
                self._log(f"  At {r['tool_count']} tools:")
                for f in failures:
                    self._log(
                        f"    - expected '{f.get('expected', '?')}', "
                        f"got '{f.get('called', 'none')}' "
                        f"(error: {f.get('error', '-')})"
                    )

    def _set_status(self, msg):
        self.root.after(0, lambda: self.status_var.set(msg))

    def _validate_max_tools(self, proposed: str) -> bool:
        if proposed == "":
            return True
        if not proposed.isdigit():
            return False
        if len(proposed) > len(str(len(TOOL_POOL))):
            return False
        return int(proposed) <= len(TOOL_POOL)

    def _clamp_max_tools(self):
        raw = self.max_tools_var.get().strip()
        if not raw.isdigit():
            self.max_tools_var.set(str(len(TOOL_POOL)))
            return
        val = max(1, min(int(raw), len(TOOL_POOL)))
        self.max_tools_var.set(str(val))

    def _finish(self):
        self._running = False
        self.root.after(0, lambda: self.run_btn.config(state=tk.NORMAL))
        self._set_status("Done")

    def run(self):
        self.root.mainloop()


# --- CLI mode (see main_cli below Phase 2) ---


# =============================================================================
# PHASE 2: Adversarial Tool Recall Test
# =============================================================================
# Targets four weaknesses absent from Phase 1:
#   1. SEMANTIC_OVERLAP  - Tools with confusingly similar names/descriptions
#   2. INDIRECT_PROMPT   - Prompts that don't directly name the action
#   3. DECOY_TOOL        - Distractor tools designed to mislead
#   4. RANDOM_ORDER      - Tool list shuffled to remove positional bias
#
# Each test case is tagged with the challenge category so failures are clear.
# =============================================================================

PHASE2_TOOLS = [
    # --- Cluster: Search tools (semantic overlap) ---
    {
        "name": "search_web",
        "description": "Search the public internet for web pages matching a query.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query string."},
                "num_results": {"type": "integer", "description": "Number of results to return."},
            },
            "required": ["query"],
        },
    },
    {
        "name": "search_wikipedia",
        "description": "Search Wikipedia encyclopaedia articles for factual information.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Wikipedia search query."},
            },
            "required": ["query"],
        },
    },
    {
        "name": "search_news",
        "description": "Search recent news articles and headlines from news outlets.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "News search query."},
                "days_back": {"type": "integer", "description": "How many days back to search."},
            },
            "required": ["query"],
        },
    },
    {
        "name": "search_academic",
        "description": "Search academic papers and research publications.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Academic paper search query."},
                "year_from": {"type": "integer", "description": "Minimum publication year."},
            },
            "required": ["query"],
        },
    },
    {
        "name": "search_local_files",
        "description": "Search for files on the local filesystem by name or content.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Filename or content pattern to search."},
                "directory": {"type": "string", "description": "Directory to search in."},
            },
            "required": ["query"],
        },
    },
    # --- Cluster: Conversion tools (semantic overlap) ---
    {
        "name": "convert_currency",
        "description": "Convert monetary amounts between currencies using live exchange rates.",
        "parameters": {
            "type": "object",
            "properties": {
                "amount": {"type": "number", "description": "Amount to convert."},
                "from_currency": {"type": "string", "description": "Source currency code (e.g., USD)."},
                "to_currency": {"type": "string", "description": "Target currency code (e.g., EUR)."},
            },
            "required": ["amount", "from_currency", "to_currency"],
        },
    },
    {
        "name": "convert_units",
        "description": "Convert physical measurements between units (length, weight, volume, temperature).",
        "parameters": {
            "type": "object",
            "properties": {
                "value": {"type": "number", "description": "Numeric value to convert."},
                "from_unit": {"type": "string", "description": "Source unit (e.g., miles, kg, celsius)."},
                "to_unit": {"type": "string", "description": "Target unit (e.g., km, lbs, fahrenheit)."},
            },
            "required": ["value", "from_unit", "to_unit"],
        },
    },
    {
        "name": "convert_timezone",
        "description": "Convert a date/time from one timezone to another.",
        "parameters": {
            "type": "object",
            "properties": {
                "datetime": {"type": "string", "description": "The datetime string to convert."},
                "from_tz": {"type": "string", "description": "Source timezone (e.g., America/New_York)."},
                "to_tz": {"type": "string", "description": "Target timezone (e.g., Asia/Tokyo)."},
            },
            "required": ["datetime", "from_tz", "to_tz"],
        },
    },
    {
        "name": "convert_file_format",
        "description": "Convert a file from one format to another (e.g., PNG to JPEG, DOCX to PDF).",
        "parameters": {
            "type": "object",
            "properties": {
                "input_file": {"type": "string", "description": "Path to source file."},
                "output_format": {"type": "string", "description": "Target format (e.g., pdf, jpeg, mp3)."},
            },
            "required": ["input_file", "output_format"],
        },
    },
    # --- Cluster: Communication tools (semantic overlap) ---
    {
        "name": "send_email",
        "description": "Send an email message to one or more recipients.",
        "parameters": {
            "type": "object",
            "properties": {
                "to": {"type": "string", "description": "Recipient email address."},
                "subject": {"type": "string", "description": "Email subject."},
                "body": {"type": "string", "description": "Email body text."},
            },
            "required": ["to", "subject", "body"],
        },
    },
    {
        "name": "send_sms",
        "description": "Send a text message (SMS) to a phone number.",
        "parameters": {
            "type": "object",
            "properties": {
                "phone_number": {"type": "string", "description": "Recipient phone number."},
                "message": {"type": "string", "description": "Text message content."},
            },
            "required": ["phone_number", "message"],
        },
    },
    {
        "name": "send_slack_message",
        "description": "Send a message to a Slack channel or user.",
        "parameters": {
            "type": "object",
            "properties": {
                "channel": {"type": "string", "description": "Slack channel name or user ID."},
                "message": {"type": "string", "description": "Message text."},
            },
            "required": ["channel", "message"],
        },
    },
    {
        "name": "send_push_notification",
        "description": "Send a push notification to the user's mobile device.",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Notification title."},
                "body": {"type": "string", "description": "Notification body text."},
                "priority": {"type": "string", "description": "Priority: low, normal, high."},
            },
            "required": ["title", "body"],
        },
    },
    # --- Cluster: Scheduling tools (semantic overlap) ---
    {
        "name": "create_calendar_event",
        "description": "Create a new event on the user's calendar with a specific date and time.",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Event title."},
                "date": {"type": "string", "description": "Event date (YYYY-MM-DD)."},
                "time": {"type": "string", "description": "Event time (HH:MM)."},
                "duration_minutes": {"type": "integer", "description": "Event duration."},
            },
            "required": ["title", "date", "time"],
        },
    },
    {
        "name": "create_reminder",
        "description": "Create a simple reminder that alerts at a specified time.",
        "parameters": {
            "type": "object",
            "properties": {
                "message": {"type": "string", "description": "Reminder text."},
                "remind_at": {"type": "string", "description": "When to trigger (ISO datetime)."},
            },
            "required": ["message", "remind_at"],
        },
    },
    {
        "name": "set_alarm",
        "description": "Set a recurring or one-time alarm clock.",
        "parameters": {
            "type": "object",
            "properties": {
                "time": {"type": "string", "description": "Alarm time (HH:MM)."},
                "label": {"type": "string", "description": "Alarm label."},
                "recurring": {"type": "boolean", "description": "Whether alarm repeats daily."},
            },
            "required": ["time"],
        },
    },
    {
        "name": "set_timer",
        "description": "Set a countdown timer for a specified duration.",
        "parameters": {
            "type": "object",
            "properties": {
                "duration_minutes": {"type": "integer", "description": "Timer duration in minutes."},
                "label": {"type": "string", "description": "Timer label."},
            },
            "required": ["duration_minutes"],
        },
    },
    # --- Decoy/distractor tools ---
    {
        "name": "get_weather",
        "description": "Get current weather conditions for a city.",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name."},
            },
            "required": ["city"],
        },
    },
    {
        "name": "get_weather_forecast",
        "description": "Get the multi-day weather forecast for a location.",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name."},
                "days": {"type": "integer", "description": "Number of forecast days (1-14)."},
            },
            "required": ["city", "days"],
        },
    },
    {
        "name": "get_air_quality",
        "description": "Get the air quality index and pollution levels for a city.",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name."},
            },
            "required": ["city"],
        },
    },
    {
        "name": "translate_text",
        "description": "Translate text from one natural language to another.",
        "parameters": {
            "type": "object",
            "properties": {
                "text": {"type": "string", "description": "Text to translate."},
                "source_language": {"type": "string", "description": "Source language."},
                "target_language": {"type": "string", "description": "Target language."},
            },
            "required": ["text", "target_language"],
        },
    },
    {
        "name": "summarize_text",
        "description": "Produce a concise summary of a longer text passage.",
        "parameters": {
            "type": "object",
            "properties": {
                "text": {"type": "string", "description": "The long text to summarize."},
                "max_sentences": {"type": "integer", "description": "Maximum sentences in summary."},
            },
            "required": ["text"],
        },
    },
    {
        "name": "paraphrase_text",
        "description": "Rewrite text in different words while preserving meaning.",
        "parameters": {
            "type": "object",
            "properties": {
                "text": {"type": "string", "description": "Text to paraphrase."},
                "tone": {"type": "string", "description": "Desired tone: formal, casual, academic."},
            },
            "required": ["text"],
        },
    },
    {
        "name": "calculate_tip",
        "description": "Calculate tip amount for a restaurant bill.",
        "parameters": {
            "type": "object",
            "properties": {
                "bill_amount": {"type": "number", "description": "Bill total."},
                "tip_percentage": {"type": "number", "description": "Tip percentage."},
            },
            "required": ["bill_amount", "tip_percentage"],
        },
    },
    {
        "name": "calculate_split_bill",
        "description": "Split a restaurant bill evenly among a group of people.",
        "parameters": {
            "type": "object",
            "properties": {
                "bill_amount": {"type": "number", "description": "Total bill."},
                "num_people": {"type": "integer", "description": "Number of people splitting."},
                "tip_percentage": {"type": "number", "description": "Tip percentage to add."},
            },
            "required": ["bill_amount", "num_people"],
        },
    },
]

# Phase 2 test cases: each targets a specific challenge category
PHASE2_TEST_CASES = [
    # --- SEMANTIC_OVERLAP: Must pick the right tool from similar options ---
    {
        "category": "SEMANTIC_OVERLAP",
        "prompt": "Find the Wikipedia article about the history of the Roman Empire.",
        "expected_tool": "search_wikipedia",
        "rationale": "Must pick search_wikipedia over search_web, search_news, search_academic",
    },
    {
        "category": "SEMANTIC_OVERLAP",
        "prompt": "Search for recent news articles about the 2026 World Cup.",
        "expected_tool": "search_news",
        "rationale": "Must pick search_news over search_web, search_wikipedia",
    },
    {
        "category": "SEMANTIC_OVERLAP",
        "prompt": "Find peer-reviewed papers on CRISPR gene editing published after 2023.",
        "expected_tool": "search_academic",
        "rationale": "Must pick search_academic over search_web, search_wikipedia",
    },
    {
        "category": "SEMANTIC_OVERLAP",
        "prompt": "Find a file called 'budget_2026.xlsx' on my computer.",
        "expected_tool": "search_local_files",
        "rationale": "Must pick search_local_files over other search tools",
    },
    {
        "category": "SEMANTIC_OVERLAP",
        "prompt": "How many Japanese yen will I get for 200 euros?",
        "expected_tool": "convert_currency",
        "rationale": "Must pick convert_currency over convert_units, convert_timezone",
    },
    {
        "category": "SEMANTIC_OVERLAP",
        "prompt": "How many kilometers is 26.2 miles?",
        "expected_tool": "convert_units",
        "rationale": "Must pick convert_units over convert_currency",
    },
    {
        "category": "SEMANTIC_OVERLAP",
        "prompt": "What time is it in Tokyo when it's 3pm in New York?",
        "expected_tool": "convert_timezone",
        "rationale": "Must pick convert_timezone over convert_units, create_calendar_event",
    },
    {
        "category": "SEMANTIC_OVERLAP",
        "prompt": "Post a message in the #engineering Slack channel saying 'Deploy complete'.",
        "expected_tool": "send_slack_message",
        "rationale": "Must pick send_slack_message over send_email, send_sms, send_push_notification",
    },
    {
        "category": "SEMANTIC_OVERLAP",
        "prompt": "Text my wife at 555-0123 that I'll be late for dinner.",
        "expected_tool": "send_sms",
        "rationale": "Must pick send_sms over send_email, send_slack_message",
    },
    {
        "category": "SEMANTIC_OVERLAP",
        "prompt": "I need to wake up at 6:30am every weekday.",
        "expected_tool": "set_alarm",
        "rationale": "Must pick set_alarm (recurring wake-up) over set_timer, create_reminder",
    },
    # --- INDIRECT_PROMPT: Prompts that don't use the tool's vocabulary ---
    {
        "category": "INDIRECT_PROMPT",
        "prompt": "I have a meeting with the Tokyo office but I'm in London - when should I dial in if they start at 9am their time?",
        "expected_tool": "convert_timezone",
        "rationale": "Indirect - says 'when should I dial in' not 'convert timezone'",
    },
    {
        "category": "INDIRECT_PROMPT",
        "prompt": "My landlord only accepts rent in British pounds but my salary is in dollars. I need to pay 1500 GBP.",
        "expected_tool": "convert_currency",
        "rationale": "Indirect - describes a payment scenario, doesn't say 'convert currency'",
    },
    {
        "category": "INDIRECT_PROMPT",
        "prompt": "I'm flying to Paris next week and want to know if I should pack an umbrella for the next 5 days.",
        "expected_tool": "get_weather_forecast",
        "rationale": "Indirect - 'pack umbrella' implies multi-day forecast, not current weather",
    },
    {
        "category": "INDIRECT_PROMPT",
        "prompt": "My boss wants a one-paragraph version of this report instead of the full text. Can you make it shorter? Report: 'The Q1 sales figures show a 12% increase over last year, driven primarily by strong performance in the North American region. European sales remained flat due to ongoing supply chain issues, while Asian markets grew 18%. The new product line launched in February exceeded forecasts by 25%. Marketing spend was 8% under budget. Customer retention improved from 87% to 91% year-over-year.'",
        "expected_tool": "summarize_text",
        "rationale": "Indirect - 'make shorter' and 'one-paragraph version' implies summarize",
    },
    {
        "category": "INDIRECT_PROMPT",
        "prompt": "My essay opening sounds too casual for an academic submission. Can you make it sound more professional without changing the meaning? Opening: 'So basically, the whole point of this paper is to show that climate change is messing up coral reefs in a pretty serious way.'",
        "expected_tool": "paraphrase_text",
        "rationale": "Indirect - 'sound more professional without changing meaning' = paraphrase",
    },
    {
        "category": "INDIRECT_PROMPT",
        "prompt": "We're a group of 4 at the restaurant and the total came to $156. Everyone should pay the same amount with a 20% tip included.",
        "expected_tool": "calculate_split_bill",
        "rationale": "Indirect - describes bill splitting scenario, doesn't say 'split bill'",
    },
    {
        "category": "INDIRECT_PROMPT",
        "prompt": "My thesis advisor recommended a paper by Smith et al. on transformer architectures from 2024. Can you help me find it?",
        "expected_tool": "search_academic",
        "rationale": "Indirect - 'thesis advisor recommended a paper' implies academic search",
    },
    {
        "category": "INDIRECT_PROMPT",
        "prompt": "I need to let my team know the build succeeded but I don't want to email - just drop it in our dev channel.",
        "expected_tool": "send_slack_message",
        "rationale": "Indirect - 'drop it in our dev channel' implies Slack, explicitly rules out email",
    },
    # --- DECOY_TOOL: The prompt is designed so a plausible-but-wrong tool exists ---
    {
        "category": "DECOY_TOOL",
        "prompt": "Is the air safe to breathe outdoors in Beijing today?",
        "expected_tool": "get_air_quality",
        "rationale": "Decoy: get_weather is tempting (outdoor conditions), but air safety = air quality",
    },
    {
        "category": "DECOY_TOOL",
        "prompt": "What's the weather like right now in Seattle?",
        "expected_tool": "get_weather",
        "rationale": "Decoy: get_weather_forecast is tempting, but 'right now' = current weather",
    },
    {
        "category": "DECOY_TOOL",
        "prompt": "Rewrite this paragraph to sound different but keep the same information: 'The experiment showed a 15% improvement in efficiency.'",
        "expected_tool": "paraphrase_text",
        "rationale": "Decoy: translate_text and summarize_text are tempting, but 'rewrite to sound different same info' = paraphrase",
    },
    {
        "category": "DECOY_TOOL",
        "prompt": "My pasta is boiling - count down 8 minutes for me.",
        "expected_tool": "set_timer",
        "rationale": "Decoy: set_alarm is tempting (both are time-based), but 'count down 8 minutes' = timer",
    },
    {
        "category": "DECOY_TOOL",
        "prompt": "Can you buzz my phone with a note about buying milk tomorrow afternoon?",
        "expected_tool": "create_reminder",
        "rationale": "Decoy: send_push_notification is tempting (buzz phone), but a scheduled note about a task = reminder",
    },
    {
        "category": "DECOY_TOOL",
        "prompt": "I want to put a doctor visit on my schedule for June 10th at 2pm.",
        "expected_tool": "create_calendar_event",
        "rationale": "Decoy: create_reminder is tempting, but 'put on schedule' with date+time = calendar event",
    },
    {
        "category": "DECOY_TOOL",
        "prompt": "Turn my Word document at C:\\Users\\me\\report.docx into a PDF.",
        "expected_tool": "convert_file_format",
        "rationale": "Decoy: convert_units is tempting (both 'convert'), but file conversion is the task",
    },
    # --- RANDOM_ORDER: Same as overlap tests but order will be shuffled ---
    {
        "category": "RANDOM_ORDER",
        "prompt": "Look up web pages about the best hiking trails in Colorado.",
        "expected_tool": "search_web",
        "rationale": "Generic web search - must not confuse with search_wikipedia or search_local_files",
    },
    {
        "category": "RANDOM_ORDER",
        "prompt": "Send a high-priority notification to my phone saying 'Server is down!'",
        "expected_tool": "send_push_notification",
        "rationale": "Must pick push notification over send_sms, send_email when tool order is random",
    },
    {
        "category": "RANDOM_ORDER",
        "prompt": "How heavy is 180 pounds in kilograms?",
        "expected_tool": "convert_units",
        "rationale": "Weight conversion with tools in random order - must not pick convert_currency",
    },
]


def run_phase2_test(model: str, token: str, log_callback=None) -> dict:
    """
    Run Phase 2 adversarial tests. Returns summary dict with per-category results.
    Tools are shuffled for RANDOM_ORDER tests and presented in a different
    random order for each test case.
    """
    def log(msg):
        if log_callback:
            log_callback(msg)

    all_schemas = [build_tool_schema(t) for t in PHASE2_TOOLS]
    rng = random.Random(99)

    categories = ["SEMANTIC_OVERLAP", "INDIRECT_PROMPT", "DECOY_TOOL", "RANDOM_ORDER"]
    category_results = {c: {"correct": 0, "total": 0, "failures": []} for c in categories}

    log(f"\n{'='*60}")
    log("PHASE 2: Adversarial Tool Recall Test")
    log(f"{'='*60}")
    log(f"Tools in pool: {len(PHASE2_TOOLS)} (with semantic overlaps & decoys)")
    log(f"Test cases: {len(PHASE2_TEST_CASES)}\n")

    for i, tc in enumerate(PHASE2_TEST_CASES, 1):
        cat = tc["category"]
        prompt = tc["prompt"]
        expected = tc["expected_tool"]

        # For RANDOM_ORDER tests, shuffle the schema list
        if cat == "RANDOM_ORDER":
            schemas = list(all_schemas)
            rng.shuffle(schemas)
        else:
            schemas = all_schemas

        start = time.perf_counter()
        try:
            response = github_models_chat(
                model, [{"role": "user", "content": prompt}], schemas, token
            )
            elapsed = round(time.perf_counter() - start, 3)

            choices = response.get("choices", [])
            called_name = None
            if choices:
                message = choices[0].get("message", {})
                tool_calls = message.get("tool_calls", [])
                if tool_calls:
                    called_name = tool_calls[0].get("function", {}).get("name", "")

            correct = called_name == expected
        except Exception as e:
            elapsed = round(time.perf_counter() - start, 3)
            called_name = None
            correct = False

        category_results[cat]["total"] += 1
        if correct:
            category_results[cat]["correct"] += 1
            log(f"  [{cat}] PASS: '{expected}' ({elapsed}s)")
        else:
            category_results[cat]["failures"].append({
                "prompt": prompt[:60] + "..." if len(prompt) > 60 else prompt,
                "expected": expected,
                "called": called_name or "none/no-tool-call",
                "rationale": tc["rationale"],
            })
            log(f"  [{cat}] FAIL: expected '{expected}', got '{called_name or 'none'}' ({elapsed}s)")
            log(f"         Rationale: {tc['rationale']}")

        time.sleep(0.5)

    # Summary
    log(f"\n{'='*60}")
    log("PHASE 2 SUMMARY")
    log(f"{'='*60}")
    total_correct = 0
    total_tests = 0
    for cat in categories:
        cr = category_results[cat]
        total_correct += cr["correct"]
        total_tests += cr["total"]
        pct = cr["correct"] / cr["total"] * 100 if cr["total"] > 0 else 0
        status = "PASS" if pct == 100 else "DEGRADED" if pct >= 70 else "FAIL"
        log(f"  {cat:<20} {cr['correct']}/{cr['total']} ({pct:.0f}%) [{status}]")
        if cr["failures"]:
            for f in cr["failures"]:
                log(f"    - Expected '{f['expected']}', got '{f['called']}'")
                log(f"      Prompt: {f['prompt']}")

    overall_pct = total_correct / total_tests * 100 if total_tests > 0 else 0
    log(f"\n  OVERALL: {total_correct}/{total_tests} ({overall_pct:.0f}%)")

    return category_results


# --- Updated CLI to run both phases ---


def main_cli():
    log_path = _get_log_path()
    log_lines = []

    def log_and_print(msg):
        print(msg)
        log_lines.append(msg)

    log_and_print("Tool Recall Capacity Test (GitHub Copilot / GitHub Models)")
    log_and_print(f"Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    log_and_print(f"Pool: {len(TOOL_POOL)} tools (Phase 1), {len(PHASE2_TOOLS)} tools (Phase 2)\n")

    token = get_token()
    if not token:
        log_and_print("ERROR: No GitHub token found.")
        log_and_print("Run: gh auth login && gh auth refresh -s copilot")
        log_and_print("Or set GITHUB_TOKEN env var with a copilot-scoped token.")
        _write_log(log_path, log_lines)
        return

    # Parse model from args
    model = AVAILABLE_MODELS[0]  # default claude-opus-4.6
    skip_phase1 = "--phase2" in sys.argv
    skip_phase2 = "--phase1" in sys.argv
    for i, arg in enumerate(sys.argv):
        if arg == "--model" and i + 1 < len(sys.argv):
            model = sys.argv[i + 1]

    log_and_print("Verifying connection...")
    if not verify_connection(token):
        log_and_print("ERROR: Cannot authenticate. Check your GITHUB_TOKEN.")
        _write_log(log_path, log_lines)
        return

    log_and_print(f"Connected. Model: {model}\n")

    if not skip_phase1:
        results = run_capacity_test(model, token, log_callback=log_and_print)

        log_and_print(f"\n{'='*50}")
        log_and_print("PHASE 1 SUMMARY")
        log_and_print(f"{'='*50}")
        log_and_print(f"{'Tools':<8} {'Accuracy':<10} {'Chart'}")
        for r in results:
            bar = "#" * int(r["accuracy"] * 30) + "." * (30 - int(r["accuracy"] * 30))
            log_and_print(f"{r['tool_count']:<8} {r['accuracy']:<10.0%} [{bar}]")

        any_failures = False
        for r in results:
            failures = [d for d in r["details"] if not d["correct"]]
            if failures:
                if not any_failures:
                    log_and_print("\nDetailed Failures:")
                    any_failures = True
                log_and_print(f"  At {r['tool_count']} tools:")
                for f in failures:
                    log_and_print(
                        f"    - expected '{f.get('expected', '?')}', "
                        f"got '{f.get('called', 'none')}' "
                        f"(error: {f.get('error', '-')})"
                    )

    if not skip_phase2:
        run_phase2_test(model, token, log_callback=log_and_print)

    log_and_print(f"\nLog saved to: {log_path}")
    _write_log(log_path, log_lines)


if __name__ == "__main__":
    if "--cli" in sys.argv:
        main_cli()
    else:
        app = ToolRecallCopilotGUI()
        app.run()
