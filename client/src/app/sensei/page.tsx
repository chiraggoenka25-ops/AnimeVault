"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Loader2, Star, Ghost, Wand2 } from "lucide-react";
import { apiClient } from "@/lib/api";

type Suggestion = {
  title: string;
  reason: string;
  image: string;
};

export default function SenseiPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAi, setIsAi] = useState(false);

  async function getRecommendations() {
    setLoading(true);
    try {
      const res = await apiClient.post('/ai/recommendations');
      setMessage(res.data.message);
      setSuggestions(res.data.recommendations);
      setIsAi(res.data.isAi);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRecommendations();
  }, []);

  return (
    <div className="p-8 h-full flex flex-col relative w-full overflow-y-auto custom-scrollbar">
       <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] -z-10" />
       <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-600/10 rounded-full blur-[150px] -z-10" />

       <header className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-600/20 border border-purple-500/30 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)]">
               <Brain size={32} className="text-purple-400" />
            </div>
            <div>
               <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-400 to-pink-500 tracking-tighter">
                  Otaku Sensei
               </h1>
               <p className="text-slate-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                 <Sparkles size={14} className="text-yellow-400" /> Your Personal AI Advisor
               </p>
            </div>
          </div>
       </header>

       {loading ? (
         <div className="m-auto flex flex-col items-center gap-4">
            <Loader2 size={48} className="text-purple-500 animate-spin" />
            <p className="text-slate-400 font-bold animate-pulse uppercase tracking-[0.3em] text-xs">Analyzing your soul...</p>
         </div>
       ) : (
         <div className="space-y-12">
            {/* Sensei's Note */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="glass-panel p-8 rounded-[2rem] border-purple-500/20 relative group shadow-2xl"
            >
               <div className="absolute top-4 right-6 p-2 bg-purple-500/10 rounded-lg text-purple-400 text-[10px] uppercase font-black">
                 {isAi ? "Direct AI Output" : "Simulated Engine"}
               </div>
               <div className="flex gap-6 items-start">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    🍜
                  </div>
                  <div className="flex-1">
                     <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        Sensei's Hot Take <Ghost size={18} className="text-slate-500" />
                     </h3>
                     <p className="text-slate-400 leading-relaxed text-lg font-medium italic">
                        "{message}"
                     </p>
                  </div>
               </div>
            </motion.div>

            {/* Recommendations Grid */}
            <div>
               <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-black text-white">Curated Recommendations</h2>
                  <div className="h-px bg-white/10 flex-1" />
                  <button onClick={getRecommendations} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-purple-400">
                    <Wand2 size={20} />
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {suggestions.map((s, idx) => (
                   <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-panel rounded-3xl overflow-hidden group border-white/5 hover:border-purple-500/30 transition-all hover:-translate-y-2 shadow-xl"
                   >
                      <div className="h-48 overflow-hidden relative">
                         <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D15] via-transparent to-transparent opacity-60" />
                      </div>
                      <div className="p-6">
                         <h4 className="text-lg font-black text-white mb-3 truncate">{s.title}</h4>
                         <p className="text-slate-500 text-sm leading-relaxed mb-4">{s.reason}</p>
                         <button className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5 underline-offset-4 hover:underline">
                           Add to Watchlist +
                         </button>
                      </div>
                   </motion.div>
                 ))}
               </div>
            </div>
         </div>
       )}
    </div>
  );
}
