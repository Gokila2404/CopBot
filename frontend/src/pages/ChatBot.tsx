import React, { useState, useMemo } from "react";
import "../styles/chatbot.css";
import { FaMicrophone, FaMicrophoneSlash, FaComments } from "react-icons/fa";

interface Message {
  user: boolean;
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // 🎙️ Voice recognition setup
  type WinWithSpeech = Window & { webkitSpeechRecognition?: unknown; SpeechRecognition?: unknown };
  const recognition = useMemo(() => {
    const w = window as unknown as WinWithSpeech;
    if (w && (w.webkitSpeechRecognition || w.SpeechRecognition)) {
      const Rec = (w.webkitSpeechRecognition || w.SpeechRecognition) as unknown;
      return new (Rec as any)();
    }
    return null;
  }, []);

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
  }

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition not supported in your browser.");
      return;
    }
    if (isListening) recognition.stop();
    else recognition.start();
    setIsListening(!isListening);
  };

  // 💬 Bot response logic
  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase().trim();

    if (msg.includes("register") && msg.includes("complaint")) {
      return "📝 To register a complaint, click on 'Register Complaint', fill in the form, attach files if needed, and submit. You'll receive a tracking ID for your case.";
    }

    if (msg.includes("website") || msg.includes("webpage") || msg.includes("system")) {
      return "🌐 This is the Confidential Case Reporting System — a secure platform for anonymous reporting and tracking your case.";
    }

    if (msg.includes("who are you") || msg.includes("your name")) {
      return "🤖 I’m COBOT, your AI assistant! I help you report complaints, track cases, and understand the system.";
    }

    if (msg.includes("login") || msg.includes("register")) {
      return "🔐 Use the Login/Register button on the homepage. After login, you can access your dashboard and submit complaints.";
    }

    if (msg.includes("upload") || msg.includes("file") || msg.includes("document")) {
      return "📁 You can securely upload supporting files while submitting a complaint. All files are encrypted.";
    }

    if (msg.includes("track") || msg.includes("status") || msg.includes("progress")) {
      return "📊 To track your complaint, go to the 'Track Case' section and enter your tracking ID to see updates.";
    }

    if (msg.includes("secure") || msg.includes("privacy") || msg.includes("safe")) {
      return "🔒 Your privacy is our top priority! All reports are encrypted and accessible only to authorized personnel.";
    }

    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      return "👋 Hello! How can I help you today?";
    }

    if (msg.includes("thank")) {
      return "😊 You’re welcome! Do you need help with anything else?";
    }

    // Default fallback
    return "💭 I’m not sure about that yet. You can ask me how to register a complaint, track a case, or about system features.";
  };

  const sendMessage = () => {
    if (input.trim() === "") return;

    const userMsg = { user: true, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botReply = getBotResponse(userMsg.text);
      setMessages((prev) => [...prev, { user: false, text: botReply }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <FaComments />
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">AI Chat Assistant</div>

          <div className="messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.user ? "message user" : "message bot"}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="message bot typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>

          <div className="input-box">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              className={`voice-btn ${isListening ? "listening" : ""}`}
              onClick={toggleListening}
            >
              {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
