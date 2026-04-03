"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { User, Mail, Shield, Zap, Sparkles, Award, Star, Settings, Camera, LogOut, Activity, Cpu, Infinity as InfinityIcon, Target, Database } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const coreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
        setUserData(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const getRank = (xp: number = 0) => {
    if (xp >= 2000) return { name: "Hokage", color: "text-amber-500", bg: "bg-amber-400/10", border: "border-amber-400/20", glow: "shadow-[0_0_30px_#f59e0b]" };
    if (xp >= 1000) return { name: "Jonin", color: "text-purple-500", bg: "bg-purple-400/10", border: "border-purple-400/20", glow: "shadow-[0_0_30px_#a855f7]" };
    if (xp >= 500) return { name: "Chunin", color: "text-emerald-500", bg: "bg-emerald-400/10", border: "border-emerald-400/20", glow: "shadow-[0_0_30px_#10b981]" };
    return { name: "Genin", color: "text-blue-500", bg: "bg-blue-400/10", border: "border-blue-400/20", glow: "shadow-[0_0_30px_#3b82f6]" };
  };

  const currentXP = userData?.xp || 0;
  const rank = getRank(currentXP);

  // v4.6 Aura Core Color Map (Simulated based on aura_theme or xp)
  const getCoreColor = () => {
    if (userData?.aura_theme === 'dark') return "stroke-purple-500 fill-purple-500/10";
    if (userData?.aura_theme === 'professional') return "stroke-blue-500 fill-blue-500/10";
    return "stroke-pink-500 fill-pink-500/10";
  };

  if (loading) return (
     <div className="flex h-screen items-center justify-center bg-dark-bg">
        <InfinityIcon size={64} className="text-slate-200 dark:text-slate-800 animate-spin-slow" />
     </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen relative overflow-hidden transition-all duration-500">
      {/* v4.6 Background Chronos Ambiance */}
      <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/[0.03] blur-[150px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/[0.03] blur-[150px] rounded-full" />
      </div>

      <header className="mb-20 flex flex-col items-center text-center relative z-10 pt-10">
        <div className="relative group mb-12">
           {/* v4.6 Neural Core Activation */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             className="relative z-10 p-1 bg-white/[0.05] dark:bg-black/20 rounded-full border-4 border-slate-200 dark:border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-700 active:scale-95"
           >
              <img 
                src={userData?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username}`} 
                className="w-48 h-48 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           </motion.div>
           
           {/* Aura Core Orbitals */}
           <svg className="absolute -inset-12 w-[calc(100%+6rem)] h-[calc(100%+6rem)] pointer-events-none z-0 animate-spin-slow opacity-20">
              <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 20" className={getCoreColor()} />
              <circle cx="50%" cy="50%" r="42%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 15" className={getCoreColor()} />
           </svg>
           
           <motion.div 
             animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
             transition={{ repeat: Infinity, duration: 10 }}
             className={`absolute -bottom-4 -right-4 p-4 rounded-2xl border-4 bg-white dark:bg-black shadow-2xl z-30 flex items-center justify-center ${rank.border}`}
           >
              <Zap size={24} className={rank.color} />
           </motion.div>
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-center gap-3">
              <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">{userData?.username}</h1>
              <div className={`px-4 py-1.5 rounded-full border-4 ${rank.bg} ${rank.color} ${rank.border} ${rank.glow} font-black text-xs uppercase italic animate-pulse`}>
                 {rank.name} RANK
              </div>
           </div>
           <p className="text-slate-500 font-bold text-xl uppercase tracking-[0.2em]">{userData?.email}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        {/* v4.6 Stats Hub */}
        <div className="lg:col-span-2 space-y-10">
           <div className="glass-panel p-10 rounded-[3rem] border-2 border-slate-200 dark:border-white/10 bg-white/60 dark:bg-black/60 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10">
                 <Activity size={32} className="text-slate-200 dark:text-slate-800 animate-pulse" />
              </div>
              <h2 className="text-3xl font-black mb-10 text-slate-900 dark:text-white uppercase tracking-tighter flex items-center italic">
                 <span className="w-4 h-10 bg-purple-500 rounded-full mr-5 shadow-[0_0_20px_#8b5cf6]"></span>
                 SYNCHRONIZATION PROFILE
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { label: 'Neural Synergy', value: '100%', icon: Cpu, color: 'text-purple-500' },
                   { label: 'Vault Mastery', value: `${currentXP}XP`, icon: Target, color: 'text-amber-500' },
                   { label: 'Storage Link', value: 'Production', icon: Database, color: 'text-emerald-500' }
                 ].map(stat => (
                   <div key={stat.label} className="p-8 rounded-[2rem] bg-slate-100 dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/5 transition-all group-hover:border-purple-500/20">
                      <stat.icon size={24} className={`${stat.color} mb-4`} />
                      <div className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">{stat.value}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                   </div>
                 ))}
              </div>

              <div className="mt-10 p-10 rounded-[2.5rem] border-4 border-dashed border-slate-200 dark:border-white/10 group-hover:border-purple-500/40 transition-all transition-colors">
                 <h4 className="text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] mb-6">Mastery Badges</h4>
                 <div className="flex flex-wrap gap-4">
                    {[1,2,3,4,5].map(i => (
                       <motion.div 
                         key={i}
                         whileHover={{ scale: 1.1, rotate: 10 }}
                         className={`w-14 h-14 rounded-2xl bg-white dark:bg-black/40 border-2 border-slate-200 dark:border-white/5 flex items-center justify-center shadow-2xl relative ${i <= masteryLevel ? 'aura-border opacity-100' : 'opacity-20'}`}
                       >
                          <Award size={24} className={i <= 3 ? 'text-amber-500' : 'text-slate-400'} />
                       </motion.div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* v4.6 Profile Actions */}
        <div className="space-y-10">
           <div className="glass-panel p-10 rounded-[3rem] border-2 border-slate-200 dark:border-white/10 bg-white/60 dark:bg-black/60 shadow-2xl backdrop-blur-3xl group">
              <h2 className="text-2xl font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tighter italic">NEURAL SETTINGS</h2>
              <div className="space-y-4">
                 {[
                   { label: 'Security Link', icon: Shield, color: 'text-emerald-500' },
                   { label: 'Neural Theme', icon: Sparkles, color: 'text-purple-500' },
                   { label: 'Sensory Config', icon: Settings, color: 'text-blue-500' }
                 ].map(action => (
                   <button key={action.label} className="w-full p-6 rounded-[1.5rem] bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 flex items-center gap-4 hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all group">
                      <div className={`p-3 rounded-xl bg-slate-100 dark:bg-black/20 ${action.color} group-hover:scale-110 transition-transform`}>
                         <action.icon size={18} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{action.label}</span>
                   </button>
                 ))}
                 
                 <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/10">
                    <button className="w-full p-6 rounded-[1.5rem] bg-red-600/10 border-2 border-red-500/20 flex items-center gap-4 hover:bg-red-600 hover:text-white group transition-all">
                       <LogOut size={18} className="text-red-500 group-hover:text-white group-hover:-translate-x-2 transition-transform" />
                       <span className="text-[11px] font-black uppercase tracking-widest text-red-500 group-hover:text-white">Sever Connection</span>
                    </button>
                 </div>
              </div>
           </div>

           <div className="p-10 rounded-[3rem] bg-gradient-to-br from-purple-900/50 to-black border-2 border-purple-500/20 shadow-2xl relative overflow-hidden hidden lg:block">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full" />
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 italic">v4.6 HIGHLIGHT</h3>
              <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8 uppercase tracking-widest">Your Aura Core is currently projecting a high-fidelity sync. Synchronize more anime to unlock the next spectral threshold.</p>
              <div className="flex items-center gap-3">
                 <div className="flex -space-x-4">
                    {[1,2,3].map(i => <img key={i} src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${i*123}`} className="w-8 h-8 rounded-full border-2 border-black" />)}
                 </div>
                 <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Linked with 12 Synced Peers</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

const masteryLevel = 3; // Placeholder for logic
