"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from "recharts";
import { BarChart3, TrendingUp, PieChart as PieIcon, Zap, Target, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsPage() {
  const [stats, setStats] = useState<any>({
    totalShows: 0,
    completed: 0,
    totalEpisodes: 0,
    genreData: [],
    statusData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: watchlist } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id);

      if (watchlist) {
        const completed = watchlist.filter(a => a.status === 'Completed').length;
        const totalEpisodes = watchlist.reduce((acc, curr) => acc + (curr.episodes_watched || 0), 0);
        
        // Status Distribution
        const statuses = ['Plan to Watch', 'Watching', 'Completed', 'On-Hold', 'Dropped'];
        const statusData = statuses.map(s => ({
          name: s,
          count: watchlist.filter(a => a.status === s).length
        }));

        // Mock Genre Data (In a real app, we'd fetch genres for each MAL ID)
        const genreData = [
          { name: 'Shonen', value: 45, color: '#8b5cf6' },
          { name: 'Seinen', value: 25, color: '#ec4899' },
          { name: 'Mecha', value: 15, color: '#3b82f6' },
          { name: 'Slice of Life', value: 15, color: '#10b981' },
        ];

        setStats({
          totalShows: watchlist.length,
          completed,
          totalEpisodes,
          statusData,
          genreData
        });
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Loading Neural Data...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto pb-24">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-purple-500/10 rounded-2xl aura-border text-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <BarChart3 size={24} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter aura-text">NEURAL DATA DASH</h1>
        </div>
        <p className="text-slate-400 font-medium">Synchronizing your watch habits with high-fidelity analytics.</p>
      </header>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Total Series", value: stats.totalShows, icon: Zap, color: "text-blue-400" },
          { label: "Completed", value: stats.completed, icon: Award, color: "text-emerald-400" },
          { label: "Total Episodes", value: stats.totalEpisodes, icon: Target, color: "text-pink-400" },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6 rounded-3xl"
          >
            <item.icon className={`${item.color} mb-3`} size={20} />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
            <h2 className="text-4xl font-black mt-1 tabular-nums">{item.value}</h2>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="glass-panel p-8 rounded-3xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp size={18} className="text-purple-400" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Vault Composition</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="url(#colorBar)" radius={[4, 4, 0, 0]} />
                <defs>
                   <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#8b5cf6" />
                     <stop offset="100%" stopColor="#ec4899" />
                   </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Genre Pie */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.1 }}
           className="glass-panel p-8 rounded-3xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <PieIcon size={18} className="text-pink-400" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Genre Affinity</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.genreData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.genreData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-6">
             {stats.genreData.map((g: any) => (
                <div key={g.name} className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{g.name}</span>
                </div>
             ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
