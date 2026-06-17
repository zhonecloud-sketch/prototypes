# Console display only uses standard ASCII characters
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

import asyncio
import json
import logging
import os
import re
import subprocess
import sys
import tempfile
import threading
from datetime import datetime
import warnings
import numpy as np
import sounddevice as sd
import aiohttp
from faster_whisper import WhisperModel

# Suppress warnings to keep terminal clean
warnings.filterwarnings("ignore", category=UserWarning)
logging.getLogger("faster_whisper").setLevel(logging.ERROR)

# Debug log file (timestamped per session)
DEBUG_LOG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "debug_logs")
os.makedirs(DEBUG_LOG_DIR, exist_ok=True)
DEBUG_LOG_FILE = os.path.join(DEBUG_LOG_DIR, f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")


def debug_log(message):
    """Append a timestamped message to the session debug log."""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
    entry = f"[{timestamp}] {message}\n"
    with open(DEBUG_LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(entry)


debug_log(f"Session started. Platform={sys.platform}, Python={sys.version}")

# =============================================================================
# Configuration
# =============================================================================
LM_STUDIO_HTTP_URL = "http://localhost:1234/v1/chat/completions"
LM_STUDIO_MODEL = "gemma-4-12b-it-qat-q4_0"

TARGET_SAMPLE_RATE = 16000
CHANNELS = 1

# VAD (Voice Activity Detection) configuration
SILENCE_DURATION = 1.3         # Seconds of silence before phrase is considered complete
THRESHOLD_MULTIPLIER = 3.0     # Threshold = ambient_floor * this value (must exceed noise/ambient ratio ~1.7x)
THRESHOLD_MINIMUM = 0.0003     # Absolute minimum threshold floor (lowered for quiet mics)
THRESHOLD_MAXIMUM = 0.15       # Absolute maximum threshold cap (prevents noisy env from blocking detection)
LOW_MIC_WARNING_LEVEL = 0.005  # Warn user if ambient signal below this (after gain)
HIGH_NOISE_WARNING_LEVEL = 0.1 # Warn user if ambient is too noisy

# Calibration
CALIBRATION_ITERATIONS = 5     # Number of 100ms windows to sample
CALIBRATION_SLEEP_SEC = 0.1    # Sleep between calibration samples

# Audio processing
MIC_GAIN = 1.0                 # Software gain multiplier (adjusted by auto-gain at calibration)
AUDIO_BUFFER_MAX_SILENT = 20   # Max silent chunks kept before speech starts
ENERGY_HISTORY_LENGTH = 3      # Rolling energy window for smoothing
AUTO_GAIN_TARGET = 0.01        # Target ambient level for auto-gain (if signal is below this, gain is boosted)
AUTO_GAIN_MAX = 10.0           # Maximum auto-gain multiplier

# Interruption detection
INTERRUPTION_THRESHOLD_MULTIPLIER = 3.5  # Speech must exceed threshold * this to interrupt
INTERRUPTION_CHECK_INTERVAL = 0.02       # How often to poll audio queue during blocking ops
INTERRUPTION_CONFIRM_COUNT = 15          # Consecutive callback chunks with speech to confirm (at ~100Hz = 150ms)
INTERRUPTION_GRACE_SEC = 1.0             # Seconds to ignore interruption after entering processing state
POST_TTS_COOLDOWN_SEC = 0.8              # Seconds to ignore audio after TTS finishes (prevents echo pickup)

# Whisper STT
WHISPER_BEAM_SIZE = 5
WHISPER_TIMEOUT_SEC = 15       # Maximum seconds allowed for Whisper transcription
MIN_TRANSCRIPTION_LENGTH = 2   # Minimum characters to accept transcription

# LLM generation parameters
LLM_TEMPERATURE = 1.0
LLM_TOP_P = 0.95
LLM_TOP_K = 64
CONVERSATION_HISTORY_LIMIT = 20  # Max turns kept (+ system prompt)

# Global state
CURRENT_LANGUAGE_FLAG = "english"
CURRENT_SPEECH_PROCESS = None
THINKING_ENABLED = "--think" in sys.argv


# =============================================================================
# Audio Device Detection
# =============================================================================
def get_active_input_device():
    """Detect the active Windows input device via WASAPI host API.
    Returns (device_index, native_sample_rate).
    Falls back to sounddevice default if WASAPI is unavailable."""
    if sys.platform == 'win32':
        try:
            for api in sd.query_hostapis():
                if 'WASAPI' in api['name']:
                    device_idx = api['default_input_device']
                    if device_idx >= 0:
                        device_info = sd.query_devices(device_idx)
                        native_rate = int(device_info['default_samplerate'])
                        debug_log(f"WASAPI default input: [{device_idx}] {device_info['name']} @ {native_rate}Hz")
                        print(f"[MIC] Using WASAPI device: [{device_idx}] {device_info['name']} @ {native_rate}Hz")
                        return device_idx, native_rate
        except Exception as e:
            debug_log(f"WASAPI detection failed: {e}")
    # Fallback: let sounddevice pick the default
    default_idx = sd.default.device[0]
    device_info = sd.query_devices(default_idx)
    native_rate = int(device_info['default_samplerate'])
    debug_log(f"Using default input device: [{default_idx}] {device_info['name']} @ {native_rate}Hz")
    print(f"[MIC] Using default device: [{default_idx}] {device_info['name']} @ {native_rate}Hz")
    return default_idx, native_rate


INPUT_DEVICE, DEVICE_SAMPLE_RATE = get_active_input_device()


def resample_chunk(chunk, orig_rate, target_rate):
    """Resample audio chunk from orig_rate to target_rate using linear interpolation."""
    if orig_rate == target_rate:
        return chunk
    ratio = target_rate / orig_rate
    n_samples = int(len(chunk) * ratio)
    indices = np.linspace(0, len(chunk) - 1, n_samples)
    return np.interp(indices, np.arange(len(chunk)), chunk.flatten()).astype(np.float32)


# =============================================================================
# Faster-Whisper (small) for STT
# =============================================================================
FASTER_WHISPER_LOCAL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "whisper-small")

print("[*] Loading Faster-Whisper (small) for local speech-to-text...")
debug_log("Loading Whisper model...")
if os.path.isdir(FASTER_WHISPER_LOCAL_DIR) and os.path.isfile(os.path.join(FASTER_WHISPER_LOCAL_DIR, "model.bin")):
    whisper_model = WhisperModel(FASTER_WHISPER_LOCAL_DIR, device="cpu", compute_type="int8")
    print(f"[OK] Faster-Whisper loaded from local: {FASTER_WHISPER_LOCAL_DIR}")
    debug_log(f"Whisper loaded from local: {FASTER_WHISPER_LOCAL_DIR}")
else:
    whisper_model = WhisperModel("small", device="cpu", compute_type="int8")
    print("[OK] Faster-Whisper (small) loaded from HuggingFace cache.")
    debug_log("Whisper loaded from HuggingFace cache")


# =============================================================================
# Utility Functions
# =============================================================================
def contains_chinese(text):
    return bool(re.search(r'[\u4e00-\u9fff]', text))


def detect_response_language(text):
    if contains_chinese(text):
        return "chinese"
    malay_markers = ["saya", "anda", "tidak", "dengan", "untuk", "yang", "ini", "itu"]
    words = text.lower().split()
    if sum(1 for w in words if w in malay_markers) >= 2:
        return "bahasa malaysia"
    return "english"


async def check_language_change_request(user_text, http_session):
    """Use LLM to detect if user wants to switch language. Returns language string or None."""
    prompt = (
        "Determine if the user wants to switch the conversation language. "
        "Consider misspellings and indirect phrasing (e.g. 'kembali ke Bahasa Malaysia', "
        "'stick in Mandarin' meaning 'switch to Mandarin', 'cakap Melayu'). "
        "If yes, reply with EXACTLY one of: english | bahasa malaysia | chinese\n"
        "If no, reply with EXACTLY: none\n"
        f"User said: \"{user_text}\""
    )
    try:
        payload = {
            "model": LM_STUDIO_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "stream": False,
            "temperature": 0.0,
            "max_tokens": 10,
        }
        async with http_session.post(LM_STUDIO_HTTP_URL, json=payload) as resp:
            data = await resp.json()
            answer = data["choices"][0]["message"]["content"].strip().lower()
            debug_log(f"Language intent check: '{user_text}' -> '{answer}'")
            if "bahasa" in answer or "malaysia" in answer or "malay" in answer:
                return "bahasa malaysia"
            if "chinese" in answer or "mandarin" in answer:
                return "chinese"
            if "english" in answer:
                return "english"
    except Exception as e:
        debug_log(f"Language intent check failed: {e}")
    return None


# =============================================================================
# TTS (Text-to-Speech) - runs in thread executor, interruptible via kill
# =============================================================================
async def speak_out_loud(text, language=None):
    """Cross-platform TTS. Runs subprocess in executor (SelectorEventLoop compatible)."""
    global CURRENT_SPEECH_PROCESS
    clean_text = text.replace("*", "").replace('"', '').replace("`", "").strip()
    if not clean_text:
        return

    detected_lang = language if language else detect_response_language(clean_text)
    loop = asyncio.get_running_loop()

    if sys.platform == "darwin":
        voice = "Samantha"
        if detected_lang == "chinese":
            voice = "Tingting"
        elif detected_lang == "bahasa malaysia":
            voice = "Amira"

        def _run_say():
            global CURRENT_SPEECH_PROCESS
            proc = subprocess.Popen(
                ["say", "-v", voice, clean_text],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )
            CURRENT_SPEECH_PROCESS = proc
            proc.wait()
            CURRENT_SPEECH_PROCESS = None

        await loop.run_in_executor(None, _run_say)

    elif sys.platform == "win32":
        clean_text_escaped = clean_text.replace("'", "''")
        lang_code = "en-US"
        if detected_lang == "chinese":
            lang_code = "zh-CN"
        elif detected_lang == "bahasa malaysia":
            lang_code = "ms-MY"

        debug_log(f"TTS request: lang={detected_lang}, lang_code={lang_code}, text={clean_text[:80]}")

        # Build list of fallback language codes for voice matching
        # Chinese: try zh-CN, zh-TW, zh-HK; Malay: try ms-MY, ms-BN
        fallback_codes = [lang_code]
        if detected_lang == "chinese":
            fallback_codes = ["zh-CN", "zh-TW", "zh-HK", "zh-SG"]
        elif detected_lang == "bahasa malaysia":
            fallback_codes = ["ms-MY", "ms-BN"]

        # PowerShell: build OR condition for voice matching
        voice_filter_parts = []
        for code in fallback_codes:
            prefix = code.split('-')[0]
            voice_filter_parts.append(f"$_.Language -eq '{code}' -or $_.Language -like '{prefix}-*'")
        voice_filter_expr = " -or ".join(voice_filter_parts)

        ps_script = f"""
$ErrorActionPreference = 'Stop'
$logFile = '{DEBUG_LOG_FILE.replace(chr(92), "/")}'
function Log($msg) {{ Add-Content -Path $logFile -Value "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss.fff')] [PS] $msg" }}
try {{
    Log "Starting WinRT TTS: lang={lang_code}, fallbacks={','.join(fallback_codes)}"
    Add-Type -AssemblyName System.Runtime.WindowsRuntime
    [void][Windows.Media.SpeechSynthesis.SpeechSynthesizer,Windows.Media.SpeechSynthesis,ContentType=WindowsRuntime]
    [void][Windows.Storage.Streams.DataReader,Windows.Storage.Streams,ContentType=WindowsRuntime]
    $asTaskMethods = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {{ $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' }}
    $synth = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::new()
    $allVoices = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices
    Log "Available voices: $(($allVoices | ForEach-Object {{ "$($_.DisplayName)($($_.Language))" }}) -join ', ')"
    $target = $allVoices | Where-Object {{ {voice_filter_expr} }} | Select-Object -First 1
    if ($target) {{
        $synth.Voice = $target
        Log "Selected voice: $($target.DisplayName) ($($target.Language))"
    }} else {{
        Log "WARNING: No voice found for {lang_code} (fallbacks: {','.join(fallback_codes)}). Using default voice."
    }}
    $synthOp = $synth.SynthesizeTextToStreamAsync('{clean_text_escaped}')
    $synthTask = $asTaskMethods[0].MakeGenericMethod([Windows.Media.SpeechSynthesis.SpeechSynthesisStream]).Invoke($null, @($synthOp))
    $synthTask.Wait()
    $stream = $synthTask.Result
    if ($stream.Size -eq 0) {{
        Log "WARNING: Synthesized stream is empty (0 bytes). Voice may not support this text."
    }} else {{
        $reader = [Windows.Storage.Streams.DataReader]::new($stream.GetInputStreamAt(0))
        $loadOp = $reader.LoadAsync([uint32]$stream.Size)
        $loadTask = $asTaskMethods[0].MakeGenericMethod([uint32]).Invoke($null, @($loadOp))
        $loadTask.Wait()
        $bytes = New-Object byte[] ([int]$stream.Size)
        $reader.ReadBytes($bytes)
        $tmp = [IO.Path]::Combine($env:TEMP, 'tts_' + (Get-Random) + '.wav')
        [IO.File]::WriteAllBytes($tmp, $bytes)
        Log "Playing WAV: $tmp (size=$([int]$stream.Size) bytes)"
        (New-Object Media.SoundPlayer $tmp).PlaySync()
        Remove-Item $tmp -Force
        Log "TTS completed successfully (WinRT)"
    }}
}} catch {{
    Log "WinRT FAILED: $($_.Exception.Message)"
    try {{
        Add-Type -AssemblyName System.Speech
        $s = New-Object System.Speech.Synthesis.SpeechSynthesizer
        $voices = $s.GetInstalledVoices() | Where-Object {{ $_.Enabled }}
        Log "SAPI5 voices: $(($voices | ForEach-Object {{ $_.VoiceInfo.Name }}) -join ', ')"
        $langPrefix = '{lang_code.split("-")[0]}'
        $matchedVoice = $voices | Where-Object {{ $_.VoiceInfo.Culture.TwoLetterISOLanguageName -eq $langPrefix }} | Select-Object -First 1
        if ($matchedVoice) {{
            $s.SelectVoice($matchedVoice.VoiceInfo.Name)
            Log "SAPI5 selected: $($matchedVoice.VoiceInfo.Name)"
        }} else {{
            Log "SAPI5 WARNING: No voice for '$langPrefix', using default"
        }}
        $s.Speak('{clean_text_escaped}')
        Log "TTS completed (System.Speech fallback)"
    }} catch {{
        Log "FALLBACK ALSO FAILED: $($_.Exception.Message)"
    }}
}}
"""

        script_path = os.path.join(tempfile.gettempdir(), f"tts_{os.getpid()}.ps1")
        with open(script_path, 'w', encoding='utf-8-sig') as f:
            f.write(ps_script)

        def _run_powershell():
            global CURRENT_SPEECH_PROCESS
            proc = subprocess.Popen(
                ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", script_path],
                stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            CURRENT_SPEECH_PROCESS = proc
            proc.wait()
            CURRENT_SPEECH_PROCESS = None
            try:
                os.unlink(script_path)
            except OSError:
                pass

        await loop.run_in_executor(None, _run_powershell)

    else:
        print(f"[TTS not supported on {sys.platform}]")


def kill_tts():
    """Kill any running TTS process immediately."""
    global CURRENT_SPEECH_PROCESS
    if CURRENT_SPEECH_PROCESS:
        try:
            CURRENT_SPEECH_PROCESS.kill()
        except Exception:
            pass
        CURRENT_SPEECH_PROCESS = None


# =============================================================================
# Core Dialogue State Machine
#
# Interruption architecture:
#   The sounddevice callback runs in its own thread and fires for every audio
#   chunk (~every 10-20ms). When NOT in LISTENING state, the callback checks
#   volume and sets a threading.Event instantly when user speech is detected.
#   This gives zero-latency interruption regardless of what the main async
#   loop is doing (waiting on LLM tokens, Whisper, TTS subprocess, etc.).
#
# Process flow:
#   1. Audio capture runs continuously (sounddevice callback -> audio_queue)
#   2. LISTENING state: process chunks for VAD, record user speech
#   3. End of speech -> PROCESSING states (transcribe/LLM/TTS)
#   4. During processing: callback thread monitors for interruption
#   5. Interruption detected -> event set -> main loop breaks out immediately
# =============================================================================

def drain_queue(audio_queue):
    """Drain all pending chunks from audio queue without processing."""
    while not audio_queue.empty():
        try:
            audio_queue.get_nowait()
        except asyncio.QueueEmpty:
            break


async def run_dialogue():
    global CURRENT_LANGUAGE_FLAG, MIC_GAIN

    print("=" * 60)
    print("[*] Gemma 4 12B Voice Assistant (GGUF via LM Studio)")
    print("    Model: gemma-4-12b-it-qat-q4_0.gguf + mmproj")
    print("    STT:   Faster-Whisper small (local, CTranslate2)")
    print(f"    Thinking: {'ENABLED' if THINKING_ENABLED else 'DISABLED'}")
    print("    Please keep quiet. Calibrating microphone acoustics...")
    print("=" * 60)

    loop = asyncio.get_running_loop()
    audio_queue = asyncio.Queue()

    # Interruption detection via callback thread
    interruption_event = threading.Event()
    listening_mode = threading.Event()
    listening_mode.set()  # Start in listening mode (no interruption monitoring)
    interrupt_confirm = [0]  # Mutable counter for callback thread
    threshold_ref = [0.02]   # Mutable threshold for callback (updated after calibration)

    def audio_callback(indata, frames, time, status):
        loop.call_soon_threadsafe(audio_queue.put_nowait, indata.copy())
        # When not in listening mode, monitor for user speech to trigger interruption
        if not listening_mode.is_set():
            chunk = indata.flatten() * MIC_GAIN
            vol = np.linalg.norm(chunk) / np.sqrt(len(chunk))
            interrupt_thresh = threshold_ref[0] * INTERRUPTION_THRESHOLD_MULTIPLIER
            if vol > interrupt_thresh:
                interrupt_confirm[0] += 1
                if interrupt_confirm[0] >= INTERRUPTION_CONFIRM_COUNT:
                    interruption_event.set()
                    debug_log(f"INTERRUPT FIRED: vol={vol:.5f}, thresh={interrupt_thresh:.5f}, confirm={interrupt_confirm[0]}")
            else:
                if interrupt_confirm[0] > 0:
                    debug_log(f"INTERRUPT RESET: vol={vol:.5f} < thresh={interrupt_thresh:.5f}, was_at={interrupt_confirm[0]}")
                interrupt_confirm[0] = 0

    stream = sd.InputStream(
        device=INPUT_DEVICE,
        samplerate=DEVICE_SAMPLE_RATE,
        channels=CHANNELS,
        dtype='float32',
        callback=audio_callback
    )

    with stream:
        # --- CALIBRATION ---
        calibration_buffer = []
        for _ in range(CALIBRATION_ITERATIONS):
            await asyncio.sleep(CALIBRATION_SLEEP_SEC)
            while not audio_queue.empty():
                raw = audio_queue.get_nowait()
                chunk = resample_chunk(raw, DEVICE_SAMPLE_RATE, TARGET_SAMPLE_RATE) * MIC_GAIN
                calibration_buffer.append(np.linalg.norm(chunk) / np.sqrt(len(chunk)))

        ambient_floor = np.mean(calibration_buffer) if calibration_buffer else 0.02

        # Auto-gain: if mic signal is very low, boost gain so VAD can work
        if ambient_floor < AUTO_GAIN_TARGET and ambient_floor > 0:
            computed_gain = AUTO_GAIN_TARGET / ambient_floor
            MIC_GAIN = min(computed_gain, AUTO_GAIN_MAX)
            ambient_floor *= MIC_GAIN  # Adjust ambient to reflect new gain
            print(f"[AUTO-GAIN] Mic signal low. Applying software gain: {MIC_GAIN:.1f}x")
            debug_log(f"Auto-gain applied: {MIC_GAIN:.1f}x (raw ambient was {ambient_floor/MIC_GAIN:.6f})")

        threshold = min(max(ambient_floor * THRESHOLD_MULTIPLIER, THRESHOLD_MINIMUM), THRESHOLD_MAXIMUM)
        threshold_ref[0] = threshold  # Update callback's threshold reference
        print(f"[OK] Calibration done. Ambient={ambient_floor:.5f}, Threshold={threshold:.5f}, Gain={MIC_GAIN:.1f}x")
        debug_log(f"Calibration done. Ambient={ambient_floor:.5f}, Threshold={threshold:.5f}, Gain={MIC_GAIN:.1f}x, samples={len(calibration_buffer)}")

        if ambient_floor < LOW_MIC_WARNING_LEVEL:
            print("[WARNING] Mic signal still low after gain. Check microphone settings.")
            debug_log(f"WARNING: Low mic signal even after gain. Ambient={ambient_floor:.5f}")
        elif ambient_floor > HIGH_NOISE_WARNING_LEVEL:
            print(f"[WARNING] High ambient noise ({ambient_floor:.3f}). Reduce mic gain or background noise.")
            debug_log(f"WARNING: High ambient noise. Ambient={ambient_floor:.5f}")

        print("\n[MIC] Systems Ready. Start speaking...")
        debug_log("Entering dialogue loop")

        conversation_history = []

        # --- MAIN DIALOGUE LOOP ---
        async with aiohttp.ClientSession() as http_session:
            while True:
                # =============================================================
                # STATE: LISTENING - record user speech via VAD
                # =============================================================
                audio_buffer = []
                silent_chunks = 0
                recording_started = False
                energy_history = []

                while True:
                    raw = await audio_queue.get()
                    chunk = resample_chunk(raw, DEVICE_SAMPLE_RATE, TARGET_SAMPLE_RATE) * MIC_GAIN
                    volume_norm = np.linalg.norm(chunk) / np.sqrt(len(chunk))

                    energy_history.append(volume_norm)
                    if len(energy_history) > ENERGY_HISTORY_LENGTH:
                        energy_history.pop(0)
                    smoothed = np.mean(energy_history)

                    audio_buffer.append(chunk)

                    if smoothed > threshold:
                        if not recording_started:
                            print("[*] Speech detected... recording...")
                            debug_log(f"Speech detected: smoothed={smoothed:.5f} > threshold={threshold:.5f}")
                            recording_started = True
                        silent_chunks = 0
                    elif recording_started:
                        silent_chunks += len(chunk) / TARGET_SAMPLE_RATE
                        if silent_chunks >= SILENCE_DURATION:
                            debug_log("End of speech detected")
                            break
                    else:
                        # Not recording yet, limit buffer size
                        if len(audio_buffer) > AUDIO_BUFFER_MAX_SILENT:
                            audio_buffer.pop(0)

                # End of speech reached
                print("[PAUSE] End of speech. Processing...")

                # =============================================================
                # STATE: TRANSCRIBING - Whisper STT (audio processing blocked)
                # Uses vad_filter to skip silence and timeout to prevent hangs
                # =============================================================
                full_audio = np.concatenate(audio_buffer, axis=0).flatten().astype(np.float32)
                audio_duration = len(full_audio) / TARGET_SAMPLE_RATE
                debug_log(f"Transcribing: {len(full_audio)} samples ({audio_duration:.1f}s)")

                # Activate interruption monitoring (with grace period to ignore trailing speech)
                interruption_event.clear()
                interrupt_confirm[0] = 0
                await asyncio.sleep(INTERRUPTION_GRACE_SEC)
                drain_queue(audio_queue)  # Discard audio from grace period
                listening_mode.clear()

                # Run Whisper in executor with vad_filter to prevent hangs on noise
                transcription_future = loop.run_in_executor(
                    None, lambda: whisper_model.transcribe(
                        full_audio,
                        beam_size=WHISPER_BEAM_SIZE,
                        vad_filter=True,
                        vad_parameters={"min_silence_duration_ms": 500}
                    )
                )

                elapsed = 0.0
                timed_out = False
                while not transcription_future.done():
                    await asyncio.sleep(INTERRUPTION_CHECK_INTERVAL)
                    elapsed += INTERRUPTION_CHECK_INTERVAL
                    if elapsed >= WHISPER_TIMEOUT_SEC:
                        timed_out = True
                        debug_log(f"Whisper timeout after {WHISPER_TIMEOUT_SEC}s. Discarding.")
                        break
                    if interruption_event.is_set():
                        break

                # Return to listening mode
                listening_mode.set()

                if timed_out:
                    print("[--] Transcription timed out (likely noise). Resuming listening...")
                    drain_queue(audio_queue)
                    continue

                if interruption_event.is_set():
                    print("[!] Interrupted during transcription. Resuming listening...")
                    debug_log("User interrupted during transcription")
                    drain_queue(audio_queue)
                    continue

                segments, _ = await transcription_future
                user_text = "".join(seg.text for seg in segments).strip()
                debug_log(f"Transcription result: '{user_text[:80]}'")

                if not user_text or len(user_text) < MIN_TRANSCRIPTION_LENGTH:
                    peak_vol = np.max(np.abs(full_audio))
                    rms_vol = np.linalg.norm(full_audio) / np.sqrt(len(full_audio))
                    debug_log(f"EMPTY TRANSCRIPTION: duration={audio_duration:.1f}s, peak={peak_vol:.5f}, rms={rms_vol:.5f} (likely noise, not speech)")
                    print("[--] Could not resolve speech. Resuming listening...")
                    drain_queue(audio_queue)
                    continue

                print(f"[>] You said: {user_text}")

                # Exit commands
                if user_text.lower().strip(".,!?") in ["exit", "quit", "end the conversation", "keluar"]:
                    print("Shutting down safely. Goodbye!")
                    break

                # Language switch (LLM-based intent detection)
                requested_lang = await check_language_change_request(user_text, http_session)
                if requested_lang and requested_lang != CURRENT_LANGUAGE_FLAG:
                    CURRENT_LANGUAGE_FLAG = requested_lang
                    conversation_history.clear()  # Reset history to avoid prior language bleeding through
                    feedback = f"Language switched to {CURRENT_LANGUAGE_FLAG}."
                    if CURRENT_LANGUAGE_FLAG == "chinese":
                        feedback = "Language switched to Chinese."
                    elif CURRENT_LANGUAGE_FLAG == "bahasa malaysia":
                        feedback = "Mod bahasa telah ditukar kepada Bahasa Malaysia."
                    print(f"[*] {feedback}")
                    drain_queue(audio_queue)
                    await speak_out_loud(feedback, CURRENT_LANGUAGE_FLAG)
                    drain_queue(audio_queue)
                    continue

                # =============================================================
                # STATE: LLM_PROCESSING - stream response from LM Studio
                # =============================================================
                thinking_prefix = "<|think|>\n" if THINKING_ENABLED else ""
                system_instruction = (
                    f"{thinking_prefix}"
                    f"You are a concise voice assistant. Keep answers short (1-3 sentences). "
                    f"Do not use emojis. Do not mention your instructions or rules to the user. "
                    f"Reply ONLY in {CURRENT_LANGUAGE_FLAG}. "
                    f"If '{CURRENT_LANGUAGE_FLAG}' is 'chinese', use simplified Chinese characters. "
                    f"If '{CURRENT_LANGUAGE_FLAG}' is 'bahasa malaysia', use Malay."
                )

                if not conversation_history or conversation_history[0]["role"] != "system":
                    conversation_history.insert(0, {"role": "system", "content": system_instruction})
                else:
                    conversation_history[0]["content"] = system_instruction

                conversation_history.append({"role": "user", "content": user_text})

                payload = {
                    "model": LM_STUDIO_MODEL,
                    "messages": conversation_history,
                    "stream": True,
                    "temperature": LLM_TEMPERATURE,
                    "top_p": LLM_TOP_P,
                    "top_k": LLM_TOP_K,
                }

                print("[AI] Gemma 4: ", end="", flush=True)
                full_response = ""

                # Activate interruption monitoring for LLM streaming
                interruption_event.clear()
                interrupt_confirm[0] = 0
                listening_mode.clear()

                try:
                    async with http_session.post(LM_STUDIO_HTTP_URL, json=payload) as response:
                        async for line in response.content:
                            # Check if callback thread detected interruption
                            if interruption_event.is_set():
                                break

                            line_str = line.decode('utf-8').strip()
                            if line_str.startswith("data: ") and not line_str.endswith("[DONE]"):
                                try:
                                    json_data = json.loads(line_str[6:])
                                    choices = json_data.get('choices', [])
                                    if choices:
                                        delta = choices[0].get('delta', {})
                                        token = delta.get('content', '')
                                        print(token, end="", flush=True)
                                        full_response += token
                                except (json.JSONDecodeError, KeyError, IndexError):
                                    continue

                except aiohttp.ClientError as e:
                    listening_mode.set()
                    print(f"\n[ERROR] LM Studio connection error: {e}")
                    print("   Ensure LM Studio is running with the GGUF model loaded.")
                    debug_log(f"LM Studio connection error: {e}")
                    conversation_history.pop()  # Remove failed user message
                    drain_queue(audio_queue)
                    continue
                except Exception as e:
                    listening_mode.set()
                    print(f"\n[ERROR] Pipeline error: {e}")
                    debug_log(f"Pipeline exception: {type(e).__name__}: {e}")
                    conversation_history.pop()
                    drain_queue(audio_queue)
                    continue

                # Return to listening mode after LLM
                listening_mode.set()

                if interruption_event.is_set():
                    print("\n[!] Interrupted during LLM response. Resuming listening...")
                    debug_log("User interrupted during LLM streaming")
                    conversation_history.pop()  # Remove user message (incomplete exchange)
                    drain_queue(audio_queue)
                    continue

                # Strip thinking tags if present
                full_response = re.sub(
                    r'<\|channel>thought\n.*?<channel\|>', '', full_response, flags=re.DOTALL
                ).strip()

                conversation_history.append({"role": "assistant", "content": full_response})
                print("\n" + "-" * 50)
                debug_log(f"LLM response: '{full_response[:100]}'")

                # =============================================================
                # STATE: TTS - speak the response (interruptible)
                # =============================================================
                # Detect actual response language for TTS voice selection
                # but do NOT override CURRENT_LANGUAGE_FLAG (user's explicit choice takes priority)
                tts_lang = detect_response_language(full_response)
                if tts_lang == "english":
                    tts_lang = CURRENT_LANGUAGE_FLAG

                # Run TTS as a task so we can cancel on interruption
                # Activate interruption monitoring for TTS (with grace to avoid echo)
                interruption_event.clear()
                interrupt_confirm[0] = 0
                drain_queue(audio_queue)
                listening_mode.clear()

                tts_task = asyncio.create_task(speak_out_loud(full_response, tts_lang))

                while not tts_task.done():
                    await asyncio.sleep(INTERRUPTION_CHECK_INTERVAL)
                    if interruption_event.is_set():
                        tts_task.cancel()
                        kill_tts()
                        print("\n[!] TTS interrupted by user.")
                        debug_log("User interrupted TTS")
                        break

                # Return to listening mode
                listening_mode.set()

                try:
                    await tts_task
                except asyncio.CancelledError:
                    pass

                # =============================================================
                # Back to LISTENING - drain residual audio from TTS period
                # and apply cooldown to prevent TTS echo triggering speech
                # =============================================================
                drain_queue(audio_queue)
                await asyncio.sleep(POST_TTS_COOLDOWN_SEC)
                drain_queue(audio_queue)

                # Trim history
                if len(conversation_history) > CONVERSATION_HISTORY_LIMIT + 1:
                    conversation_history = [conversation_history[0]] + conversation_history[-CONVERSATION_HISTORY_LIMIT:]

                print("[MIC] Ready! Listening again...")

    print("\nSession ended.")


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    try:
        asyncio.run(run_dialogue())
    except KeyboardInterrupt:
        print("\nSession stopped safely. Goodbye!")
