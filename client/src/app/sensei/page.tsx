"use client";

import { useState, useEffect, useRef } from "react";
import { API_URL } from "@/lib/api";
import { Sparkles, Send, Bot, User, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function SenseiPage() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Greetings, student. I am your Otaku Sensei. Ask me anything about the world of anime, or just click the microphone to speak your mind.' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  // Speech Recognition Setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
          handleSendMessage(transcript);
        };

        recog.onerror = (event: any) => {
          console.error("Speech Recognition Error:", event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            toast.error("Microphone Access Denied! Please enable permissions in your browser.");
          }
        };

        recog.onend = () => setIsListening(false);
        recognitionRef.current = recog;
      }
    }
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.9;
      utterance.rate = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: textToSend, history: newMessages })
      });
      
      const data = await res.json();
      
      if (data.error) {
        toast.error("Sensei is meditating on your question... (Server Error)");
        return;
      }

      const botMessage = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, botMessage]);
      speak(data.reply);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred reaching the Sensei.");
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech Recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-5xl mx-auto p-4 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-500/10 rounded-2xl aura-border text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Sparkles size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter aura-text uppercase italic">Otaku Sensei</h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">Neural AI trained in the 48 Chambers of Anime Wisdom.</p>
        </div>
        
        <div className="flex items-center gap-2">
           {isSpeaking && (
             <motion.div 
               animate={{ scale: [1, 1.2, 1] }} 
               transition={{ repeat: Infinity, duration: 1 }}
               className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 text-pink-500 rounded-full border border-pink-500/20"
             >
                <div className="flex gap-1">
                   {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-pink-500 animate-pulse" />)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Sensei is speaking...</span>
             </motion.div>
           )}
        </div>
      </header>

      <div className="flex-1 glass-panel rounded-[2.5rem] p-6 mb-6 overflow-y-auto space-y-6 relative border-2 border-white/5 bg-black/20">
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-3 rounded-2xl border ${
                m.role === 'assistant' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-white/5 border-white/10 text-slate-400'
              }`}>
                {m.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`max-w-[80%] p-5 rounded-3xl ${
                m.role === 'assistant' ? 'glass-panel text-slate-200' : 'bg-gradient-to-br from-purple-600/80 to-pink-600/80 text-white shadow-xl aura-border'
              }`}>
                <p className="text-sm font-medium leading-relaxed">{m.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex items-center gap-3 text-slate-500">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest">Consulting the Scrolls...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center gap-4 group">
        <button 
           onClick={toggleListening}
           className={`p-5 rounded-2xl border transition-all duration-500 ${
             isListening 
                ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
           }`}
        >
          {isListening ? <Mic size={24} className="animate-pulse" /> : <MicOff size={24} />}
        </button>

        <div className="flex-1 relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? "Listening to your spirit voice..." : "Consult the Sensei..."}
            className="w-full bg-white/5 border-2 border-white/5 p-5 rounded-[1.5rem] outline-none focus:border-purple-500/40 text-sm font-medium transition-all group-hover:bg-white/[0.08]"
          />
          <button 
            onClick={() => handleSendMessage()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl text-white shadow-xl hover:scale-110 active:scale-95 transition-all aura-border"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
