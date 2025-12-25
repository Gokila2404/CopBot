from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from gtts import gTTS
import os

app = Flask(__name__)
CORS(app)

bot = pipeline("text-generation", model="distilgpt2")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get("message")
    response = bot(user_input, max_length=60, num_return_sequences=1)[0]['generated_text']
    return jsonify({"reply": response})

if __name__ == '__main__':
    app.run(port=5001)
