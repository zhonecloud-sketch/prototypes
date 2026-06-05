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

# Global state tracking for target language settings
CURRENT_LANGUAGE_FLAG = "english"

print("🧠 Loading local speech-to-text engine into memory...")
whisper_model = whisper.load_model("tiny")
print("✅ Local speech engine loaded successfully.")

def contains_chinese(text):
    """Detects if a string contains Chinese characters."""
    return bool(re.search(r'[\u4e00-\u9fff]', text))

def speak_out_loud(text):
    """Uses the native macOS system speech framework to read text out loud."""
    global CURRENT_LANGUAGE_FLAG
    clean_text = text.replace("*", "").replace('"', '\\"').replace("`", "")
    
    # Route voice packs to handle the selected language context natively on macOS
    if CURRENT_LANGUAGE_FLAG == "chinese" or contains_chinese(clean_text):
        os.system(f'say -v Tingting "{clean_text}"')
    elif CURRENT_LANGUAGE_FLAG == "bahasa malaysia":
        os.system(f'say -v Amira "{clean_text}"')
    else:
        os.system(f'say -v Samantha "{clean_text}"')

async def check_language_change_request(session, user_text):
    """
    Step 1 & 2: Checks if the user text is asking to change languages.
    Uses an LLM intent parsing step with a strict local regex fallback filter.
    """
    text_lower = user_text.lower()
    
    # Fast deterministic hard check for safety against phonetic transcription errors
    if any(k in text_lower for k in ["bahasa malaysia", "bahasa melayu", "malay", "melayu"]):
        return "bahasa malaysia"
    if any(k in text_lower for k in ["mandarin", "chinese", "中文", "华语", "普通话"]):
        return "chinese"
    if any(k in text_lower for k in ["english", "speak english", "in english"]):
        return "english"

    # LLM Inference Intent parsing engine
    intent_prompt = [
        {
            "role": "system", 
            "content": (
                "You are an instruction parsing router. Analyze the user text. "
                "Does the user explicitly ask to change, switch, or converse in another language? "
                "If YES and they explicitly mention a language (like Chinese, English, or Malay/Bahasa Malaysia), "
                "reply with EXACTLY one word specifying that target language: 'chinese', 'english', or 'bahasa malaysia'. "
                "If NO or if their instruction is vague/insufficient, reply with EXACTLY the word 'none'."
            )
        },
        {"role": "user", "content": f"Analyze this phrase: '{user_text}'"}
    ]
    
    payload = {
        "model": "meta/gemma-4-12b",
        "messages": intent_prompt,
        "stream": False
    }
    
    try:
        async with session.post(LM_STUDIO_HTTP_URL, json=payload) as response:
            if response.status == 200:
                res_data = await response.json()
                choices = res_data.get("choices", [])
                if choices and isinstance(choices, list):
                    content = choices[0].get("message", {}).get("content", "").strip().lower()
                    if content in ["chinese", "english", "bahasa malaysia"]:
                        return content
    except Exception as e:
        print(f"⚠️ Intent assessment skip: {e}")
    return None
async def stream_voice_to_gemma():
    global CURRENT_LANGUAGE_FLAG
    print("=" * 60)
    print("🚀 Local Voice Assistant with Echo Cancellation Initialised")
    print("Speak clearly into your microphone. Say 'exit' to close.")
    print("=" * 60)

    loop = asyncio.get_running_loop()
    audio_queue = asyncio.Queue()

    # Initial conversation history array layout setup
    conversation_history = []

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

                # Local multi-lingual processing using Whisper
                result = await loop.run_in_executor(
                    None, 
                    lambda: whisper_model.transcribe(full_audio, fp16=False, language=None)
                )
                
                user_text = result.get("text", "").strip()
                
                if not user_text or len(user_text) < 2:
                    print("❌ Could not understand the audio. Please try speaking again.")
                    continue
                    
                print(f"💬 You said: {user_text}")
                
                if user_text.lower().strip(".,!?") in ["exit", "quit", "end the conversation", "keluar"]:
                    print("Shutting down safely. Goodbye!")
                    break

                # 1 & 2. Parse text input to check for explicit language switch requests
                requested_lang = await check_language_change_request(session, user_text)
                
                if requested_lang:
                    # Valid instruction confirmed: update structural context tracker
                    CURRENT_LANGUAGE_FLAG = requested_lang
                    
                    feedback = f"Language flag updated to {CURRENT_LANGUAGE_FLAG}."
                    if CURRENT_LANGUAGE_FLAG == "chinese":
                        feedback = "语言模式已切换为中文。"
                    elif CURRENT_LANGUAGE_FLAG == "bahasa malaysia":
                        feedback = "Mod bahasa telah ditukar kepada Bahasa Malaysia."
                        
                    print(f"🎯 [System Action]: {feedback}")
                    stream.stop()
                    await loop.run_in_executor(None, speak_out_loud, feedback)
                    stream.start()
                    continue  # Interrupt normal conversation pipeline, return to listening

                # Continue parsing content for normal conversation if no change was requested
                system_instruction = (
                    f"You are a concise spoken voice assistant. Keep answers short. "
                    f"You must respond naturally and exclusively using the '{CURRENT_LANGUAGE_FLAG}' language profile. "
                    f"If the flag profile matches 'chinese', write answers using simplified Chinese characters. "
                    f"If the flag profile matches 'bahasa malaysia', speak in natural Malay."
                )
                
                # Re-sync or initialize the current system prompt injection frame
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
                    
                    # Stop microphone while speaking to prevent echo-cancellation bleed
                    stream.stop()
                    await loop.run_in_executor(None, speak_out_loud, full_response_text)
                    
                    # Clear out all audio captured while the speaker was active
                    while not audio_queue.empty():
                        try:
                            audio_queue.get_nowait()
                        except asyncio.QueueEmpty:
                            break
                    
                    stream.start()        
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
