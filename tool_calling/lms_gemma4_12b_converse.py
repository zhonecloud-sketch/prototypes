import ssl
ssl._create_default_https_context = ssl._create_unverified_context

import argparse
import asyncio
import io
import json
import logging
import platform
import re
import warnings

import numpy as np
import sounddevice as sd
import soundfile as sf
import aiohttp
from faster_whisper import WhisperModel

# Suppress warnings
warnings.filterwarnings("ignore", category=UserWarning)
logging.getLogger("faster_whisper").setLevel(logging.ERROR)

# Parse CLI arguments early
_parser = argparse.ArgumentParser(description="Voice assistant")
_parser.add_argument(
    "--offline", action="store_true", default=False,
    help="Run fully offline (uses piper-tts instead of edge-tts)"
)
ARGS = _parser.parse_args()

# Conditional TTS imports
if ARGS.offline:
    from piper import PiperVoice
else:
    import edge_tts

# Configuration settings
TARGET_SAMPLE_RATE = 16000
CHANNELS = 1
LM_STUDIO_HTTP_URL = "http://localhost:1234/v1/chat/completions"

# Dynamic VAD configuration fallbacks
DYNAMIC_THRESHOLD = 0.03  # Overridden during calibration
SILENCE_DURATION = 1.3

# Edge-TTS voice mapping (online, high quality)
TTS_VOICES_ONLINE = {
    "english": "en-US-AriaNeural",
    "chinese": "zh-CN-XiaoxiaoNeural",
    "bahasa malaysia": "ms-MY-YasminNeural",
}

# Piper-TTS voice mapping (offline, ONNX models)
# Download models from: https://github.com/rhasspy/piper/releases
# Place .onnx + .onnx.json files in ./piper_voices/
PIPER_VOICES_DIR = "piper_voices"
TTS_VOICES_OFFLINE = {
    "english": "en_US-amy-medium.onnx",
    "chinese": "zh_CN-huayan-medium.onnx",
    "bahasa malaysia": "ms_MY-yasmin-medium.onnx",
}

# Preload piper voices if offline
_piper_cache = {}
if ARGS.offline:
    import os
    for lang, model_file in TTS_VOICES_OFFLINE.items():
        model_path = os.path.join(PIPER_VOICES_DIR, model_file)
        if os.path.exists(model_path):
            _piper_cache[lang] = PiperVoice.load(model_path)
            print(f"  Loaded piper voice: {lang}")
        else:
            print(f"  WARNING: Missing piper model: {model_path}")

# Global runtime state
CURRENT_LANGUAGE_FLAG = "english"

# STT model loading — try local folder first, then cache, then download
WHISPER_MODEL_SIZE = "small"
WHISPER_LOCAL_DIR = "whisper-small"
print(f"Loading speech-to-text model (faster-whisper {WHISPER_MODEL_SIZE}, int8)...")
try:
    import os
    if os.path.isdir(WHISPER_LOCAL_DIR):
        whisper_model = WhisperModel(
            WHISPER_LOCAL_DIR, device="cpu", compute_type="int8"
        )
    else:
        raise FileNotFoundError(f"{WHISPER_LOCAL_DIR} not found")
except Exception:
    # Fallback: try HuggingFace cache
    try:
        whisper_model = WhisperModel(
            WHISPER_MODEL_SIZE, device="cpu", compute_type="int8",
            download_root=None, local_files_only=True
        )
    except Exception:
        print("  Model not cached locally. Downloading from HuggingFace...")
        try:
            whisper_model = WhisperModel(
                WHISPER_MODEL_SIZE, device="cpu", compute_type="int8"
            )
        except Exception as e:
            print(f"\nERROR: Failed to load/download whisper model.")
            print(f"  {e}\n")
            print("To fix, place model files in ./whisper-small/ or pre-download:")
            print(f"  huggingface-cli download Systran/faster-whisper-{WHISPER_MODEL_SIZE}")
            raise SystemExit(1)
print("Speech engine loaded.")

def contains_chinese(text):
    """Detects if a string contains Chinese characters."""
    return bool(re.search(r'[\u4e00-\u9fff]', text))


