from gtts import gTTS
import os

def text_to_speech(text, filename="output.mp3", lang="en"):
    tts = gTTS(text=text, lang=lang)
    tts.save(filename)
    os.system(f"start {filename}" if os.name=="nt" else f"mpg123 {filename}")
