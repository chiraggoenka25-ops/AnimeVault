"use client";

import { Bell, Search, Sparkles, Moon, Sun, Menu, ShieldCheck, Zap, X, Infinity as InfinityIcon, Activity, Cpu, Command, Globe, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ThemeSwitcher from "./ThemeSwitcher";
import { motion } from "framer-motion";

interface TopBarProps {
  onMenuClick: () => void;
  isSidebarOpen?: boolean;
}

export default function TopBar({ onMenuClick, isSidebarOpen }: TopBarProps) {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('users').select('*').eq('id', user.id).single().then(({ data }) => {
          setUserData(data);
        });
      }
    });

    const channel = supabase.channel('topbar_v4_6')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, (payload) => {
        setUserData(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const currentXP = userData?.xp || 0;
  const masteryLevel = Math.floor(currentXP / 500) + 1;

  // v4.6 Chronos Evolution Shifting Aura
  const getChronosAura = () => {
    if (currentXP >= 2000) return "from-amber-400 via-emerald-400 to-cyan-500"; // Chronos Master
    return "from-blue-500 via-purple-500 to-pink-500"; // Default Synergy
  };

  const auraGlow = getChronosAura();

  return (
    <header className="h-16 glass-panel border-b-2 border-slate-200/60 dark:border-white/10 flex items-center justify-between px-6 sticky top-0 z-50 shadow-2xl transition-all duration-1000 bg-white/95 dark:bg-black/95 backdrop-blur-3xl overflow-hidden">
      {/* v4.6 Chronos Shifting Pulse */}
      <div className={`absolute inset-0 bg-gradient-to-r ${auraGlow} opacity-[0.04] pointer-events-none animate-pulse`} />
      
      <div className="flex items-center gap-4 relative z-10">
        <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-500 dark:text-slate-400 transition-colors">
           {isSidebarOpen ? <X size={20} className="text-cyan-500" /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-3 group cursor-pointer">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 90 }}
            className={`w-10 h-10 bg-gradient-to-br ${auraGlow} rounded-xl flex items-center justify-center shadow-lg transition-all duration-700 aura-border border-none`}
          >
             <Clock size={20} className="text-white fill-white" />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter aura-text hidden sm:block uppercase italic leading-none">
              ANIME VAULT
            </h1>
            <span className="text-[7px] font-black text-cyan-500 uppercase tracking-[0.4em] mt-1 hidden sm:block animate-pulse">Chronos Link Active</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 relative z-10">
        {/* v4.6 Quick Discover Trigger */}
        <button 
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 text-slate-400 hover:text-cyan-500 hover:border-cyan-500/30 transition-all group shadow-sm"
        >
           <Search size={14} className="group-hover:scale-125 transition-transform" />
           <span className="text-[9px] font-black uppercase tracking-widest">Chronos Search</span>
           <div className="px-1.5 py-0.5 bg-slate-100 dark:bg-black rounded text-[8px] font-black border border-slate-200 dark:border-white/5">⌘K</div>
        </button>

        {/* v4.6 CHRONOS EVOLUTION Badge */}
        <motion.div 
           whileHover={{ scale: 1.05 }}
           className={`hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-50/50 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 relative overflow-hidden group shadow-xl`}
        >
           <div className={`absolute inset-0 bg-gradient-to-r ${auraGlow} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
           <div className="flex items-center gap-2 relative z-10">
              <div className={`p-1 bg-gradient-to-br ${auraGlow} rounded-md shadow-lg shadow-cyan-500/20`}>
                 <Globe size={12} className="text-white animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 italic">Structural Link</span>
                 <span className={`text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r ${auraGlow} uppercase tracking-widest`}>v4.6 CHRONOS EVOLUTION</span>
              </div>
           </div>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-3 h-full">
           <ThemeSwitcher />
           
           <button className="relative p-2.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-500 dark:text-slate-400 transition-all border-2 border-transparent hover:border-slate-200 dark:hover:border-white/5 group">
             <Bell size={20} className="group-hover:rotate-12 transition-transform" />
             <span className={`absolute top-2.5 right-2.5 w-2 h-2 bg-cyan-500 rounded-full border-2 border-white dark:border-dark-bg animate-pulse`} />
           </button>
           
           <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-1 hidden xs:block" />
           
           {userData && (
             <div className="flex items-center gap-3 pl-2">
                <div className="relative group cursor-pointer">
                  <motion.img 
                    whileHover={{ scale: 1.1, rotateY: 180 }}
                    src={userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`} 
                    className="w-10 h-10 rounded-xl object-cover border-2 border-slate-200 dark:border-white/10 shadow-2xl transition-all duration-700 group-hover:border-cyan-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-dark-bg rounded-full shadow-lg" />
                </div>
                <div className="hidden xl:flex flex-col">
                   <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter line-clamp-1">{userData.username}</p>
                   <p className="text-[8px] font-black text-cyan-600 dark:text-cyan-500 uppercase tracking-widest italic flex items-center gap-1.5">
                      <Activity size={10} className="text-cyan-500" /> SYNC LVL {masteryLevel} Chronos
                   </p>
                </div>
             </div>
           )}
        </div>
      </div>
    </header>
  );
}
