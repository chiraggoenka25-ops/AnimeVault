"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, ListVideo, PenTool, Users, ArrowRight, Zap, Target, Sparkles, Infinity as InfinityIcon, Activity, Globe, Cpu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerItems = [
    "Hokage_Luffy just synchronized his Watchlist from the Tokyo Server...",
    "Jonin_Eren updated his Notes on 'The Final Season'...",
    "Neural Link v4.5 MASTER EDITION is now broadcasting globally...",
    "New Character Pin added by user Chirag2...",
    "Aura Frequency stabilized at 100% Synergy...",
    "Otaku Sensei is currently consulting 14 students..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
  };

  const quickLinks = [
    { title: "Anime Files", desc: "Manage your vault storage", icon: FolderOpen, href: "/vault/files", color: "from-purple-500/15 to-purple-600/15", iconColor: "text-purple-600 dark:text-purple-400" },
    { title: "Watchlist", desc: "Track your current series", icon: ListVideo, href: "/vault/watchlist", color: "from-pink-500/15 to-pink-600/15", iconColor: "text-pink-600 dark:text-pink-400" },
    { title: "Notes", desc: "Review and organize thoughts", icon: PenTool, href: "/vault/notes", color: "from-blue-500/15 to-blue-600/15", iconColor: "text-blue-600 dark:text-blue-400" },
    { title: "Community", desc: "Join the discussion", icon: Users, href: "/community", color: "from-emerald-500/15 to-emerald-600/15", iconColor: "text-emerald-600 dark:text-emerald-400" },
  ];

  return (
    <div className="p-8 h-full flex flex-col max-w-7xl mx-auto pb-24 transition-all duration-500">
      
      {/* v4.5 Live Neural Ticker */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-10 glass-panel rounded-full mb-8 flex items-center px-6 overflow-hidden border-2 border-purple-500/20 bg-white/40 dark:bg-black/40 shadow-[0_0_15px_rgba(139,92,246,0.1)] group cursor-pointer"
      >
         <div className="flex items-center gap-3 shrink-0 mr-6">
            <Globe size={14} className="text-purple-500 animate-spin-slow" />
            <span className="text-[9px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">Live Link Dashboard:</span>
         </div>
         <div className="flex-1 relative h-full">
            <AnimatePresence mode="wait">
               <motion.p 
                 key={tickerIndex}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight flex items-center h-full"
               >
                 {tickerItems[tickerIndex]}
               </motion.p>
            </AnimatePresence>
         </div>
         <div className="flex items-center gap-2 shrink-0 ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[8px] font-black uppercase text-emerald-500 tracking-tighter">Production Link Stable</span>
         </div>
      </motion.div>

      <header className="mb-12 relative overflow-hidden p-10 rounded-[3rem] bg-white/40 dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/10 shadow-2xl transition-all duration-500">
        <div className="absolute top-0 right-0 p-8 flex flex-col items-end">
           <div className="flex gap-1.5 mb-2">
              {[1,2,3].map(i => <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="w-1 h-4 bg-purple-500/50 rounded-full" />)}
           </div>
           <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.5em]">High-Fidelity Neural Core</span>
        </div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[90px] rounded-full animate-pulse" />
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
             <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-amber-500/20 border-2 border-purple-500/30 text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 shadow-xl shadow-purple-500/5 hover:scale-105 transition-transform group cursor-pointer">
                <span className="flex items-center gap-2 relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                   <Sparkles size={12} className="text-amber-500" /> Neural Sanctuary: v4.5 MASTER EDITION
                </span>
             </div>
             <div className="h-[1px] w-12 bg-slate-300 dark:bg-white/10" />
             <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase italic">Refinement Level: PEAK</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl font-black mb-6 tracking-tighter text-slate-900 dark:text-white leading-none"
          >
            THE <span className="aura-text italic">SANCTUARY</span> EXPERIENCE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-xl font-bold max-w-2xl leading-relaxed tracking-tight"
          >
            Welcome to the final evolution of your personal vault. Experience high-fidelity neural synchronization at the edge of the Metaverse.
          </motion.p>
        </div>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
      >
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <motion.div key={link.title} variants={itemVariants}>
              <Link href={link.href} className="block h-full group relative holographic-glow rounded-[2.5rem]">
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="relative glass-card h-full p-10 flex flex-col justify-between rounded-[2.5rem] border-2 border-slate-200 dark:border-white/5 group-hover:border-purple-500/40 transition-all duration-300 bg-white/70 dark:bg-black/90 shadow-2xl backdrop-blur-3xl">
                  <div>
                    <div className={`p-5 bg-slate-100 dark:bg-white/5 rounded-[1.5rem] w-fit mb-8 ${link.iconColor} shadow-inner group-hover:shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-slate-200 dark:border-white/5`}>
                      <Icon size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed mb-8">{link.desc}</p>
                  </div>
                  <div className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600 group-hover:text-purple-600 dark:group-hover:text-white transition-colors">
                    Establish Link <ArrowRight size={16} className="ml-3 group-hover:translate-x-3 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-panel rounded-[3rem] p-10 border-2 border-slate-200 dark:border-white/5 relative overflow-hidden bg-white/50 dark:bg-black/70 backdrop-blur-3xl shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-10">
             <Cpu size={32} className="text-slate-200 dark:text-slate-800 animate-spin-slow" />
          </div>
          <h2 className="text-3xl font-black mb-10 flex items-center uppercase tracking-tighter text-slate-900 dark:text-white">
            <span className="w-3 h-10 bg-pink-500 rounded-full mr-5 shadow-[0_0_20px_#ec4899]"></span>
            RECENT ARCHIVE LOGS
          </h2>
          <div className="text-center py-20 px-12 bg-slate-100 dark:bg-white/[0.02] rounded-[2.5rem] border-2 border-slate-200 dark:border-white/5 border-dashed group group-hover:border-purple-500/40 transition-all duration-500 hover:shadow-inner">
            <motion.div 
               animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3], rotateY: [0, 180, 360] }} 
               transition={{ repeat: Infinity, duration: 6 }}
            >
               <FolderOpen size={72} className="mx-auto mb-8 text-slate-300 dark:text-slate-600" />
            </motion.div>
            <h3 className="text-xl font-black text-slate-700 dark:text-slate-400 mb-3 uppercase tracking-tight">The Core is Primed</h3>
            <p className="text-slate-500 dark:text-slate-500 text-sm font-bold max-w-sm mx-auto leading-relaxed">Neural Activity detected. Initiate a Watchlist Sync to populate your global timeline.</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel rounded-[3rem] p-10 border-2 border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/70 backdrop-blur-3xl shadow-2xl"
        >
          <h2 className="text-3xl font-black mb-10 flex items-center uppercase tracking-tighter text-slate-900 dark:text-white">
            <span className="w-3 h-10 bg-purple-500 rounded-full mr-5 shadow-[0_0_20px_#8b5cf6]"></span>
            TRENDING
          </h2>
          <div className="space-y-6">
            <div className="p-8 bg-slate-100 dark:bg-white/[0.04] rounded-[2rem] border-2 border-slate-200 dark:border-white/5 hover:border-purple-500/50 transition-all group cursor-pointer relative overflow-hidden shadow-xl hover:shadow-purple-500/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] pointer-events-none" />
              <div className="flex items-center justify-between mb-5 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 bg-pink-500/10 px-4 py-1.5 rounded-full border-2 border-pink-500/20">NEURAL DEBATE</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tabular-nums">LIVE NOW</span>
              </div>
              <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-200 mb-3 group-hover:text-purple-600 dark:group-hover:aura-text transition-colors uppercase italic leading-tight">SOLO LEVELING: THE FINALE</h4>
              <p className="text-sm text-slate-500 dark:text-slate-500 font-bold leading-relaxed line-clamp-3">The system has evolved. Witness the final synchronization of Jinwoo's neural core as we analyze every frame...</p>
            </div>
            
            <button className="w-full py-4 rounded-[1.5rem] border-2 border-slate-200 dark:border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600 hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/30 transition-all shadow-sm">
               LOAD GLOBAL FEED
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
