"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Send, MessageSquare, User, Search, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      
      // Fetch users who have sent/received messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      const uniqueUserIds = Array.from(new Set(msgs?.flatMap(m => [m.sender_id, m.receiver_id]).filter(id => id !== user.id)));
      
      if (uniqueUserIds.length > 0) {
        const { data: users } = await supabase.from('users').select('*').in('id', uniqueUserIds);
        setConversations(users || []);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!activeChat || !userId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${activeChat.id}),and(sender_id.eq.${activeChat.id},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();

    // Subscribe to REALTIME messages
    const channel = supabase.channel(`messages_${activeChat.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const nm = payload.new;
        if ((nm.sender_id === userId && nm.receiver_id === activeChat.id) || 
            (nm.sender_id === activeChat.id && nm.receiver_id === userId)) {
          setMessages(prev => [...prev, nm]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeChat, userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat || !userId) return;
    
    const { error } = await supabase.from('messages').insert({
      sender_id: userId,
      receiver_id: activeChat.id,
      content: newMessage
    });
    
    if (!error) setNewMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar: Conversations */}
      <div className="w-80 glass-panel border-r border-white/5 flex flex-col pt-6 shrink-0">
        <div className="px-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                <MessageSquare size={18} />
             </div>
             <h2 className="text-xl font-black tracking-tighter aura-text uppercase">Neural Link</h2>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-purple-400 transition-colors" size={14} />
            <input 
              placeholder="Search Users..." 
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:border-purple-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1 pb-4">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChat(c)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
                activeChat?.id === c.id ? 'bg-purple-500/10 border border-purple-500/20' : 'hover:bg-white/5'
              }`}
            >
              <div className="relative">
                 <img src={c.avatar_url} className="w-10 h-10 rounded-xl object-cover border border-white/5" />
                 <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-dark-bg rounded-full" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-black tracking-tight text-white line-clamp-1">{c.username}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Neural Link</p>
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="text-center py-12 px-6">
               <Zap className="mx-auto text-slate-700 mb-2" size={24} />
               <p className="text-[10px] font-black tracking-widest text-slate-600 uppercase">No active neural links discovered.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main: Chat Window */}
      <div className="flex-1 flex flex-col bg-black/20">
        {activeChat ? (
          <>
            <header className="p-6 border-b border-white/5 glass-panel z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={activeChat.avatar_url} className="w-10 h-10 rounded-xl border border-white/5 shadow-2xl" />
                <div>
                   <h3 className="font-black tracking-tight aura-text text-xl">{activeChat.username}</h3>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Neural Sync Online
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 group">
                    <ShieldCheck size={18} className="group-hover:text-purple-400" />
                 </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((m, idx) => {
                   const isMe = m.sender_id === userId;
                   return (
                     <motion.div
                       key={m.id}
                       initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                     >
                       <div className={`max-w-[70%] p-4 rounded-3xl ${
                         isMe ? 'bg-gradient-to-br from-purple-600/80 to-pink-600/80 text-white shadow-lg aura-border rounded-br-sm' : 'glass-panel text-slate-200 rounded-bl-sm'
                       }`}>
                         <p className="text-sm font-medium leading-relaxed">{m.content}</p>
                         <p className={`text-[8px] font-bold mt-2 opacity-50 uppercase tracking-widest ${isMe ? 'text-right' : 'text-left'}`}>
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                       </div>
                     </motion.div>
                   );
                })}
              </AnimatePresence>
            </div>

            <footer className="p-6 border-t border-white/5 glass-panel">
               <div className="flex items-center gap-3 group">
                  <input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Enter message for neural transmission..."
                    className="flex-1 bg-white/5 border border-white/5 p-4 rounded-2xl outline-none focus:border-purple-500/50 text-sm font-medium transition-all group-hover:bg-white/[0.07]"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl text-white shadow-xl hover:scale-110 active:scale-95 transition-all aura-border"
                  >
                    <Send size={20} />
                  </button>
               </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
             <div className="w-24 h-24 bg-purple-500/5 rounded-full flex items-center justify-center mb-6 aura-border">
                <Sparkles size={40} className="text-purple-400" />
             </div>
             <h2 className="text-3xl font-black tracking-tighter aura-text mb-2 uppercase italic">Neural Link Portal</h2>
             <p className="text-slate-500 max-w-sm font-medium">Select a user from the neural network left to initiate direct transmission.</p>
          </div>
        )}
      </div>
    </div>
  );
}
