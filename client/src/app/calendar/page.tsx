"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { Calendar as CalendarIcon, Clock, ExternalLink, Sparkles, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function CalendarPage() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`${API_URL}/anime/schedule`);
        const result = await res.json();
        setSchedule(result.data || []);
      } catch (err) {
        console.error("Calendar Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto pb-20">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-500/10 rounded-2xl aura-border text-purple-400">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter aura-text">RELEASE RADAR</h1>
            <p className="text-slate-400 font-medium">Tracking the Pulse of the Global Anime Scene — Today</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {schedule.map((anime: any, idx: number) => (
          <motion.div
            key={anime.mal_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card group h-full flex flex-col overflow-hidden"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <img 
                src={anime.images.webp.large_image_url} 
                alt={anime.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white flex items-center gap-1.5 uppercase tracking-widest">
                <Clock size={10} className="text-purple-400" /> {anime.broadcast.time || "TBA"}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h2 className="text-lg font-black tracking-tight line-clamp-1 group-hover:text-purple-400 transition-colors">
                {anime.title}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {anime.genres.slice(0, 2).map((g: any) => (
                  <span key={g.mal_id} className="text-[9px] font-black uppercase tracking-tighter text-slate-500 border border-white/5 px-2 py-0.5 rounded-md">
                    {g.name}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5">
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-400 transition-colors">
                  <Bell size={12} /> Notify Me
                </button>
                <a 
                  href={anime.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 hover:bg-purple-500/20 rounded-lg text-slate-400 hover:text-purple-400 transition-all aura-border"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {schedule.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <Sparkles className="mx-auto text-slate-600 mb-4" size={40} />
          <h3 className="text-xl font-bold text-slate-400">The Neural Link is Silent</h3>
          <p className="text-slate-500">Check back later for today's airing data.</p>
        </div>
      )}
    </div>
  );
}
