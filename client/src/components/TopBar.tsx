"use client";

import { Bell, Search, Sparkles, Moon, Sun, Menu, ShieldCheck, Zap, X, Infinity } from "lucide-react";
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

    const channel = supabase.channel('topbar_updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, (payload) => {
        setUserData(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const currentXP = userData?.xp || 0;
  const masteryLevel = Math.floor(currentXP / 500) + 1;

  return (
    <header className="h-16 glass-panel border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-50 shadow-2xl transition-all duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
           {isSidebarOpen ? <X size={20} className="text-purple-400" /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
             <Zap size={20} className="text-white fill-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter aura-text hidden sm:block uppercase italic">
            ANIME VAULT
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Elite Infinity Badge v4.2 */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 relative overflow-hidden group shadow-[0_0_15px_#8b5cf633]">
           <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-rotate-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="flex items-center gap-2 relative z-10">
              <div className="p-1 bg-yellow-500/20 rounded-md">
                 <Infinity size={12} className="text-yellow-400" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Production Neural Link</span>
                 <span className="text-[9px] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 uppercase tracking-widest">INFINITY EDITION</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 h-full">
           <ThemeSwitcher />
           
           <button className="relative p-2.5 hover:bg-white/5 rounded-xl text-slate-400 transition-all border border-transparent hover:border-white/5 group">
             <Bell size={20} className="group-hover:rotate-12 transition-transform" />
             <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-dark-bg animate-pulse"></span>
           </button>
           
           <div className="h-8 w-[1px] bg-white/10 mx-1 hidden xs:block"></div>
           
           {userData && (
             <div className="flex items-center gap-3 pl-2">
                <div className="relative group">
                  <img 
                    src={userData.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Chirag"} 
                    className="w-10 h-10 rounded-xl object-cover border-2 border-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-dark-bg rounded-full flex items-center justify-center">
                     <ShieldCheck size={10} className="text-white" />
                  </div>
                </div>
                <div className="hidden xl:flex flex-col">
                   <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter line-clamp-1">{userData.username}</p>
                   <p className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Mastery Level {masteryLevel}</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </header>
  );
}
