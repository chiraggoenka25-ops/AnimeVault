"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { API_URL } from "@/lib/api";
import { Award, Zap, ShieldCheck, Folder, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        const res = await fetch(`${API_URL}/achievements/${user.id}`);
        const result = await res.json();
        setAchievements(result.achievements || []);
      } catch (err) {
        console.error("Achievements Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap size={32} />;
      case 'Folder': return <Folder size={32} />;
      case 'ShieldCheck': return <ShieldCheck size={32} />;
      default: return <Award size={32} />;
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Loading Achievements...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto pb-24">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-emerald-500/10 rounded-2xl aura-border text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Award size={24} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter aura-text">ACHIEVEMENT VAULT</h1>
        </div>
        <p className="text-slate-400 font-medium">Your legendary journey through the Neural Link, immortalized in stone.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {achievements.map((item: any, idx: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-panel p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden group ${
              item.unlocked 
                ? "border-emerald-500/20 bg-emerald-500/[0.02]" 
                : "border-white/5 opacity-60 grayscale bg-black/20"
            }`}
          >
            {/* Background Glow Effect */}
            {item.unlocked && (
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[50px] group-hover:bg-emerald-500/20 transition-all" />
            )}

            <div className="flex items-start gap-6 relative z-10">
              <div className={`p-5 rounded-3xl aura-border shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                item.unlocked ? "text-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "text-slate-600 bg-white/5"
              }`}>
                {item.unlocked ? getIcon(item.icon) : <Lock size={32} />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                   <h3 className={`text-xl font-black tracking-tight ${item.unlocked ? 'text-white' : 'text-slate-500'}`}>
                    {item.name}
                  </h3>
                  {item.unlocked && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                       <Sparkles size={14} className="text-emerald-400" />
                    </motion.div>
                  )}
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-2">
                   <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                     item.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-600'
                   }`}>
                      <Zap size={10} /> +{item.xp_reward} XP
                   </div>
                   {item.unlocked && (
                     <span className="text-[10px] font-bold text-emerald-500/60 tabular-nums">
                       UNLOCKED {new Date(item.unlocked_at).toLocaleDateString()}
                     </span>
                   )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {achievements.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <Award className="mx-auto text-slate-600 mb-4" size={40} />
          <h3 className="text-xl font-bold text-slate-400">Archivist's Log is Empty</h3>
          <p className="text-slate-500">Milestones will appear here as you interact with the community.</p>
        </div>
      )}
    </div>
  );
}
