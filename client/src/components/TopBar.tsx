"use client";

import { Bell, Search, Sparkles, Moon, Sun, Menu, ShieldCheck, Zap, X, Infinity as InfinityIcon, Activity, Cpu, Command } from "lucide-react";
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

    const channel = supabase.channel('topbar_v4_5')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, (payload) => {
        setUserData(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const currentXP = userData?.xp || 0;
  const masteryLevel = Math.floor(currentXP / 500) + 1;

  // v4.5 Adaptive Mastery Glow Colors
  const getMasteryColor = () => {
    if (currentXP >= 2000) return "from-amber-400 to-orange-600"; // Hokage Gold
    if (currentXP >= 1000) return "from-purple-500 to-pink-600"; // Jonin Purple
    if (currentXP >= 500) return "from-emerald-500 to-teal-600"; // Chunin Emerald
    return "from-blue-500 to-cyan-600"; // Genin Blue
  };

  const masteryColor = getMasteryColor();

  return (
    <header className="h-16 glass-panel border-b-2 border-slate-200/50 dark:border-white/10 flex items-center justify-between px-6 sticky top-0 z-50 shadow-2xl transition-all duration-700 bg-white/90 dark:bg-black/95 backdrop-blur-3xl overflow-hidden">
      {/* v4.5 Master Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-r ${masteryColor} opacity-[0.03] pointer-events-none transition-all duration-1000`} />
      
      <div className="flex items-center gap-4 relative z-10">
        <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-500 dark:text-slate-400 transition-colors">
           {isSidebarOpen ? <X size={20} className="text-purple-500" /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-3 group cursor-pointer">
          <motion.div 
            whileHover={{ rotateY: 180 }}
            className={`w-10 h-10 bg-gradient-to-br ${masteryColor} rounded-xl flex items-center justify-center shadow-lg transition-all duration-500`}
          >
             <Zap size={20} className="text-white fill-white" />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter aura-text hidden sm:block uppercase italic leading-none">
              ANIME VAULT
            </h1>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1 hidden sm:block">Sanctuary Core Sync</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 relative z-10">
        {/* v4.5 Neural Search Trigger */}
        <button 
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="hidden sm:flex items-center gap-3 px-5 py-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-purple-500 hover:border-purple-500/30 transition-all group"
        >
           <Command size={14} className="group-hover:rotate-12 transition-transform" />
           <span className="text-[10px] font-black uppercase tracking-widest">Neural Search</span>
           <span className="text-[9px] px-1.5 py-0.5 bg-white dark:bg-black rounded border border-slate-200 dark:border-white/10 text-slate-400">⌘K</span>
        </button>

        {/* v4.5 MASTER EDITION Badge */}
        <motion.div 
           whileHover={{ scale: 1.05 }}
           className={`hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 relative overflow-hidden group shadow-xl`}
        >
           <div className={`absolute inset-0 bg-gradient-to-r ${masteryColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
           <div className="flex items-center gap-2 relative z-10">
              <div className={`p-1 bg-gradient-to-br ${masteryColor} rounded-md shadow-lg shadow-purple-500/20`}>
                 <Activity size={12} className="text-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 italic">High-Fidelity Link</span>
                 <span className={`text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r ${masteryColor} uppercase tracking-widest`}>v4.5 MASTER EDITION</span>
              </div>
           </div>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-3 h-full">
           <ThemeSwitcher />
           
           <button className="relative p-2.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-500 dark:text-slate-400 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/5 group">
             <Bell size={20} className="group-hover:rotate-12 transition-transform" />
             <span className={`absolute top-2.5 right-2.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-white dark:border-dark-bg animate-pulse`} />
           </button>
           
           <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-1 hidden xs:block" />
           
           {userData && (
             <div className="flex items-center gap-3 pl-2">
                <div className="relative group cursor-pointer">
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    src={userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`} 
                    className="w-10 h-10 rounded-xl object-cover border-2 border-slate-200 dark:border-white/10 shadow-2xl transition-all duration-500 group-hover:border-purple-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-dark-bg rounded-full shadow-lg" />
                </div>
                <div className="hidden xl:flex flex-col">
                   <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter line-clamp-1">{userData.username}</p>
                   <p className="text-[8px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest italic flex items-center gap-1.5">
                      <Cpu size={10} className="text-purple-500" /> LVL {masteryLevel} NEUROMANCER
                   </p>
                </div>
             </div>
           )}
        </div>
      </div>
    </header>
  );
}
