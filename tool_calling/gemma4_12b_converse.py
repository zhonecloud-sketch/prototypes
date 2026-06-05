import ssl
ssl._create_default_https_context = ssl._create_unverified_context

import asyncio
import json
import logging
import os
import re
import warnings
import numpy as np
import sounddevice as sd
import aiohttp
import whisper

# Suppress machine learning warnings to keep terminal logs clean
warnings.filterwarnings("ignore", category=UserWarning)
logging.getLogger("whisper").setLevel(logging.ERROR)

# Configuration settings
TARGET_SAMPLE_RATE = 16000
CHANNELS = 1
LM_STUDIO_HTTP_URL = "http://localhost:1234/v1/chat/completions"

# Dynamic VAD configuration fallbacks
DYNAMIC_THRESHOLD = 0.03  # Will be overridden automatically during calibration
SILENCE_DURATION = 1.3    

# Global runtime state tracking variables
CURRENT_LANGUAGE_FLAG = "english"
CURRENT_SPEECH_PROCESS = None  

print("🧠 Loading local speech-to-text engine into memory...")
whisper_model = whisper.load_model("tiny")
print("✅ Local speech engine loaded successfully.")

def contains_chinese(text):
    """Detects if a string contains Chinese characters."""
    return bool(re.search(r'[\u4e00-\u9fff]', text))

async def speak_out_loud_async(text):
    """Executes macOS native speech non-blockingly using asynchronous subprocesses."""
    global CURRENT_LANGUAGE_FLAG, CURRENT_SPEECH_PROCESS
    clean_text = text.replace("*", "").replace('"', '\\"').replace("`", "").strip()
    if not clean_text:
        return

    voice = "Samantha"
    if CURRENT_LANGUAGE_FLAG == "chinese" or contains_chinese(clean_text):
        voice = "Tingting"
    elif CURRENT_LANGUAGE_FLAG == "bahasa malaysia":
        voice = "Amira"

    try:
        CURRENT_SPEECH_PROCESS = await asyncio.create_subprocess_exec(
            "say", "-v", voice, clean_text,
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.DEVNULL
        )
        await CURRENT_SPEECH_PROCESS.wait()
    except asyncio.CancelledError:
        if CURRENT_SPEECH_PROCESS:
            try:
                CURRENT_SPEECH_PROCESS.kill()  
            except Exception:
                pass
        raise
    finally:
        CURRENT_SPEECH_PROCESS = None

async def check_language_change_request(session, user_text):
    """Steps 1 & 2: Structural instruction parsing router."""
    text_lower = user_text.lower()
    if any(k in text_lower for k in ["bahasa malaysia", "bahasa melayu", "malay", "melayu"]):
        return "bahasa malaysia"
    if any(k in text_lower for k in ["mandarin", "chinese", "中文", "华语", "普通话"]):
        return "chinese"
    if any(k in text_lower for k in ["english", "speak english", "in english"]):
        return "english"
    return None
async def permanent_mic_listener(audio_queue, loop, whisper_task_queue, ai_is_processing, interruption_triggered):
    """
    Background Task: Tracks voice phrases using rolling noise filters.
    Requires sustained speech volume to trigger an interruption, filtering out background clicks.
    """
    global DYNAMIC_THRESHOLD
    audio_buffer = []
    silent_chunks = 0
    recording_started = False
    
    # Rolling window array to smoothen energy spikes
    energy_history = []

    while True:
        chunk = await audio_queue.get()
        volume_norm = np.linalg.norm(chunk) / np.sqrt(len(chunk))
        
        # Maintain a 3-chunk rolling average (approx 300ms window)
        energy_history.append(volume_norm)
        if len(energy_history) > 3:
            energy_history.pop(0)
        smoothed_volume = np.mean(energy_history)

        # STATE A: AI is processing. Look exclusively for significant interruption spikes.
        if ai_is_processing.is_set():
            audio_buffer = []
            silent_chunks = 0
            recording_started = False
            
            # Require the smoothed average to cross 1.5x the calibrated background threshold
            if smoothed_volume > (DYNAMIC_THRESHOLD * 1.5):
                print("\n⚡ [INTERRUPTION] Sustained speech signal picked up! Halting processing...")
                interruption_triggered.set()
                ai_is_processing.clear()  
                print("🎙️ listening...")
            continue

        # STATE B: AI is idle. Run standard rolling frame recording.
        audio_buffer.append(chunk)
        
        if smoothed_volume > DYNAMIC_THRESHOLD:
            if not recording_started:
                print("🧠 Speech profile confirmed... recording phrase...")
                recording_started = True
            silent_chunks = 0
        elif recording_started:
            silent_chunks += len(chunk) / TARGET_SAMPLE_RATE
            if silent_chunks >= SILENCE_DURATION:
                print("\n⏸️ User finished speaking. Processing transcript...")
                ai_is_processing.set()
                
                full_audio = np.concatenate(audio_buffer, axis=0).flatten()
                
                result = await loop.run_in_executor(
                    None, lambda: whisper_model.transcribe(full_audio, fp16=False, language=None)
                )
                
                user_text = result.get("text", "").strip()
                
                if interruption_triggered.is_set():
                    audio_buffer = []
                    continue

                if user_text and len(user_text) >= 2:
                    await whisper_task_queue.put(user_text)
                else:
                    print("❌ Static or unresolvable audio packet dropped. Resuming listening mode...")
                    ai_is_processing.clear()  
                
                audio_buffer = []
                recording_started = False
        else:
            if len(audio_buffer) > 20:
                audio_buffer.pop(0)
