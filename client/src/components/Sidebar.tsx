"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Home, FolderOpen, ListVideo, PenTool, Users, MessageSquare, User, LogOut, ShieldCheck, Sparkles, Zap, X, Calendar, BarChart3, Award, MessageCircle } from "lucide-react";
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

  const getRank = (xp: number) => {
    if (xp >= 2000) return { name: "Hokage", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" };
    if (xp >= 1000) return { name: "Jonin", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" };
    if (xp >= 500) return { name: "Chunin", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" };
    return { name: "Genin", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" };
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
    const channel = supabase.channel('user_updates')
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
    { name: "Anime Files", href: "/vault/files", icon: FolderOpen },
    { name: "Watchlist", href: "/vault/watchlist", icon: ListVideo },
    { name: "Notes & Reviews", href: "/vault/notes", icon: PenTool },
    { name: "Favorite Characters", href: "/vault/characters", icon: Users },
    { name: "Community 🔥", href: "/community", icon: MessageSquare },
    { name: "Neural Link 🗨️", href: "/messages", icon: MessageCircle },
    { name: "Otaku Sensei 🤖", href: "/sensei", icon: Sparkles },
    { name: "Release Radar 📅", href: "/calendar", icon: Calendar },
    { name: "Neural Stats 📊", href: "/stats", icon: BarChart3 },
    { name: "Achievements 🏆", href: "/achievements", icon: Award },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const sidebarContent = (
    <div className="w-64 h-full glass-panel border-r border-white/10 flex flex-col pt-4 pb-4 shrink-0 shadow-2xl relative">
      <div className="px-6 mb-4 mt-16 md:mt-4">
        {userData && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-white/5 border border-white/5 aura-border shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 relative z-10">
              <span className="flex items-center gap-1.5 ">
                <Sparkles size={11} className="text-purple-400" /> Rank
              </span>
              <span className={`px-2 py-0.5 rounded border ${getRank(userData.xp).bg} ${getRank(userData.xp).color} ${getRank(userData.xp).border}`}>
                {getRank(userData.xp).name}
              </span>
            </div>
            
            <div className="space-y-1.5 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-[9px] text-slate-500 font-black">XP: {userData.xp}</span>
                <span className="text-[8px] text-purple-400 font-black uppercase tracking-widest">Neural Sync</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden border border-white/5">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(userData.xp % 500) / 5}%` }}
                   className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => { if(window.innerWidth < 768) onClose(); }}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 relative group ${
                isActive
                  ? "bg-white/5 border border-white/10 aura-text shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div 
                   layoutId="sidebar-active"
                   className="absolute left-0 top-2 bottom-2 w-1 bg-purple-500 rounded-full shadow-[0_0_10px_#8b5cf6]"
                />
              )}
              <Icon size={14} className={`${isActive ? "text-purple-400" : "text-slate-500"} transition-colors group-hover:text-purple-400`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? 'aura-text' : ''}`}>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-4 border-t border-white/5 pt-4">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 text-slate-500 hover:text-red-400 transition-colors w-full px-4 py-3 rounded-xl hover:bg-red-400/5 group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Disconnect Link</span>
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
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
