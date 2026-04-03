"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Home, FolderOpen, ListVideo, PenTool, Users, MessageSquare, User, LogOut, ShieldCheck, Sparkles, Zap, X, Calendar, BarChart3, Award, MessageCircle, Infinity as InfinityIcon, Activity, Cpu, Clock, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  const getRank = (xp: number = 0) => {
    if (xp >= 2000) return { name: "Hokage", color: "text-amber-500", bg: "bg-amber-400/10", border: "border-amber-400/20", glow: "shadow-[0_0_20px_#f59e0b]" };
    if (xp >= 1000) return { name: "Jonin", color: "text-cyan-500", bg: "bg-cyan-400/10", border: "border-cyan-400/20", glow: "shadow-[0_0_20px_#22d3ee]" };
    if (xp >= 500) return { name: "Chunin", color: "text-purple-500", bg: "bg-purple-400/10", border: "border-purple-400/20", glow: "shadow-[0_0_20px_#a855f7]" };
    return { name: "Genin", color: "text-blue-500", bg: "bg-blue-400/10", border: "border-blue-400/20", glow: "shadow-[0_0_20px_#3b82f6]" };
  };

  const fetchUserData = async (userId: string) => {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single();
    setUserData(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchUserData(session.user.id);
      if (!session && pathname !== '/login' && pathname !== '/register') router.push('/login');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchUserData(session.user.id);
      if (!session && pathname !== '/login' && pathname !== '/register') router.push('/login');
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  useEffect(() => {
    if (!session?.user?.id) return;
    const channel = supabase.channel('sidebar_v4_6')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${session.user.id}` }, (payload) => {
        setUserData(payload.new);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session?.user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Anime Files", icon: FolderOpen, href: "/vault/files" },
    { name: "Watchlist", icon: ListVideo, href: "/vault/watchlist" },
    { name: "Notes & Reviews", icon: PenTool, href: "/vault/notes" },
    { name: "Favorite Characters", icon: Users, href: "/vault/characters" },
    { name: "Community Hub 🔥", icon: MessageSquare, href: "/community" },
    { name: "Neural Link 🗨️", icon: MessageCircle, href: "/messages" },
    { name: "Otaku Sensei 🤖", icon: Sparkles, href: "/sensei" },
    { name: "Release Radar 📅", icon: Calendar, href: "/calendar" },
    { name: "Chronos Timeline ⏳", icon: Clock, href: "/stats" },
    { name: "Achievements 🏆", icon: Award, href: "/achievements" },
    { name: "Identity Core", icon: User, href: "/profile" },
  ];

  const currentXP = userData?.xp || 0;
  const rankInfo = getRank(currentXP);

  const sidebarContent = (
    <div className="w-64 h-full glass-panel border-r-2 border-slate-200 dark:border-white/10 flex flex-col pt-4 pb-4 shrink-0 shadow-2xl relative transition-all duration-700 bg-white/95 dark:bg-black/95 backdrop-blur-3xl overflow-hidden">
      
      {/* v4.6 Architectural Ambiance */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none z-0" />

      <div className="px-6 mb-8 mt-2 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-5 rounded-[2rem] bg-white/[0.03] dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-700`}
        >
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-500 opacity-40 animate-pulse" />
          <div className="flex items-center justify-between mb-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 relative z-10">
            <span className="flex items-center gap-1.5 ">
              <Globe size={11} className="text-cyan-400 animate-spin-slow" /> Chronos Sync
            </span>
            <span className={`px-2.5 py-1 rounded-md border-2 ${rankInfo.bg} ${rankInfo.color} ${rankInfo.border} ${rankInfo.glow} animate-pulse text-[9px] font-black italic shadow-inner`}>
              {rankInfo.name}
            </span>
          </div>
          
          <div className="space-y-2.5 relative z-10">
            <div className="flex justify-between items-end">
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-black tracking-tighter uppercase">{currentXP} XP Threshold</span>
              <span className="text-[8px] text-cyan-500 font-black uppercase tracking-[0.3em] italic">v4.6 Evolution</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-black/60 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-white/10 shadow-inner">
              <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(currentXP % 500) / 5}%` }}
                 className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar relative z-10">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => { if(window.innerWidth < 768) onClose(); }}
              className={`flex items-center space-x-4 px-5 py-3 rounded-[1.5rem] transition-all duration-400 relative group ${
                isActive
                  ? "bg-white dark:bg-white/10 border-2 border-slate-200 dark:border-white/20 shadow-2xl scale-[1.04] aura-text"
                  : "text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div 
                   layoutId="sidebar-active-chronos"
                   className="absolute left-1.5 top-3.5 bottom-3.5 w-1.5 bg-cyan-500 rounded-full shadow-[0_0_15px_#22d3ee] z-20"
                />
              )}
              <Icon size={18} className={`${isActive ? "text-cyan-500" : "text-slate-400 dark:text-slate-700"} transition-all group-hover:text-cyan-400 group-hover:scale-125 group-hover:rotate-12`} strokeWidth={isActive ? 3 : 2.5} />
              <span className={`text-[11px] font-black uppercase tracking-[0.25em] mb-0.5 ${isActive ? 'text-slate-900 dark:text-white' : ''}`}>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-4 border-t-2 border-slate-200 dark:border-white/10 pt-4 pb-2 relative z-10">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center space-x-4 text-slate-400 dark:text-slate-700 hover:text-red-500 dark:hover:text-red-400 transition-all w-full px-5 py-4 rounded-[1.8rem] hover:bg-red-500/5 group border-2 border-transparent hover:border-red-500/20 group cursor-pointer"
        >
          <LogOut size={20} className="group-hover:-translate-x-3 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">Sever Link</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:flex h-full">
        {sidebarContent}
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[70] md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