async def stream_voice_to_gemma():
    global CURRENT_LANGUAGE_FLAG, DYNAMIC_THRESHOLD
    print("=" * 60)
    print("🚀 Adaptive Full-Duplex Local Voice Assistant Initialised")
    print("Please keep quiet. Calibrating surrounding microphone acoustics...")
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
        # Dynamic Calibration Step: Read ambient noise for 500ms
        calibration_buffer = []
        for _ in range(5):  # Gather 5 blocks (~500ms total block size)
            await asyncio.sleep(0.1)
            while not audio_queue.empty():
                chunk = audio_queue.get_nowait()
                calibration_buffer.append(np.linalg.norm(chunk) / np.sqrt(len(chunk)))
        
        # Establish dynamic floor, adding a 0.015 safety padding value to ignore background hums
        ambient_floor = np.mean(calibration_buffer) if calibration_buffer else 0.02
        DYNAMIC_THRESHOLD = max(ambient_floor + 0.015, 0.025)
        print(f"✅ Acoustic Calibration finished. Noise baseline fixed at: {DYNAMIC_THRESHOLD:.4f}")

        # Start background listener loop task
        asyncio.create_task(permanent_mic_listener(
            audio_queue, loop, whisper_task_queue, ai_is_processing, interruption_triggered
        ))

        async with aiohttp.ClientSession() as session:
            print("\n🎤 Systems Ready. Start speaking...")
            
            while True:
                while not whisper_task_queue.empty():
                    whisper_task_queue.get_nowait()
                interruption_triggered.clear()
                
                user_text = await whisper_task_queue.get()
                if user_text.lower().strip(".,!?") in ["exit", "quit", "end the conversation", "keluar"]:
                    print("Shutting down safely. Goodbye!")
                    break

                print(f"💬 You said: {user_text}")

                requested_lang = await check_language_change_request(session, user_text)
                if requested_lang:
                    CURRENT_LANGUAGE_FLAG = requested_lang
                    feedback = f"Language flag updated to {CURRENT_LANGUAGE_FLAG}."
                    if CURRENT_LANGUAGE_FLAG == "chinese":
                        feedback = "语言模式已切换为中文。"
                    elif CURRENT_LANGUAGE_FLAG == "bahasa malaysia":
                        feedback = "Mod bahasa telah ditukar kepada Bahasa Malaysia."
                    print(f"🎯 [System Action]: {feedback}")
                    await speak_out_loud_async(feedback)
                    ai_is_processing.clear()  
                    continue

                system_instruction = (
                    f"You are a concise voice assistant. Keep answers short. "
                    f"You must respond naturally and exclusively using the '{CURRENT_LANGUAGE_FLAG}' language profile. "
                    f"If 'chinese', output simplified Chinese characters. If 'bahasa malaysia', use Malay."
                )
                
                if not conversation_history or conversation_history[0]["role"] != "system":
                    conversation_history.insert(0, {"role": "system", "content": system_instruction})
                else:
                    conversation_history[0]["content"] = system_instruction

                conversation_history.append({"role": "user", "content": user_text})

                payload = {
                    "model": "meta/gemma-4-12b",
                    "messages": conversation_history,
                    "stream": True
                }

                print("🤖 Gemma 4: ", end="", flush=True)
                full_response_text = ""
                interrupted_mid_generation = False
                
                try:
                    async with session.post(LM_STUDIO_HTTP_URL, json=payload) as response:
                        async for line in response.content:
                            if interruption_triggered.is_set():
                                interrupted_mid_generation = True
                                break
                                
                            line_str = line.decode('utf-8').strip()
                            if line_str.startswith("data: ") and not line_str.endswith("[DONE]"):
                                try:
                                    json_data = json.loads(line_str[6:])
                                    choices = json_data.get('choices', [])
                                    if choices:
                                        choice = choices[0] if isinstance(choices, list) else choices
                                        delta = choice.get('delta', {})
                                        chunk_text = delta.get('content', '')
                                        print(chunk_text, end="", flush=True)
                                        full_response_text += chunk_text
                                except Exception:
                                    continue

                    if interrupted_mid_generation:
                        ai_is_processing.clear()
                        continue

                    conversation_history.append({"role": "assistant", "content": full_response_text})
                    print("\n" + "-" * 50)
                    
                    tts_task = asyncio.create_task(speak_out_loud_async(full_response_text))
                    
                    while not tts_task.done():
                        if interruption_triggered.is_set():
                            tts_task.cancel()  
                            break
                        await asyncio.sleep(0.05)
                        
                    try:
                        await tts_task
                    except asyncio.CancelledError:
                        pass

                    while not audio_queue.empty():
                        try:
                            audio_queue.get_nowait()
                        except asyncio.QueueEmpty:
                            break
                    
                    ai_is_processing.clear()
                    interruption_triggered.clear()
                    print("🎤 Ready! Listening again...")
                    
                    if len(conversation_history) > 21:
                        conversation_history = [conversation_history[0]] + conversation_history[-20:]
                    
                except Exception as e:
                    print(f"\n❌ Pipeline runtime exception: {e}")
                    ai_is_processing.clear()
                    interruption_triggered.clear()

if __name__ == "__main__":
    try:
        asyncio.run(stream_voice_to_gemma())
    except KeyboardInterrupt:
        print("\nSession stopped safely. Goodbye!")
