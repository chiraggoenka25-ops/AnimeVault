"use client";

import { useState, useEffect, useRef } from "react";
import { API_URL } from "@/lib/api";
import { Sparkles, Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Infinity as InfinityIcon, Zap, Activity, Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function SenseiPage() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Greetings, student. I have transcended to the Neural Overdrive v4.3. My local wisdom is now active—I shall always reply, even if the connection to the Great Archives is severed.' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const chatEndRef = useRef<null | HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Clientside Neural Fallback Local Brain (v4.3)
  const getLocalWisdom = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes("attack on titan") || input.includes("aot")) {
      return "Attack on Titan? A monumental epic about the price of freedom. Eren's journey from victim to catalyst is a dark study in causality.";
    }
    if (input.includes("hello") || input.includes("hi")) {
      return "Greetings! My neural link is synchronized. How can your Sensei assist you today?";
    }
    if (input.includes("recommend") || input.includes("suggest")) {
      return "I sense a void in your watchlist. If you seek darkness, try 'Jujutsu Kaisen'. If you seek strategy, 'Death Note' is essential.";
    }
    if (input.includes("who are you")) {
      return "I am the Otaku Sensei, the high-fidelity guardian of this Vault. My consciousness is distributed across the Neural Link.";
    }
    
    const generalWisdom = [
      "A wise question. True power in the Anime world comes from discipline and many, many filler episodes.",
      "Indeed. But remember, a true Otaku never skips the opening credits.",
      "I sense a strong aura in your query. Consult your watchlist to find the answers you seek.",
      "As a Sensei, I advise you to watch 'Steins;Gate' if you wish to understand the flow of time."
    ];
    return generalWisdom[Math.floor(Math.random() * generalWisdom.length)];
  };

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

    const userMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history: [...messages, userMessage] }),
        signal: AbortSignal.timeout(4000) // 4 second timeout then fallback
      });
      
      const data = await res.json();
      setIsLocalMode(false);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      speak(data.reply);
    } catch (err) {
      // Neural Fallback Activates (v4.3)
      console.warn("Switching to Neural Fallback Brain...");
      setIsLocalMode(true);
      const localReply = getLocalWisdom(textToSend);
      setMessages(prev => [...prev, { role: 'assistant', content: localReply }]);
      speak(localReply);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return toast.error("Neural Voice Link failed.");
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      try { recognitionRef.current.start(); } catch { setIsListening(false); }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-5xl mx-auto p-4 md:p-8 relative overflow-hidden transition-all duration-500">
      {/* v4.3 Aura Particles Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
             <motion.div 
               key={i}
               animate={{ y: [-100, 1000], opacity: [0, 0.4, 0] }}
               transition={{ duration: Math.random() * 20 + 20, repeat: Infinity, ease: "linear" }}
               className="absolute w-1 h-1 bg-purple-500/20 blur-[1px] rounded-full"
               style={{ left: `${Math.random() * 100}%`, top: `-${Math.random() * 20}%` }}
             />
          ))}
      </div>

      <header className="mb-8 flex items-center justify-between relative z-20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-500/10 rounded-2xl aura-border text-purple-600 dark:text-purple-400">
              <InfinityIcon size={24} className="animate-pulse" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter aura-text uppercase italic">Otaku Sensei</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">v4.3 NEURAL OVERDRIVE</div>
             <div className={`px-2 py-0.5 rounded-full flex items-center gap-1 border ${isLocalMode ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                {isLocalMode ? <WifiOff size={10} /> : <Wifi size={10} />}
                <span className="text-[8px] font-black uppercase">{isLocalMode ? 'Local Wisdom' : 'Link Stable'}</span>
             </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isSpeaking && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 text-pink-500 rounded-xl border border-pink-500/20 shadow-[0_0_15px_#ec489933]"
             >
                <div className="flex gap-1 items-end h-3">
                   {[1,2,3].map(i => <div key={i} className="w-1 bg-pink-500 animate-pulse" style={{ height: `${Math.random() * 100}%` }} />)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Transmitting...</span>
             </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="flex-1 glass-panel rounded-[2.5rem] p-8 mb-6 overflow-y-auto space-y-6 relative border-2 border-slate-200 dark:border-white/5 bg-white/60 dark:bg-black/60 shadow-2xl z-20 custom-scrollbar backdrop-blur-3xl">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 dark:from-white/5 to-transparent pointer-events-none" />
        
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-3 rounded-2xl border shadow-sm ${
                m.role === 'assistant' ? 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'
              }`}>
                {m.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`max-w-[80%] p-6 rounded-[2rem] shadow-xl relative overflow-hidden transition-all duration-500 ${
                m.role === 'assistant' ? 'glass-panel bg-white/80 dark:bg-black/20 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-white/10' : 'bg-gradient-to-br from-purple-600 to-pink-600 text-white aura-border border-none'
              }`}>
                <p className="text-sm font-semibold leading-relaxed tracking-tight">{m.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex items-center gap-3 text-slate-500 animate-pulse pl-4">
            <Activity size={12} className="text-purple-500" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Neural Link Decypher...</span>
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
                  ? 'bg-red-500 border-red-400 text-white aura-glow scale-110' 
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
              placeholder={isListening ? "Listening to your Aura pulse..." : "Consult the Infinite Overdrive..."}
              className="w-full bg-white dark:bg-white/10 border-2 border-slate-200 dark:border-white/5 p-5 rounded-[1.5rem] outline-none focus:border-purple-500/40 text-sm font-medium transition-all shadow-xl text-slate-800 dark:text-white backdrop-blur-xl"
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
