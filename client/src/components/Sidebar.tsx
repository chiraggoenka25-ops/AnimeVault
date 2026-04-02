"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Home, FolderOpen, ListVideo, PenTool, Users, MessageSquare, User, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session && pathname !== '/login' && pathname !== '/register') {
        router.push('/login');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && pathname !== '/login' && pathname !== '/register') {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

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
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="w-64 h-full glass-panel border-r border-white/10 flex flex-col pt-8 pb-4 shrink-0 transition-opacity">
      <div className="px-6 mb-10">
        <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 neon-text-purple">
          ANIME VAULT
        </h1>
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
