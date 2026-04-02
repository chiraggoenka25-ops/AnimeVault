"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Zap, FolderOpen, ListVideo, PenTool, Users, Sparkles, MessageSquare, Terminal, Infinity as InfinityIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const actions = [
    { name: "Home Dashboard", icon: Zap, href: "/", shortcut: "H" },
    { name: "Consult Sensei", icon: Sparkles, href: "/sensei", shortcut: "S" },
    { name: "Browse Watchlist", icon: ListVideo, href: "/vault/watchlist", shortcut: "W" },
    { name: "Anime Files", icon: FolderOpen, href: "/vault/files", shortcut: "F" },
    { name: "Vault Notes", icon: PenTool, href: "/vault/notes", shortcut: "N" },
    { name: "Community Hub", icon: MessageSquare, href: "/community", shortcut: "C" },
  ];

  const filteredActions = query.trim() === "" 
    ? actions 
    : actions.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigate = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl bg-white dark:bg-[#0f1115] rounded-[2.5rem] border-2 border-purple-500/30 dark:border-white/10 shadow-[0_0_80px_rgba(139,92,246,0.3)] relative overflow-hidden"
          >
            {/* Command Palette Header */}
            <div className="p-8 border-b-2 border-slate-100 dark:border-white/5 flex items-center gap-4 relative">
               <Search className="text-purple-500" size={24} />
               <input 
                 autoFocus
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 placeholder="Search Vault or Type Command..." 
                 className="flex-1 bg-transparent text-xl font-black text-slate-800 dark:text-white outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 uppercase tracking-tighter"
               />
               <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 text-[10px] font-black text-slate-400">
                  ESC
               </div>
            </div>

            {/* Results Section */}
            <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
               <div className="px-4 py-2 mb-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex justify-between">
                  <span>Power User Teleport</span>
                  <span className="flex items-center gap-1"><Terminal size={10} /> Neural Link Active</span>
               </div>
               
               <div className="grid grid-cols-1 gap-2">
                 {filteredActions.map((action) => (
                   <button
                     key={action.name}
                     onClick={() => navigate(action.href)}
                     className="w-full text-left p-4 rounded-2xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 group transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                   >
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-all text-slate-400 dark:text-slate-600">
                           <action.icon size={20} />
                        </div>
                        <span className="font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400">
                           {action.name}
                        </span>
                     </div>
                     <div className="text-[10px] font-black p-2 bg-slate-100 dark:bg-black rounded-lg text-slate-400 border border-slate-200 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                        Shortcut: {action.shortcut}
                     </div>
                   </button>
                 ))}
                 
                 {filteredActions.length === 0 && (
                   <div className="p-12 text-center text-slate-400">
                      <Zap size={48} className="mx-auto mb-4 opacity-10" />
                      <p className="text-sm font-black uppercase tracking-widest">No Synergy Found for "{query}"</p>
                   </div>
                 )}
               </div>
            </div>

            {/* Command Palette Footer */}
            <div className="p-6 bg-slate-50 dark:bg-black/40 border-t-2 border-slate-100 dark:border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                  <span className="flex items-center gap-1.5"><InfinityIcon size={12} className="text-purple-500" /> Mastery v4.5</span>
                  <span className="w-1 h-3 bg-slate-200 dark:bg-white/10 rounded-full" />
                  <span>Neural Command Link Enabled</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase">Aura Status:</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
