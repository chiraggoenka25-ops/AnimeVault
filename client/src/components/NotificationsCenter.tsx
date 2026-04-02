"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, X, Info, Heart, MessageSquare, Zap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();

    const setupRealtime = async () => {
       const { data: { user } } = await supabase.auth.getUser();
       if (!user) return;

       const channel = supabase.channel('realtime_notifications')
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications', 
            filter: `user_id=eq.${user.id}` 
          }, (payload) => {
            setNotifications(prev => [payload.new, ...prev]);
            // Play subtle sound or toast here if desired
        })
        .subscribe();
       return () => { supabase.removeChannel(channel); };
    };
    setupRealtime();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShow(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="text-pink-500" size={16} fill="currentColor" />;
      case 'reply': return <MessageSquare className="text-emerald-400" size={16} />;
      case 'levelup': return <Zap className="text-yellow-400" size={16} fill="currentColor" />;
      default: return <Sparkles className="text-purple-400" size={16} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setShow(!show)}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
      >
        <Bell className={`transition-transform duration-300 ${show ? 'scale-110' : 'group-hover:rotate-12'}`} />
        {unreadCount > 0 && (
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-[0_0_10px_rgba(139,92,246,0.6)] aura-border"
          >
            {unreadCount}
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 max-h-[450px] glass-panel border-white/10 rounded-2xl shadow-2xl z-[100] flex flex-col backdrop-blur-3xl"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">System Logs</h3>
              <button 
                onClick={markAllRead}
                className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest"
              >
                Sync All
              </button>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar min-h-[100px]">
              {notifications.length === 0 ? (
                <div className="p-10 flex flex-col items-center justify-center text-center">
                   <Bell size={40} className="text-slate-600 mb-4 opacity-20" />
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Neural link empty.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id}
                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group relative ${!n.read ? 'bg-purple-500/5' : ''}`}
                  >
                    <div className="flex gap-4 items-start">
                       <div className="mt-1">{getIcon(n.type)}</div>
                       <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold ${n.read ? 'text-slate-300' : 'text-white'}`}>{n.title}</p>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 italic">{n.message}</p>
                          <p className="text-[8px] text-slate-600 mt-2 uppercase font-black">{new Date(n.created_at).toLocaleTimeString()}</p>
                       </div>
                    </div>
                    {!n.read && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-500 rounded-full aura-border shadow-purple-500/50" />}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-black/40 text-center rounded-b-2xl">
               <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.4em]">Elite Tier Access Secured</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
