"use client";

import { motion } from "framer-motion";
import { FolderOpen, ListVideo, PenTool, Users, ArrowRight, Zap, Target, Sparkles, Infinity as InfinityIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
  };

  const quickLinks = [
    { title: "Anime Files", desc: "Manage your vault storage", icon: FolderOpen, href: "/vault/files", color: "from-purple-500/10 to-purple-600/10", iconColor: "text-purple-500" },
    { title: "Watchlist", desc: "Track your current series", icon: ListVideo, href: "/vault/watchlist", color: "from-pink-500/10 to-pink-600/10", iconColor: "text-pink-500" },
    { title: "Notes", desc: "Review and organize thoughts", icon: PenTool, href: "/vault/notes", color: "from-blue-500/10 to-blue-600/10", iconColor: "text-blue-500" },
    { title: "Community", desc: "Join the discussion", icon: Users, href: "/community", color: "from-emerald-500/10 to-emerald-600/10", iconColor: "text-emerald-500" },
  ];

  return (
    <div className="p-8 h-full flex flex-col max-w-7xl mx-auto pb-24 transition-all duration-500">
      <header className="mb-12 relative overflow-hidden p-8 rounded-[2.5rem] bg-white/5 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 shadow-xl transition-all duration-500">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full" />
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
             <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
                <span className="flex items-center gap-1.5"><InfinityIcon size={10} /> Neural Link: Synchronized v4.2</span>
             </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black mb-4 tracking-tighter text-slate-900 dark:text-white"
          >
            Welcome to the <span className="aura-text italic">SANCTUARY</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl leading-relaxed"
          >
            Your high-fidelity personal media vault is secure. Experience the Infinity Evolution with the new Studio White universal theme.
          </motion.p>
        </div>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <motion.div key={link.title} variants={itemVariants}>
              <Link href={link.href} className="block h-full group relative holographic-glow rounded-[2rem]">
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative glass-card h-full p-8 flex flex-col justify-between rounded-[2rem] border-2 border-slate-200 dark:border-white/5 group-hover:border-purple-500/30 transition-all duration-300 bg-white/60 dark:bg-black/40">
                  <div>
                    <div className={`p-4 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit mb-6 ${link.iconColor} shadow-sm group-hover:shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-black mb-2 uppercase tracking-tighter text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">{link.desc}</p>
                  </div>
                  <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-white transition-colors">
                    Access Link <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-panel rounded-[2.5rem] p-8 border-2 border-slate-200 dark:border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
             <Zap size={24} className="text-slate-200 dark:text-slate-800" />
          </div>
          <h2 className="text-2xl font-black mb-8 flex items-center uppercase tracking-tighter text-slate-900 dark:text-white">
            <span className="w-2 h-8 bg-pink-500 rounded-full mr-4 shadow-[0_0_15px_#ec4899]"></span>
            RECENT VAULT ACTIVITY
          </h2>
          <div className="text-center py-16 px-10 bg-slate-50 dark:bg-white/[0.02] rounded-[2rem] border border-slate-200 dark:border-white/5 border-dashed group group-hover:border-purple-500/30 transition-colors">
            <motion.div 
               animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }} 
               transition={{ repeat: Infinity, duration: 4 }}
            >
               <FolderOpen size={64} className="mx-auto mb-6 text-slate-400 dark:text-slate-600" />
            </motion.div>
            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase">The Archive is Silent</h3>
            <p className="text-slate-500 dark:text-slate-500 text-sm font-medium max-w-xs mx-auto">Upload your local media or sync your watchlist to activate the timeline logic.</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel rounded-[2.5rem] p-8 border-2 border-slate-200 dark:border-white/5"
        >
          <h2 className="text-2xl font-black mb-8 flex items-center uppercase tracking-tighter text-slate-900 dark:text-white">
            <span className="w-2 h-8 bg-purple-500 rounded-full mr-4 shadow-[0_0_15px_#8b5cf6]"></span>
            TRENDING FEED
          </h2>
          <div className="space-y-5">
            <div className="p-6 bg-slate-50 dark:bg-white/[0.03] rounded-3xl border border-slate-200 dark:border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[40px] pointer-events-none" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-[9px] font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 bg-pink-400/10 px-3 py-1 rounded-full border border-pink-400/20">Discussion</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tabular-nums">2H AGO</span>
              </div>
              <h4 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-200 mb-2 group-hover:text-purple-600 dark:group-hover:aura-text transition-colors uppercase italic">AOT ENDING THOUGHTS</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">The final chapter of the Jaeger trilogy has concluded. Dive into the neural debate...</p>
            </div>
            
            <div className="p-6 text-center text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/5 rounded-3xl opacity-50">
               Connect to Neural Link to see more...
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