async def speak_out_loud_async(text, stop_event):
    """
    Cross-platform TTS. Online: edge-tts. Offline: piper-tts.
    Plays audio via sounddevice. Interruptible via stop_event.
    """
    global CURRENT_LANGUAGE_FLAG
    clean_text = (text.replace("*", "").replace("`", "")
                  .replace('"', "").strip())
    if not clean_text:
        return

    # Determine language key
    if CURRENT_LANGUAGE_FLAG == "chinese" or contains_chinese(clean_text):
        lang_key = "chinese"
    elif CURRENT_LANGUAGE_FLAG == "bahasa malaysia":
        lang_key = "bahasa malaysia"
    else:
        lang_key = "english"

    try:
        if ARGS.offline:
            await _tts_offline(clean_text, lang_key, stop_event)
        else:
            await _tts_online(clean_text, lang_key, stop_event)
    except asyncio.CancelledError:
        raise
    except Exception as e:
        print(f"TTS error: {e}")


async def _tts_online(text, lang_key, stop_event):
    """Online TTS via edge-tts (Microsoft Neural voices)."""
    voice = TTS_VOICES_ONLINE[lang_key]
    communicate = edge_tts.Communicate(text, voice)
    audio_bytes = b""
    async for chunk in communicate.stream():
        if stop_event.is_set():
            return
        if chunk["type"] == "audio":
            audio_bytes += chunk["data"]

    if not audio_bytes or stop_event.is_set():
        return

    audio_data, sample_rate = sf.read(
        io.BytesIO(audio_bytes), dtype="float32"
    )
    await _play_audio(audio_data, sample_rate, stop_event)


async def _tts_offline(text, lang_key, stop_event):
    """Offline TTS via piper (local ONNX neural voices)."""
    voice = _piper_cache.get(lang_key)
    if not voice:
        # Fallback to english if requested lang model missing
        voice = _piper_cache.get("english")
    if not voice:
        print("No piper voice available. Skipping TTS.")
        return

    loop = asyncio.get_running_loop()
    # Synthesize in executor (piper is synchronous)
    wav_buffer = io.BytesIO()
    await loop.run_in_executor(
        None,
        lambda: voice.synthesize(text, wav_buffer, sentence_silence=0.3)
    )
    wav_buffer.seek(0)

    if stop_event.is_set():
        return

    audio_data, sample_rate = sf.read(wav_buffer, dtype="float32")
    await _play_audio(audio_data, sample_rate, stop_event)


async def _play_audio(audio_data, sample_rate, stop_event):
    """
    Play audio via a dedicated OutputStream (does not use sd.play()
    which can interfere with the mic InputStream on Windows).
    """
    if audio_data.ndim == 1:
        audio_data = audio_data.reshape(-1, 1)

    channels = audio_data.shape[1]
    position = [0]
    playback_done = [False]

    def _audio_out_callback(outdata, frames, time, status):
        start = position[0]
        end = start + frames
        remaining = len(audio_data) - start
        if remaining <= 0:
            outdata[:] = 0
            playback_done[0] = True
            raise sd.CallbackStop()
        if end > len(audio_data):
            outdata[:remaining] = audio_data[start:]
            outdata[remaining:] = 0
            playback_done[0] = True
            raise sd.CallbackStop()
        outdata[:] = audio_data[start:end]
        position[0] = end

    out_stream = sd.OutputStream(
        samplerate=sample_rate,
        channels=channels,
        dtype='float32',
        callback=_audio_out_callback,
    )
    with out_stream:
        while not playback_done[0]:
            if stop_event.is_set():
                return
            await asyncio.sleep(0.05)

async def check_language_change_request(user_text):
    """Detect language switch commands from user speech."""
    text_lower = user_text.lower()
    if any(k in text_lower for k in
           ["bahasa malaysia", "bahasa melayu", "malay", "melayu"]):
        return "bahasa malaysia"
    if any(k in text_lower for k in
           ["mandarin", "chinese", "中文", "华语", "普通话"]):
        return "chinese"
    if any(k in text_lower for k in
           ["english", "speak english", "in english"]):
        return "english"
    return None


