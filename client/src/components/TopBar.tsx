"use client";

import { Bell, Search, Sparkles, Moon, Sun, Menu, ShieldCheck, Zap, X } from "lucide-react";
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
  }, []);

  return (
    <header className="h-16 glass-panel border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-50 shadow-2xl">
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
        {/* Legendary Badge v4.1 */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-rotate-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="flex items-center gap-2 relative z-10">
              <div className="p-1 bg-purple-500/20 rounded-md">
                 <ShieldCheck size={12} className="text-purple-400" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Neural Status</span>
                 <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">v4.1 LEGENDARY</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 h-full">
           <ThemeSwitcher />
           
           <button className="relative p-2.5 hover:bg-white/5 rounded-xl text-slate-400 transition-all border border-transparent hover:border-white/5 group">
             <Bell size={20} className="group-hover:rotate-12 transition-transform" />
             <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#0D0D15] animate-pulse"></span>
           </button>
           
           <div className="h-8 w-[1px] bg-white/10 mx-1 hidden xs:block"></div>
           
           {userData && (
             <div className="flex items-center gap-3 pl-2">
                <img 
                  src={userData.avatar_url || "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=100&auto=format&fit=crop"} 
                  className="w-9 h-9 rounded-xl object-cover border-2 border-purple-500/30 shadow-lg"
                />
                <div className="hidden xl:flex flex-col">
                   <p className="text-[10px] font-black text-white uppercase tracking-tighter line-clamp-1">{userData.username}</p>
                   <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Mastery Level {Math.floor(userData.xp/500) + 1}</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </header>
  );
}
