"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListVideo, X, Star, Plus, Minus, CheckCircle } from "lucide-react";
import { apiClient } from "@/lib/api";
import AnimeSearch from "@/components/AnimeSearch";

type WatchItem = {
  id: string;
  anime_title: string;
  cover_image: string;
  status: string;
  rating: number;
  episodes_watched: number;
  total_episodes: number;
};

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [adding, setAdding] = useState(false);
  
  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [status, setStatus] = useState("Plan to Watch");
  const [rating, setRating] = useState(0);
  const [episodesWatched, setEpisodesWatched] = useState(0);
  const [totalEpisodes, setTotalEpisodes] = useState(0);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await apiClient.get('/vault/watchlist');
      setItems(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await apiClient.post('/vault/watchlist', { 
        anime_title: title, 
        cover_image: coverUrl || "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=600&auto=format&fit=crop", 
        status, 
        rating,
        episodes_watched: episodesWatched,
        total_episodes: totalEpisodes
      });
      setShowModal(false);
      setTitle(""); setCoverUrl(""); setRating(0);
      setEpisodesWatched(0); setTotalEpisodes(0);
      fetchWatchlist();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateProgress = async (id: string, current: number, total: number) => {
    if (total > 0 && current >= total) return;
    try {
      const newCount = current + 1;
      const newStatus = total > 0 && newCount === total ? 'Completed' : 'Watching';
      
      await apiClient.put(`/vault/watchlist/${id}`, { 
        episodes_watched: newCount,
        status: newStatus
      });
      
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, episodes_watched: newCount, status: newStatus } : item
      ));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col relative w-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
            <ListVideo className="text-pink-400 mr-3" size={32} />
            Watchlist
          </h1>
          <p className="text-slate-400">Keep track of every anime you want to watch or have finished.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)]">
          + Add New Anime
        </button>
      </header>

      {loading ? (
        <div className="text-pink-400 m-auto">Loading...</div>
      ) : items.length === 0 ? (
        <div className="m-auto glass-panel p-16 rounded-3xl max-w-lg w-full flex flex-col items-center opacity-70">
          <ListVideo size={48} className="text-pink-500/50 mb-4" />
          <p className="text-slate-400">Your watchlist is completely empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {items.map((item, idx) => {
            const progress = item.total_episodes > 0 
              ? (item.episodes_watched / item.total_episodes) * 100 
              : 0;

            return (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                key={item.id} className="glass-panel overflow-hidden rounded-xl group relative border-white/5"
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={item.cover_image} alt={item.anime_title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent flex flex-col justify-end p-4">
                    <h3 className="font-bold text-white shadow-black drop-shadow-md text-sm">{item.anime_title}</h3>
                    
                    {/* Progress Bar Container */}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-300">
                        <span>{item.episodes_watched} / {item.total_episodes || '?'} EPS</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full shadow-[0_0_8px_rgba(236,72,153,0.5)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Increment Overlay */}
                  <button 
                    onClick={() => handleUpdateProgress(item.id, item.episodes_watched, item.total_episodes)}
                    className="absolute top-2 right-2 bg-pink-500 hover:bg-pink-400 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="p-3 bg-white/5 flex justify-between items-center text-[10px]">
                  <div className="flex items-center">
                    {item.status === 'Completed' ? (
                      <span className="flex items-center text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                        <CheckCircle size={10} className="mr-1" /> COMPLETED
                      </span>
                    ) : (
                      <span className="text-slate-400 uppercase tracking-widest font-bold">
                        {item.status}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center text-yellow-400 font-black"><Star size={12} className="mr-1 fill-yellow-400" /> {item.rating}/10</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md glass-panel border border-pink-500/30 rounded-2xl relative z-10 p-6">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400"><X size={20} /></button>
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-tighter">1. Search to Auto-Fill</label>
                <AnimeSearch onSelect={(anime) => {
                  setTitle(anime.title);
                  setCoverUrl(anime.coverImage);
                  setTotalEpisodes(anime.totalEpisodes);
                  setStatus(anime.totalEpisodes > 0 ? "Watching" : "Plan to Watch");
                }} />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Or Manual entry</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Title</label>
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-pink-500/50" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Cover Image</label>
                    <input type="url" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none focus:border-pink-500/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-slate-200 text-sm focus:outline-none focus:border-pink-500/50">
                      <option>Plan to Watch</option>
                      <option>Watching</option>
                      <option>Completed</option>
                      <option>Dropped</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Rating / 10</label>
                    <input type="number" min="0" max="10" value={rating === 0 ? "" : rating} onChange={e => setRating(parseInt(e.target.value) || 0)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-pink-500/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Watched</label>
                    <input type="number" min="0" value={episodesWatched} onChange={e => setEpisodesWatched(parseInt(e.target.value) || 0)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-pink-500/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Total</label>
                    <input type="number" min="0" value={totalEpisodes} onChange={e => setTotalEpisodes(parseInt(e.target.value) || 0)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-pink-500/50" />
                  </div>
                </div>
                <button type="submit" disabled={adding} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-pink-500/20 transition-all mt-4">
                  {adding ? "Initializing..." : "Add to Vault"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
