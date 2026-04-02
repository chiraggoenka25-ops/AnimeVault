"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { API_URL } from "@/lib/api";
import { Sparkles, Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Infinity as InfinityIcon, Zap, Activity, Wifi, WifiOff, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function SenseiPage() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Neural Link: Synchronized v4.4 SYNERGY. I am your Otaku Sensei, now with a multi-layered semantic brain. Ask your questions, student.' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const chatEndRef = useRef<null | HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const historyRef = useRef<string[]>([]);

  // v4.4 Advanced Semantic Knowledge Repository
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
    
    // Greetings Logic
    if (text.includes("hello") || text.includes("hi") || text.includes("great")) {
       return "Greetings, student. My neural synergy is at 100%. I am ready for our consultation.";
    }

    // 1. Find the best matching category
    let bestCategory = null;
    for (const [key, category] of Object.entries(KNOWLEDGE_BASE)) {
      if (category.keywords.some(k => text.includes(k))) {
        bestCategory = key;
        break;
      }
    }

    // 2. Pick a reply (Avoiding history repeats)
    const activeCategory = bestCategory ? (KNOWLEDGE_BASE as any)[bestCategory] : null;
    const pool = activeCategory ? activeCategory.replies : [
      "I have analyzed your query through the 44th chamber of the Vault. My advice? Watch more anime to broaden your spirit.",
      "A mysterious question. Like a plot twist in a thriller, I did not expect this query. Let us delve deeper into the Neural Link.",
      "Indeed. But remember, a true Otaku is measured by the quality of their reviews, not just the quantity.",
      "As a Sensei, I sense that you are on the verge of a magnificent discovery in your watchlist."
    ];

    // Filter out recently used messages
    const freshChoices = pool.filter((msg: string) => !historyRef.current.includes(msg));
    const finalPool = freshChoices.length > 0 ? freshChoices : pool;
    const finalReply = finalPool[Math.floor(Math.random() * finalPool.length)];

    // 3. Update history (Last 3 only)
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

    const userMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history: [...messages, userMessage] }),
        signal: AbortSignal.timeout(3500)
      });
      
      const data = await res.json();
      setIsLocalMode(false);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      speak(data.reply);
    } catch (err) {
      // v4.4 Synergy Fallback
      setIsLocalMode(true);
      const synergyReply = getSynergyResponse(textToSend);
      setMessages(prev => [...prev, { role: 'assistant', content: synergyReply }]);
      speak(synergyReply);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return toast.error("Neural Voice Link not found.");
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      try { recognitionRef.current.start(); } catch { setIsListening(false); }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-5xl mx-auto p-4 md:p-8 relative overflow-hidden transition-all duration-500">
      {/* v4.4 Aura Particles Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(15)].map((_, i) => (
             <motion.div 
               key={i}
               className="absolute w-1 h-1 bg-purple-500/10 blur-[1px] rounded-full aura-particle"
               style={{ left: `${Math.random() * 100}%`, top: `100%`, animationDelay: `${Math.random() * 10}s`, animationDuration: `${Math.random() * 10 + 10}s` }}
             />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-transparent pointer-events-none" />
      </div>

      <header className="mb-8 flex items-center justify-between relative z-20">
        <div className="group">
          <div className="flex items-center gap-3 mb-2">
            <motion.div 
               animate={loading || isSpeaking ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0], boxShadow: ["0 0 0px 0px rgba(139,92,246,0)", "0 0 30px 10px rgba(139,92,246,0.3)", "0 0 0px 0px rgba(139,92,246,0)"] } : {}}
               transition={{ repeat: Infinity, duration: 2 }}
               className="p-3 bg-purple-500/10 rounded-2xl aura-border text-purple-600 dark:text-purple-400 cursor-pointer"
            >
              <Cpu size={24} className="group-hover:rotate-180 transition-transform duration-1000" />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tighter aura-text uppercase italic">SYNERGY SENSEI</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">v4.4 NEURAL SYNERGY EDITION</div>
             <div className={`px-2 py-0.5 rounded-full flex items-center gap-1 border transition-all ${isLocalMode ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/5' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-lg shadow-emerald-500/5'}`}>
                {isLocalMode ? <WifiOff size={10} /> : <Wifi size={10} />}
                <span className="text-[8px] font-black uppercase">{isLocalMode ? 'Local Semantic' : 'Link Synchronized'}</span>
             </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isSpeaking && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 text-pink-500 rounded-xl border border-pink-500/20 shadow-lg"
             >
                <Activity size={12} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">TRANSMITTING...</span>
             </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="flex-1 glass-panel rounded-[2.5rem] p-8 mb-6 overflow-y-auto space-y-6 relative border-2 border-slate-200 dark:border-white/5 bg-white/60 dark:bg-black/80 shadow-2xl z-20 custom-scrollbar backdrop-blur-3xl animate-flicker">
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-4 rounded-2xl border shadow-sm ${
                m.role === 'assistant' ? 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'
              }`}>
                {m.role === 'assistant' ? <Bot size={22} /> : <User size={22} />}
              </div>
              <div className={`max-w-[80%] p-6 rounded-[2rem] shadow-xl relative overflow-hidden transition-all duration-500 border-2 ${
                m.role === 'assistant' ? 'glass-panel bg-white/90 dark:bg-transparent text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10' : 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-transparent aura-border'
              }`}>
                {m.role === 'assistant' && (
                   <div className="absolute top-0 right-0 p-2 opacity-5">
                      <Sparkles size={48} />
                   </div>
                )}
                <p className="text-sm font-bold leading-relaxed tracking-tight relative z-10">{m.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center gap-4 group relative z-20">
        <div className="flex-1 relative flex gap-3">
          <button 
             onClick={toggleListening}
             className={`p-5 rounded-[1.5rem] border transition-all duration-500 shadow-xl ${
               isListening 
                  ? 'bg-red-500 border-red-400 text-white aura-glow scale-110 rotate-12' 
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
              placeholder={isListening ? "Listening to your neural synergy pulse..." : "Consult the v4.4 Synergy Brain..."}
              className="w-full bg-white dark:bg-white/10 border-2 border-slate-200 dark:border-white/10 p-5 rounded-[1.5rem] outline-none focus:border-purple-500/40 text-sm font-medium transition-all shadow-xl text-slate-800 dark:text-white backdrop-blur-3xl"
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
