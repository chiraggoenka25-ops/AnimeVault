"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Zap, Calendar, Award, MessageCircle, ListVideo, Sparkles, Activity, Clock, ShieldCheck, Infinity as InfinityIcon, Trophy, Cpu, ChevronRight } from "lucide-react";

export default function StatsPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [userRes, notesRes, watchlistRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        supabase.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('watchlist').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ]);

      setUserData(userRes.data);

      // Build Chronos History
      const events: any[] = [];
      
      // Notes events
      notesRes.data?.forEach(n => events.push({ 
        type: 'note', 
        title: 'Neural Insight Written', 
        desc: n.content.substring(0, 50) + '...', 
        date: new Date(n.created_at), 
        icon: MessageCircle, 
        color: 'text-blue-500', 
        bg: 'bg-blue-500/10' 
      }));

      // Watchlist events
      watchlistRes.data?.forEach(w => events.push({ 
        type: 'sync', 
        title: 'Anime Link Synchronized', 
        desc: `Added ${w.anime_title} to the Sanctuary...`, 
        date: new Date(w.created_at), 
        icon: ListVideo, 
        color: 'text-purple-500', 
        bg: 'bg-purple-500/10' 
      }));

      // Level-up milestones (Simulated based on XP)
      if (userRes.data?.xp > 0) {
        events.push({ 
          type: 'rank', 
          title: 'Mastery Rank Synchronized', 
          desc: `Reached ${userRes.data.xp}XP Neural Threshold...`, 
          date: new Date(Date.now() - 86400000), 
          icon: Zap, 
          color: 'text-amber-500', 
          bg: 'bg-amber-500/10' 
        });
      }

      // Initial Join event
      events.push({ 
        type: 'join', 
        title: 'Initial Neural Link Established', 
        desc: 'Sanctuary core was first initialized.', 
        date: new Date(userRes.data?.created_at || Date.now()), 
        icon: ShieldCheck, 
        color: 'text-emerald-500', 
        bg: 'bg-emerald-500/10' 
      });

      setHistory(events.sort((a,b) => b.date.getTime() - a.date.getTime()));
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen relative overflow-hidden transition-all duration-500 pb-24">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-purple-500/[0.03] to-transparent pointer-events-none" />
      <div className="absolute -right-64 top-40 w-96 h-96 bg-blue-500/[0.03] blur-[100px] pointer-events-none rounded-full" />

      <header className="mb-20 flex flex-col items-center text-center relative z-10 pt-10">
        <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="p-5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2rem] text-white shadow-2xl mb-8 relative group cursor-pointer active:scale-95 transition-transform"
        >
           <Activity size={48} className="animate-pulse" />
           <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-black rounded-full" />
        </motion.div>
        
        <div className="flex items-center gap-4 mb-4">
           <div className="px-5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400 aura-text">
              v4.6 Chronos Evolution
           </div>
        </div>
        
        <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none mb-4">THE CHRONOS <span className="aura-text">HUB</span></h1>
        <p className="text-slate-500 dark:text-slate-500 font-bold text-lg max-w-xl leading-relaxed tracking-tight">Your neural journey through the vault. Every sync, every insight, and every rank-up archived in real-time.</p>
        
        <div className="grid grid-cols-3 gap-8 mt-12 w-full max-w-3xl">
           {[
             { label: 'Neural Syncs', value: history.filter(e => e.type === 'sync').length, icon: ListVideo, color: 'text-purple-500' },
             { label: 'Vault Mastery', value: userData?.xp || 0, icon: Zap, color: 'text-amber-500' },
             { label: 'Chronos Orbs', value: history.length, icon: Activity, color: 'text-blue-500' }
           ].map(stat => (
             <motion.div 
                key={stat.label}
                whileHover={{ y: -5 }}
                className="p-8 glass-panel rounded-[2.5rem] border-2 border-slate-200 dark:border-white/5 bg-white/40 dark:bg-black/40 shadow-2xl"
             >
                <stat.icon size={24} className={`${stat.color} mx-auto mb-4`} />
                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
             </motion.div>
           ))}
        </div>
      </header>

      <section className="relative max-w-2xl mx-auto pl-10 md:pl-0">
        {/* Timeline Desktop Center Thread */}
        <div className="hidden md:block absolute left-1/2 top-4 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-20 -translate-x-1/2" />
        {/* Mobile Left Thread */}
        <div className="md:hidden absolute left-3 top-4 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-20" />

        <div className="space-y-16">
          <AnimatePresence>
            {loading ? (
              <div className="flex flex-col items-center gap-4 py-20">
                 <InfinityIcon size={64} className="text-slate-200 dark:text-slate-800 animate-spin-slow" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Archiving Neural History...</span>
              </div>
            ) : history.map((event, idx) => {
              const Icon = event.icon;
              const isEven = idx % 2 === 0;

              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: idx * 0.1 }}
                  className={`flex items-center gap-8 ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} relative`}
                >
                  {/* Timeline Glow Orb */}
                  <div className="absolute left-[11px] md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-1/2 w-4 h-4 bg-white dark:bg-black border-4 border-purple-500 rounded-full shadow-[0_0_20px_#8b5cf6] z-20" />
                  
                  {/* Event Content Card */}
                  <div className={`w-full md:w-[45%] group`}>
                    <div className="glass-panel p-8 rounded-[2.5rem] border-2 border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/60 shadow-2xl backdrop-blur-3xl transition-all duration-500 hover:scale-[1.03] hover:border-purple-500/40 opacity-90 hover:opacity-100">
                      <div className="flex items-center justify-between mb-5">
                        <div className={`p-4 rounded-2xl ${event.bg} ${event.color} shadow-lg shadow-purple-500/5 group-hover:rotate-12 transition-transform`}>
                           <Icon size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col items-end">
                           <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 backdrop-blur-sm">
                              <Clock size={11} /> {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                           </div>
                           <span className="text-[8px] font-bold text-purple-500 uppercase tracking-widest mt-1 opacity-60">Verified Link</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight mb-3 italic">{event.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed mb-6 line-clamp-2">{event.desc}</p>
                      
                      <div className="flex items-center gap-3 pt-5 border-t border-slate-100 dark:border-white/5">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Link Verified 100% Synergy</span>
                        <ChevronRight size={14} className="ml-auto text-slate-300 dark:text-slate-600 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Empty space for desktop side balance */}
                  <div className="hidden md:block w-[45%]" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* Mastery Threshold Call-to-action */}
      <footer className="mt-32 text-center group">
         <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="relative inline-block"
         >
           <div className="absolute inset-0 bg-purple-500/10 blur-[100px] animate-pulse rounded-full" />
           <div className="relative z-10 glass-panel p-10 rounded-[3rem] border-2 border-slate-200 dark:border-white/10 bg-white/40 dark:bg-black/60 shadow-2xl">
              <Sparkles className="mx-auto mb-6 text-amber-500" size={48} />
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Mastery Awaits</h3>
              <p className="text-slate-500 dark:text-slate-500 font-bold mb-10 max-w-md mx-auto">Complete more neural synchronizations to unlock deeper Chronos insights and high-fidelity ranking beads.</p>
              <button className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all aura-border">
                 Evolve Sanctuary Link
              </button>
           </div>
         </motion.div>
      </footer>
    </div>
  );
}
