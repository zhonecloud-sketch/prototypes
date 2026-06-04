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

# Silence threshold parameters for local voice activity detection (VAD)
SILENCE_THRESHOLD = 0.02  
SILENCE_DURATION = 1.3    

print("🧠 Loading local speech-to-text engine into memory...")
# Whisper "tiny" handles multiple languages, but "tiny.en" only does English.
whisper_model = whisper.load_model("tiny")
print("✅ Local speech engine loaded successfully.")

def contains_chinese(text):
    """Detects if a string contains Chinese characters."""
    return bool(re.search(r'[\u4e00-\u9fff]', text))

def speak_out_loud(text):
    """Uses the native macOS system speech framework to read text out loud."""
    # Strip basic special markdown tokens so the speech engine doesn't read them
    clean_text = text.replace("*", "").replace('"', '\\"').replace("`", "")
    
    # Automatically switch voice if Chinese characters are detected
    if contains_chinese(clean_text):
        os.system(f'say -v Tingting "{clean_text}"')
    else:
        os.system(f'say "{clean_text}"')
async def stream_voice_to_gemma():
    print("=" * 60)
    print("🚀 Local Voice Assistant with Echo Cancellation Initialised")
    print("Speak clearly into your microphone. Say 'exit' to close.")
    print("=" * 60)

    loop = asyncio.get_running_loop()
    audio_queue = asyncio.Queue()

    # Dynamic system instruction allowing the assistant to respond in any language requested
    conversation_history = [
        {
            "role": "system", 
            "content": "You are a concise, helpful spoken voice assistant. Keep answers short. Respond naturally using the language the user speaks or requests."
        }
    ]

    def audio_callback(indata, frames, time, status):
        loop.call_soon_threadsafe(audio_queue.put_nowait, indata.copy())

    stream = sd.InputStream(
        samplerate=TARGET_SAMPLE_RATE, 
        channels=CHANNELS, 
        dtype='float32', 
        callback=audio_callback
    )

    async with aiohttp.ClientSession() as session:
        with stream:
            print("\n🎤 Listening natively... Start talking.")
            
            while True:
                audio_buffer = []
                silent_chunks = 0
                recording_started = False
                
                while True:
                    chunk = await audio_queue.get()
                    audio_buffer.append(chunk)
                    
                    volume_norm = np.linalg.norm(chunk) / np.sqrt(len(chunk))
                    
                    if volume_norm > SILENCE_THRESHOLD:
                        if not recording_started:
                            print("🧠 Audio detected... recording phrase...")
                            recording_started = True
                        silent_chunks = 0
                    elif recording_started:
                        silent_chunks += len(chunk) / TARGET_SAMPLE_RATE
                        if silent_chunks >= SILENCE_DURATION:
                            print("⏸️ End of speech detected. Transcribing locally...")
                            break
                    else:
                        if len(audio_buffer) > 20:
                            audio_buffer.pop(0)

                full_audio = np.concatenate(audio_buffer, axis=0).flatten()

                # CRITICAL CHANGE: Set language=None so Whisper auto-detects English, Chinese, etc.
                result = await loop.run_in_executor(
                    None, 
                    lambda: whisper_model.transcribe(full_audio, fp16=False, language=None)
                )
                
                user_text = result.get("text", "").strip()
                
                if not user_text or len(user_text) < 2:
                    print("❌ Could not understand the audio. Please try speaking again.")
                    continue
                    
                print(f"💬 You said: {user_text}")
                
                if user_text.lower().strip(".,!?") in ["exit", "quit", "end the conversation"]:
                    print("Shutting down safely. Goodbye!")
                    break

                conversation_history.append({"role": "user", "content": user_text})

                payload = {
                    "model": "meta/gemma-4-12b",
                    "messages": conversation_history,
                    "stream": True
                }

                print("🤖 Gemma 4: ", end="", flush=True)
                full_response_text = ""
                
                try:
                    async with session.post(LM_STUDIO_HTTP_URL, json=payload) as response:
                        async for line in response.content:
                            line_str = line.decode('utf-8').strip()
                            if line_str.startswith("data: ") and not line_str.endswith("[DONE]"):
                                try:
                                    json_data = json.loads(line_str[6:])
                                    choices = json_data.get('choices', [])
                                    
                                    if choices:
                                        if isinstance(choices, list):
                                            choice = choices[0]
                                        else:
                                            choice = choices
                                            
                                        delta = choice.get('delta', {})
                                        chunk_text = delta.get('content', '')
                                        print(chunk_text, end="", flush=True)
                                        full_response_text += chunk_text
                                except (json.JSONDecodeError, KeyError, TypeError):
                                    continue
                    
                    conversation_history.append({"role": "assistant", "content": full_response_text})
                    print("\n" + "-" * 50)
                    
                    # Read the text out loud after the full stream finishes printing
                    await loop.run_in_executor(None, speak_out_loud, full_response_text)
                    
                    # ECHO CANCELLATION: Flush out all audio captured while Gemma was talking
                    while not audio_queue.empty():
                        try:
                            audio_queue.get_nowait()
                        except asyncio.QueueEmpty:
                            break
                            
                    print("🎤 Ready! Listening again...")
                    
                    if len(conversation_history) > 21:
                        conversation_history = [conversation_history[0]] + conversation_history[-20:]
                    
                except Exception as e:
                    print(f"\n❌ Server pipeline transmission crash: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(stream_voice_to_gemma())
    except KeyboardInterrupt:
        print("\nSession stopped safely. Goodbye!")
