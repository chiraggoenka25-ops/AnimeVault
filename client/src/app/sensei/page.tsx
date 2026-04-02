"use client";

import { useState, useEffect, useRef } from "react";
import { API_URL } from "@/lib/api";
import { Sparkles, Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Infinity, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function SenseiPage() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Greetings, student. I am your Otaku Sensei. I have been upgraded to the Infinity Evolution. Ask me anything, or speak through the Neural Mic.' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

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

        recog.onerror = () => setIsListening(false);
        recog.onend = () => setIsListening(false);
        recognitionRef.current = recog;
      }
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.95;
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history: newMessages })
      });
      const data = await res.json();
      const botMessage = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, botMessage]);
      speak(data.reply);
    } catch (err) {
      toast.error("Neural Link unstable. Sensei is contemplating...");
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return toast.error("Neural Voice Link not supported.");
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      try { recognitionRef.current.start(); } catch { setIsListening(false); }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-5xl mx-auto p-4 md:p-8 relative overflow-hidden transition-all duration-500">
      {/* Cinematic Neural Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03] dark:opacity-[0.07] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      <header className="mb-8 flex items-center justify-between relative z-20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-500/10 rounded-2xl aura-border text-purple-600 dark:text-purple-400">
              <Infinity size={24} className="animate-pulse" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter aura-text uppercase italic">Otaku Sensei</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Neural Link v4.2 INFINITY EDITION</p>
        </div>
        
        <AnimatePresence>
          {isSpeaking && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.8 }}
               className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 text-pink-500 rounded-xl border border-pink-500/20 shadow-lg shadow-pink-500/10"
             >
                <Zap size={14} className="animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-widest">TRANSMITTING...</span>
             </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="flex-1 glass-panel rounded-[2.5rem] p-8 mb-6 overflow-y-auto space-y-6 relative border-2 border-slate-200 dark:border-white/5 bg-white/40 dark:bg-black/40 shadow-2xl z-20 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-3 rounded-2xl border shadow-sm ${
                m.role === 'assistant' ? 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'
              }`}>
                {m.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`max-w-[80%] p-6 rounded-[2rem] shadow-xl transition-all duration-500 ${
                m.role === 'assistant' ? 'glass-panel bg-white/80 dark:bg-black/20 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-white/10' : 'bg-gradient-to-br from-purple-600 to-pink-600 text-white aura-border border-none'
              }`}>
                <p className="text-sm font-medium leading-relaxed tracking-tight">{m.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-600">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest">Analyzing Aura...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center gap-4 group relative z-20">
        <div className="flex-1 relative flex gap-3">
          <button 
             onClick={toggleListening}
             className={`p-5 rounded-[1.5rem] border transition-all duration-500 shadow-xl ${
               isListening 
                  ? 'bg-red-500/20 border-red-500/50 text-red-500 aura-glow scale-105' 
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:text-purple-500'
             }`}
          >
            {isListening ? <Mic size={24} className="animate-pulse" /> : <MicOff size={24} />}
          </button>
          
          <div className="flex-1 relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? "Listening to your neural signal..." : "Consult the Infinite Sensei..."}
              className="w-full bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/5 p-5 rounded-[1.5rem] outline-none focus:border-purple-500/40 text-sm font-medium transition-all shadow-xl text-slate-800 dark:text-white"
            />
            <button 
              onClick={() => handleSendMessage()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl text-white shadow-2xl hover:scale-110 active:scale-95 transition-all aura-border"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
