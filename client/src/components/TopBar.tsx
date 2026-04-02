"use client";

import { Menu, X, Sparkles } from "lucide-react";
import NotificationsCenter from "./NotificationsCenter";
import Link from "next/link";
import { motion } from "framer-motion";

interface TopBarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export default function TopBar({ onMenuClick, isSidebarOpen }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-white/10 z-[60] flex items-center justify-between px-6 backdrop-blur-3xl shadow-2xl">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg aura-border">
             <Sparkles size={16} />
          </div>
          <h1 className="text-lg font-black tracking-tighter aura-text group-hover:scale-105 transition-transform">
            ANIME VAULT
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-4">
         <NotificationsCenter />
         <div className="hidden md:block h-6 w-px bg-white/10 mx-2" />
         <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Elite Access</p>
               <p className="text-[8px] font-bold text-purple-400 uppercase tracking-[0.2em]">v3.1 Production</p>
            </div>
         </div>
      </div>
    </header>
  );
}
