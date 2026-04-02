"use client";

import { useState, useEffect, useRef } from "react";
import { API_URL } from "@/lib/api";
import { Sparkles, Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Infinity as InfinityIcon, Zap, Activity, Wifi, WifiOff, Cpu, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function SenseiPage() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Neural Link: Synchronized v4.5 MASTER EDITION. My synergy is at peak vibrancy. Direct your inquiries to the core, student.' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const chatEndRef = useRef<null | HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const historyRef = useRef<string[]>([]);

  const KNOWLEDGE_BASE = {
    SHONEN: {
      keywords: ["naruto", "one piece", "dragon ball", "hero academia", "boruto", "luffy", "zoro", "ninja", "power", "spirit"],
      replies: [
        "A true Shonen spirit! Like a pirate seeking the One Piece, you must pursue your anime goals with indomitable will.",
        "Your question has the force of a Rasengan. I sense you enjoy tales of friendship and heroic growth.",
        "To reaches the rank of Hokage, one must first master the art of the perfect watchlist. You are on the right path."
      ]
    },
    DARK_SEINEN: {
      keywords: ["attack on titan", "aot", "berserk", "death note", "tokyo ghoul", "gritty", "dark", "titan", "eren"],
      replies: [
        "Ah, the philosophical darkness... Just as Eren sought freedom, your vault is a sanctuary for the truth behind the walls.",
        "Psychological depth is rare. Death Note teaches us that true power lies in the pen, or in our case, the Vault logs.",
        "Such grit! Guts himself would find your interest in high-fidelity storytelling quite impressive."
      ]
    },
    ADVENTURE: {
      keywords: ["ghibli", "spirited away", "totoro", "world", "journey", "beautiful", "scenery", "studio"],
      replies: [
        "Studio Ghibli's magic is unparalleled. Your vault should be a garden of such beautiful, timeless journeys.",
        "Moving castle or a forest spirit? Your aura suggests you seek wonders beyond the mundane world.",
        "Enchanting. Like Chihiro in the spirit realm, you are currently navigating the deepest chambers of the Vault."
      ]
    },
    MECHA_SCI_FI: {
      keywords: ["gundam", "evangelion", "mech", "robot", "cyber", "neural", "sci-fi", "space", "future"],
      replies: [
        "Neural sync active! Is your spirit piloting a Gundam, or are you just here for the high-fidelity data?",
        "Evangelion's depth is like our Neural Link—complex and full of hidden layers. Synchronizing now.",
        "To understand the future, one must first look at the classics of space opera and Mecha philosophy."
      ]
    }
  };

  const getSynergyResponse = (userInput: string) => {
    const text = userInput.toLowerCase();
    if (text.includes("hello") || text.includes("hi") || text.includes("great")) {
       return "Greetings, student. My neural mastery is at 100%. I am ready for our consultation.";
    }
    let bestCategory = null;
    for (const [key, category] of Object.entries(KNOWLEDGE_BASE)) {
      if (category.keywords.some(k => text.includes(k))) {
        bestCategory = key;
        break;
      }
    }
    const pool = (bestCategory ? (KNOWLEDGE_BASE as any)[bestCategory].replies : [
      "I have analyzed your query through the 44th chamber of the Vault. My advice? watch more anime.",
      "A mysterious question. Let us delve deeper into the Neural Link.",
      "Indeed. But remember, a true Otaku is measured by the quality of their reviews.",
      "As a Sensei, I sense that you are on the verge of a magnificent discovery."
    ]);
    const freshChoices = pool.filter((msg: string) => !historyRef.current.includes(msg));
    const finalPool = freshChoices.length > 0 ? freshChoices : pool;
    const finalReply = finalPool[Math.floor(Math.random() * finalPool.length)];
    historyRef.current = [finalReply, ...historyRef.current].slice(0, 3);
    return finalReply;
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
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history: messages }),
        signal: AbortSignal.timeout(3500)
      });
      const data = await res.json();
      setIsLocalMode(false);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      speak(data.reply);
    } catch (err) {
      setIsLocalMode(true);
      const synergyReply = getSynergyResponse(textToSend);
      setMessages(prev => [...prev, { role: 'assistant', content: synergyReply }]);
      speak(synergyReply);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return toast.error("Neural Voice Link failed.");
    if (isListening) recognitionRef.current.stop();
    else {
      setIsListening(true);
      try { recognitionRef.current.start(); } catch { setIsListening(false); }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-5xl mx-auto p-4 md:p-8 relative overflow-hidden transition-all duration-500">
      {/* v4.5 Aura Particles Background (Vibrant) */}
      <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
             <motion.div 
               key={i}
               className="absolute w-1.5 h-1.5 bg-purple-500/30 blur-[2px] rounded-full aura-particle"
               style={{ left: `${Math.random() * 100}%`, top: `100%`, animationDelay: `${Math.random() * 15}s`, animationDuration: `${Math.random() * 10 + 10}s` }}
             />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.05] dark:from-purple-500/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
      </div>

      <header className="mb-8 flex items-center justify-between relative z-20">
        <div className="group">
          <div className="flex items-center gap-3 mb-2">
            <motion.div 
               animate={loading || isSpeaking ? { 
                 scale: [1, 1.25, 1], 
                 rotateY: [0, 180, 360],
                 boxShadow: ["0 0 10px rgba(139,92,246,0.3)", "0 0 50px rgba(139,92,246,0.8)", "0 0 10px rgba(139,92,246,0.3)"] 
               } : {}}
               transition={{ repeat: Infinity, duration: 2 }}
               className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl aura-border text-white shadow-2xl transition-transform cursor-crosshair active:scale-90"
            >
              <Cpu size={28} />
            </motion.div>
            <div className="flex flex-col">
               <h1 className="text-4xl font-black tracking-tighter aura-text uppercase italic leading-none">OTAKU SENSEI</h1>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">SYNERGERY v4.5 MASTER EDITION</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
             <div className={`px-4 py-1 rounded-full flex items-center gap-2 border transition-all duration-500 shadow-2xl ${isLocalMode ? 'bg-orange-500/20 text-orange-600 border-orange-500/30' : 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'}`}>
                {isLocalMode ? <WifiOff size={12} className="animate-pulse" /> : <Activity size={12} className="animate-bounce" />}
                <span className="text-[9px] font-black uppercase tracking-widest">{isLocalMode ? 'LOCAL SEMANTIC ENGINE' : 'NEURAL LINK: SYNCHRONIZED'}</span>
             </div>
             {isSpeaking && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-pink-500 font-black text-[9px] uppercase tracking-widest"
                >
                   <Terminal size={14} className="animate-pulse" /> Direct Audio Feed
                </motion.div>
             )}
          </div>
        </div>
      </header>

      <div className="flex-1 glass-panel rounded-[2.5rem] p-8 mb-6 overflow-y-auto space-y-6 relative border-2 border-purple-500/10 dark:border-white/10 bg-white/90 dark:bg-black/95 shadow-[0_0_50px_rgba(0,0,0,0.3)] z-20 custom-scrollbar backdrop-blur-3xl animate-flicker">
        {/* Cinematic Scanlines Layer (More Intense for Mastery) */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.08] dark:opacity-[0.15] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.05),rgba(0,0,255,0.1))] bg-[length:100%_3px,4px_100%]" />
        
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className={`flex items-start gap-5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-4 rounded-2xl border-2 transition-all duration-500 ${
                m.role === 'assistant' 
                  ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30 text-purple-600 dark:text-purple-400 shadow-[0_0_20px_rgba(139,92,246,0.2)]' 
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 shadow-sm'
              }`}>
                {m.role === 'assistant' ? <Bot size={24} className="animate-pulse" /> : <User size={24} />}
              </div>
              <div className={`max-w-[75%] p-7 rounded-[2.2rem] shadow-2xl relative overflow-hidden transition-all duration-500 border-2 ${
                m.role === 'assistant' 
                  ? 'bg-white dark:bg-white/[0.03] text-slate-800 dark:text-slate-100 border-purple-500/30 shadow-purple-500/10' 
                  : 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-transparent aura-border shadow-[0_10px_30px_rgba(139,92,246,0.4)]'
              }`}>
                <p className="text-sm font-bold leading-relaxed tracking-tight relative z-10 antialiased">{m.content}</p>
                {m.role === 'assistant' && (
                  <div className="absolute -bottom-4 -right-4 opacity-5 rotate-12 scale-150 pointer-events-none">
                     <InfinityIcon size={80} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center gap-4 group relative z-20 pb-4">
        <div className="flex-1 relative flex gap-4">
          <button 
             onClick={toggleListening}
             className={`p-6 rounded-[2rem] border-2 transition-all duration-500 shadow-2xl ${
               isListening 
                  ? 'bg-red-600 border-red-500 text-white scale-110 shadow-red-500/40 rotate-12' 
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:text-purple-600 hover:border-purple-500/40 hover:rotate-3'
             }`}
          >
            {isListening ? <Mic size={28} className="animate-pulse" /> : <MicOff size={28} />}
          </button>
          
          <div className="flex-1 relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? "Listening to your neural signal..." : "Direct Message to Sensory Core..."}
              className="w-full bg-white dark:bg-white/10 border-2 border-slate-200 dark:border-white/20 p-6 rounded-[2rem] outline-none focus:border-purple-500/60 text-base font-bold transition-all shadow-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:shadow-[0_0_40px_rgba(139,92,246,0.2)]"
            />
            <button 
              onClick={() => handleSendMessage()}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl text-white shadow-2xl hover:scale-110 active:scale-95 transition-all aura-border border-none group"
            >
              <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
