"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Home, FolderOpen, ListVideo, PenTool, Users, MessageSquare, User, LogOut, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
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

  // Real-time XP updates
  useEffect(() => {
    if (!session?.user?.id) return;
    const channel = supabase.channel('user_updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${session.user.id}` }, (payload) => {
        setUserData(payload.new);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session?.user?.id]);

  // Hide entirely on auth pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

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
    { name: "Otaku Sensei 🤖", href: "/sensei", icon: Sparkles },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="w-64 h-full glass-panel border-r border-white/10 flex flex-col pt-8 pb-4 shrink-0 transition-opacity">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 neon-text-purple">
          ANIME VAULT
        </h1>
        
        {userData && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5"
          >
            <div className="flex items-center justify-between mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-purple-400" /> Progression
              </span>
              <span className={`px-2 py-0.5 rounded border ${getRank(userData.xp).bg} ${getRank(userData.xp).color} ${getRank(userData.xp).border}`}>
                {getRank(userData.xp).name}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-slate-500">XP: {userData.xp}</span>
                <span className="text-[10px] text-purple-400 font-bold flex items-center">
                  <Zap size={10} className="mr-0.5" /> Next Rank
                </span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(userData.xp % 500) / 5}%` }}
                   transition={{ type: "spring", stiffness: 50 }}
                   className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-purple-600/50 to-pink-600/20 border border-purple-500/50 shadow-[0_0_15px_rgba(139,92,246,0.3)] text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={20} className={isActive ? "text-pink-400" : "text-slate-400"} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-8 mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 text-slate-400 hover:text-red-400 transition-colors w-full p-2 rounded-lg hover:bg-white/5"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
