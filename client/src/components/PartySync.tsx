"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Users, Zap, Terminal, Activity, Globe, X, UserPlus, ShieldCheck, Cpu } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PartySync() {
  const [presence, setPresence] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const setupPresence = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const channel = supabase.channel('neural_party_v4_6', {
        config: {
          presence: {
            key: user.id,
          },
        },
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const newState = channel.presenceState();
          const members = Object.values(newState).flat();
          setPresence(members);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('Join:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('Leave:', key, leftPresences);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              username: user.email?.split('@')[0],
              online_at: new Date().toISOString(),
              xp: 1250 // Placeholder for real XP
            });
          }
        });

      return () => { channel.unsubscribe(); };
    };

    setupPresence();
  }, []);

  return (
    <>
      {/* Floating Neural Party Button */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[60] w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-[0_0_30px_#8b5cf6] flex items-center justify-center text-white aura-border border-none group transition-all"
      >
         <Users size={28} className="group-hover:animate-bounce" />
         {presence.length > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-black flex items-center justify-center text-[10px] font-black">
               {presence.length}
            </div>
         )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end p-6">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsOpen(false)}
               className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-md h-full bg-white dark:bg-black p-10 rounded-[3rem] border-l-4 border-purple-500/30 dark:border-white/10 shadow-[0_0_80px_rgba(139,92,246,0.3)] relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-10">
                  <button onClick={() => setIsOpen(false)} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-red-500 hover:rotate-90 transition-all">
                     <X size={20} />
                  </button>
               </div>

               <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-4 bg-purple-500/10 rounded-2xl border-2 border-purple-500/20 text-purple-600 dark:text-purple-400">
                        <Globe size={24} className="animate-spin-slow" />
                     </div>
                     <div className="flex flex-col">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">NEURAL PARTY</h2>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Live Linked Peers</span>
                     </div>
                  </div>
                  <div className="w-full h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-transparent rounded-full opacity-30" />
               </div>

               <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-4">
                  <div className="px-4 py-2 bg-emerald-500/10 rounded-2xl border-2 border-emerald-500/20 flex items-center justify-between group cursor-pointer hover:bg-emerald-500/20 transition-all">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                         <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Neural Invite Code Active</span>
                      </div>
                      <button className="text-[9px] font-black uppercase text-slate-500 hover:text-emerald-500">Copy Link</button>
                  </div>

                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-12 mb-4 flex justify-between items-center">
                     <span>Synced Peers ({presence.length})</span>
                     <Activity size={12} className="animate-pulse text-purple-500" />
                  </div>

                  <div className="space-y-3">
                    {presence.map((peer, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 bg-slate-50 dark:bg-white/[0.03] rounded-[1.8rem] border-2 border-slate-200/50 dark:border-white/5 flex items-center justify-between group hover:border-purple-500/40 transition-all"
                      >
                         <div className="flex items-center gap-4">
                            <div className="relative">
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${peer.username}`} className="w-12 h-12 rounded-xl object-cover bg-white" />
                               <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-black rounded-full shadow-lg" />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[12px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{peer.username}</span>
                               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Cpu size={8} /> Syncing @ {peer.online_at.split('T')[1].substring(0,5)}</span>
                            </div>
                         </div>
                         <div className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-[9px] font-black uppercase italic shadow-sm">
                            {peer.xp} XP
                         </div>
                      </motion.div>
                    ))}
                    
                    {presence.length === 0 && (
                       <div className="py-20 text-center border-4 border-dashed border-slate-100 dark:border-white/5 rounded-[3rem]">
                          <Zap size={48} className="mx-auto mb-4 text-slate-200 dark:text-slate-800" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Synced Peers in Proximity</p>
                       </div>
                    )}
                  </div>
               </div>

               <div className="pt-10">
                  <button className="w-full p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[1.8rem] text-white flex items-center justify-center gap-4 shadow-2xl hover:scale-105 active:scale-95 transition-all group aura-border">
                     <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
                     <span className="text-[11px] font-black uppercase tracking-[0.3em]">Invite Synced Peer</span>
                  </button>
               </div>

               <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