async def permanent_mic_listener(
    audio_queue, loop, whisper_task_queue,
    ai_is_processing, interruption_triggered
):
    """
    Background mic listener with interrupt-aware logic.

    Interrupt behavior:
    - During AI processing/TTS, sustained speech triggers interrupt.
    - The interrupt halts AI inference and TTS playback immediately.
    - The audio that triggered the interrupt is KEPT and used as
      the start of a new recording buffer.
    - Recording continues in STATE B until silence is detected,
      then the full phrase (including interrupt audio) is transcribed.
    """
    global DYNAMIC_THRESHOLD
    audio_buffer = []
    silent_chunks = 0
    recording_started = False
    energy_history = []

    while True:
        chunk = await audio_queue.get()
        volume_norm = np.linalg.norm(chunk) / np.sqrt(len(chunk))

        energy_history.append(volume_norm)
        if len(energy_history) > 3:
            energy_history.pop(0)
        smoothed_volume = np.mean(energy_history)

        # STATE A: AI is processing. Detect interrupt from speech.
        # On interrupt: halt AI, keep the triggering audio, and
        # transition directly into recording mode (STATE B).
        if ai_is_processing.is_set():
            # Discard buffered audio from before the interrupt
            audio_buffer = []
            silent_chunks = 0
            recording_started = False

            # Require smoothed volume > 1.5x threshold for interrupt
            if smoothed_volume > (DYNAMIC_THRESHOLD * 1.5):
                print("\n[INTERRUPT] Speech detected, halting AI...")
                interruption_triggered.set()
                ai_is_processing.clear()
                # DO NOT flush audio queue - keep incoming speech
                # Start recording with the chunk that triggered it
                audio_buffer = [chunk]
                recording_started = True
                silent_chunks = 0
                print("Recording speech...")
            continue

        # STATE B: AI idle. Standard phrase recording.
        audio_buffer.append(chunk)

        if smoothed_volume > DYNAMIC_THRESHOLD:
            if not recording_started:
                print("Recording speech...")
                recording_started = True
            silent_chunks = 0
        elif recording_started:
            silent_chunks += len(chunk) / TARGET_SAMPLE_RATE
            if silent_chunks >= SILENCE_DURATION:
                print("Processing transcript...")
                ai_is_processing.set()

                full_audio = np.concatenate(
                    audio_buffer, axis=0
                ).flatten().astype(np.float32)

                # faster-whisper transcription (consume generator
                # inside executor since it's lazy)
                def _transcribe():
                    segs, _ = whisper_model.transcribe(
                        full_audio, beam_size=5, language=None
                    )
                    return " ".join(s.text for s in segs).strip()

                user_text = await loop.run_in_executor(
                    None, _transcribe
                )

                if interruption_triggered.is_set():
                    audio_buffer = []
                    continue

                if user_text and len(user_text) >= 2:
                    await whisper_task_queue.put(user_text)
                else:
                    print("Unresolvable audio dropped. Listening...")
                    ai_is_processing.clear()

                audio_buffer = []
                recording_started = False
        else:
            if len(audio_buffer) > 20:
                audio_buffer.pop(0)
