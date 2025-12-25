import { useState, useEffect, useMemo, useRef } from 'react';
import '../styles/chatbot.css';
import { useLanguage } from '../hooks/useLanguage';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { sendMessageToBot } from '../services/aiBotService';

interface Message {
  id: string;
  user: boolean;
  text: string;
  timestamp: number;
}

declare global {
  interface Window {
    webkitSpeechRecognition: unknown;
  }
}

const ChatBot: React.FC = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = sessionStorage.getItem(`chat_messages_${language}`) || '[]';
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [isAwaiting, setIsAwaiting] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  
  // Initialize speech recognition
  type WinWithSpeech = Window & {
    webkitSpeechRecognition?: unknown;
    SpeechRecognition?: unknown;
  };

  type SpeechRecCtor = new () => unknown;

  type MinimalSpeechRec = {
    continuous?: boolean;
    interimResults?: boolean;
    lang?: string;
    onresult?: (e: unknown) => void;
    start?: () => void;
    stop?: () => void;
  };

  const recognition = useMemo((): MinimalSpeechRec | null => {
    const w = window as unknown as WinWithSpeech;
    if (w && (w.webkitSpeechRecognition || w.SpeechRecognition)) {
      const Rec = (w.webkitSpeechRecognition || w.SpeechRecognition) as unknown as SpeechRecCtor;
      return new Rec() as MinimalSpeechRec;
    }
    return null;
  }, []);
  useEffect(() => {
    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getLanguageCode(language);
      
      recognition.onresult = (event: unknown) => {
        // Build transcript from results (use minimal typing)
        let transcript = '';
        type OnResultEv = { results?: { [index: number]: { [index: number]: { transcript?: string } } } & { length?: number } };
        const ev = event as OnResultEv;
        const results = ev && ev.results ? ev.results : [];
        type ResultsArray = { length: number; [index: number]: { [index: number]: { transcript?: string } } };
        const resultsTyped = results as ResultsArray;
        for (let i = 0; i < resultsTyped.length; i++) {
          const r = resultsTyped[i];
          if (r && r[0] && r[0].transcript) {
            transcript += r[0].transcript;
          }
        }
        setInput(transcript);
      };
    }

    return () => {
      if (recognition && typeof recognition.stop === 'function') recognition.stop();
    };
  }, [language, recognition]);

  // Save messages for current language
  useEffect(() => {
    try {
      sessionStorage.setItem(`chat_messages_${language}`, JSON.stringify(messages));
    } catch {
      // ignore sessionStorage write errors (e.g., storage disabled)
    }
  }, [messages, language]);

  // Auto-scroll when messages change
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      if (recognition && typeof recognition.stop === 'function') recognition.stop();
    } else {
      if (recognition && typeof recognition.start === 'function') recognition.start();
    }
    setIsListening(!isListening);
  };

  const getLanguageCode = (lang: string): string => {
    switch (lang) {
      case 'ta': return 'ta-IN';  // Tamil
      case 'hi': return 'hi-IN';  // Hindi
      case 'ml': return 'ml-IN';  // Malayalam
      default: return 'en-US';    // English
    }
  };

  const sendMessage = async (text?: string) => {
    const body = (typeof text === 'string' ? text : input).trim();
    if (!body) return;

    // Prepare user message
    const userMsg: Message = { id: String(Date.now()) + '-u', user: true, text: body, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Stop listening when sending message
    if (isListening && recognition) {
      if (typeof recognition.stop === 'function') recognition.stop();
      setIsListening(false);
    }

    // Add typing indicator message
    const typingId = `typing-${Date.now()}`;
    const typingMsg: Message = { id: typingId, user: false, text: '...', timestamp: Date.now() };
    setMessages(prev => [...prev, typingMsg]);
    setIsAwaiting(true);

    try {
      const botResp = await sendMessageToBot(body, language);
      // Remove typing indicator and append bot message with timestamp
      setMessages(prev => {
        const withoutTyping = prev.filter(m => m.id !== typingId);
        const botMsg: Message = { id: String(Date.now()) + '-b', user: false, text: botResp.text, timestamp: Date.now() };
        return [...withoutTyping, botMsg];
      });
    } catch {
      setMessages(prev => {
        const withoutTyping = prev.filter(m => m.id !== typingId);
        const botMsg: Message = { id: String(Date.now()) + '-b', user: false, text: 'Sorry, the bot failed to respond.', timestamp: Date.now() };
        return [...withoutTyping, botMsg];
      });
    } finally {
      setIsAwaiting(false);
    }
  };

  const quickReplies = [
    { id: 'qr1', text: 'How do I register a complaint?' },
    { id: 'qr2', text: 'Track my case' },
    { id: 'qr3', text: 'Contact support' },
  ];

  const handleQuickReply = (txt: string) => {
    // send immediately
    sendMessage(txt);
  };

  return (
    <div className="chatbot-container">
      <div className="messages" ref={messagesRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.user ? 'user' : 'bot'}`}>
            <div className="message-inner">
              <div className="avatar">{msg.user ? 'You' : 'COBOT'}</div>
              <div className="bubble">
                <div className="text">{msg.text}</div>
                <div className="time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-replies">
        {quickReplies.map(q => (
          <button key={q.id} className="quick-reply-btn" onClick={() => handleQuickReply(q.text)}>
            {q.text}
          </button>
        ))}
      </div>

      <div className="input-box">
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          placeholder={`Type your message in ${language.toUpperCase()}...`}
          disabled={isAwaiting}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button 
          className="voice-btn" 
          onClick={toggleListening}
          disabled={isAwaiting}
        >
          {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <button onClick={() => sendMessage()} disabled={isAwaiting}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