async def stream_voice_to_gemma():
    global CURRENT_LANGUAGE_FLAG, DYNAMIC_THRESHOLD
    tts_mode = "piper-tts (offline)" if ARGS.offline else "edge-tts (online)"
    print("=" * 60)
    print("Full-Duplex Local Voice Assistant")
    print(f"Platform: {platform.system()} | TTS: {tts_mode} | STT: faster-whisper")
    print("Keep quiet. Calibrating microphone...")
    print("=" * 60)

    loop = asyncio.get_running_loop()
    audio_queue = asyncio.Queue()
    whisper_task_queue = asyncio.Queue()

    ai_is_processing = asyncio.Event()
    interruption_triggered = asyncio.Event()

    conversation_history = []

    def audio_callback(indata, frames, time, status):
        loop.call_soon_threadsafe(audio_queue.put_nowait, indata.copy())

    stream = sd.InputStream(
        samplerate=TARGET_SAMPLE_RATE, channels=CHANNELS,
        dtype='float32', callback=audio_callback
    )

    with stream:
        # Dynamic calibration: read ambient noise for 500ms
        calibration_buffer = []
        for _ in range(5):
            await asyncio.sleep(0.1)
            while not audio_queue.empty():
                chunk = audio_queue.get_nowait()
                calibration_buffer.append(
                    np.linalg.norm(chunk) / np.sqrt(len(chunk))
                )

        ambient_floor = (np.mean(calibration_buffer)
                         if calibration_buffer else 0.02)
        DYNAMIC_THRESHOLD = max(ambient_floor + 0.015, 0.025)
        print(f"Calibration done. Noise floor: {DYNAMIC_THRESHOLD:.4f}")

        # Start background mic listener
        asyncio.create_task(permanent_mic_listener(
            audio_queue, loop, whisper_task_queue,
            ai_is_processing, interruption_triggered
        ))

        async with aiohttp.ClientSession() as session:
            print("\nReady. Start speaking...")

            while True:
                # Drain stale items from queue
                while not whisper_task_queue.empty():
                    whisper_task_queue.get_nowait()
                interruption_triggered.clear()

                user_text = await whisper_task_queue.get()
                if user_text.lower().strip(".,!?") in [
                    "exit", "quit", "end the conversation", "keluar"
                ]:
                    print("Shutting down. Goodbye!")
                    break

                print(f"You: {user_text}")

                requested_lang = await check_language_change_request(
                    user_text
                )
                if requested_lang:
                    CURRENT_LANGUAGE_FLAG = requested_lang
                    feedback = (
                        f"Language switched to {CURRENT_LANGUAGE_FLAG}."
                    )
                    if CURRENT_LANGUAGE_FLAG == "chinese":
                        feedback = "语言模式已切换为中文。"
                    elif CURRENT_LANGUAGE_FLAG == "bahasa malaysia":
                        feedback = ("Mod bahasa telah ditukar kepada "
                                    "Bahasa Malaysia.")
                    print(f"[Lang]: {feedback}")
                    await speak_out_loud_async(
                        feedback, interruption_triggered
                    )
                    ai_is_processing.clear()
                    continue

                system_instruction = (
                    f"You are a concise voice assistant. Keep answers "
                    f"short. Do not use emoji or emoticons. "
                    f"Respond in '{CURRENT_LANGUAGE_FLAG}'. "
                    f"If 'chinese', use simplified Chinese. "
                    f"If 'bahasa malaysia', use Malay."
                )

                if (not conversation_history or
                        conversation_history[0]["role"] != "system"):
                    conversation_history.insert(
                        0, {"role": "system", "content": system_instruction}
                    )
                else:
                    conversation_history[0]["content"] = system_instruction

                conversation_history.append(
                    {"role": "user", "content": user_text}
                )

                payload = {
                    "model": "meta/gemma-4-12b",
                    "messages": conversation_history,
                    "stream": True
                }

                print("AI: ", end="", flush=True)
                full_response_text = ""
                interrupted_mid_generation = False

                # TTS sentence queue: display and speak sentences
                # simultaneously as they complete
                tts_queue = asyncio.Queue()

                async def _tts_worker():
                    """Consume sentences from queue and speak them."""
                    while True:
                        sentence = await tts_queue.get()
                        if sentence is None:  # poison pill
                            break
                        if interruption_triggered.is_set():
                            break
                        await speak_out_loud_async(
                            sentence, interruption_triggered
                        )

                tts_task = asyncio.create_task(_tts_worker())
                sentence_buffer = ""
                SENTENCE_ENDS = ".!?。！？\n"

                try:
                    async with session.post(
                        LM_STUDIO_HTTP_URL, json=payload
                    ) as response:
                        async for line in response.content:
                            if interruption_triggered.is_set():
                                interrupted_mid_generation = True
                                break

                            line_str = line.decode('utf-8').strip()
                            if (line_str.startswith("data: ") and
                                    not line_str.endswith("[DONE]")):
                                try:
                                    json_data = json.loads(line_str[6:])
                                    choices = json_data.get('choices', [])
                                    if choices:
                                        choice = (choices[0]
                                                  if isinstance(choices, list)
                                                  else choices)
                                        delta = choice.get('delta', {})
                                        chunk_text = delta.get('content', '')
                                        full_response_text += chunk_text
                                        sentence_buffer += chunk_text

                                        # On sentence end: display + speak
                                        if any(c in chunk_text
                                               for c in SENTENCE_ENDS):
                                            text = sentence_buffer.strip()
                                            if text:
                                                print(text, flush=True)
                                                tts_queue.put_nowait(text)
                                            sentence_buffer = ""
                                except Exception:
                                    continue

                    # Flush remaining partial sentence
                    if sentence_buffer.strip() and not interrupted_mid_generation:
                        text = sentence_buffer.strip()
                        print(text, flush=True)
                        tts_queue.put_nowait(text)

                    # Signal TTS worker to finish
                    await tts_queue.put(None)
                    await tts_task

                    if interrupted_mid_generation:
                        tts_task.cancel()
                        try:
                            await tts_task
                        except (asyncio.CancelledError, Exception):
                            pass
                        ai_is_processing.clear()
                        continue

                    conversation_history.append(
                        {"role": "assistant", "content": full_response_text}
                    )
                    print("-" * 50)

                    if interruption_triggered.is_set():
                        # Mic listener already captured post-interrupt
                        # audio into its buffer; no flush needed
                        pass

                    ai_is_processing.clear()
                    interruption_triggered.clear()
                    print("Listening...")

                    if len(conversation_history) > 21:
                        conversation_history = (
                            [conversation_history[0]]
                            + conversation_history[-20:]
                        )

                except Exception as e:
                    print(f"\nError: {e}")
                    ai_is_processing.clear()
                    interruption_triggered.clear()


if __name__ == "__main__":
    try:
        asyncio.run(stream_voice_to_gemma())
    except KeyboardInterrupt:
        print("\nSession stopped. Goodbye!")