"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListVideo, X, Star } from "lucide-react";
import { apiClient } from "@/lib/api";

type WatchItem = {
  id: string;
  anime_title: string;
  cover_image: string;
  status: string;
  rating: number;
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
        rating 
      });
      setShowModal(false);
      setTitle(""); setCoverUrl(""); setRating(0);
      fetchWatchlist();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
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
          {items.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
              key={item.id} className="glass-panel overflow-hidden rounded-xl group relative border-pink-500/10"
            >
              <div className="h-64 overflow-hidden relative">
                <img src={item.cover_image} alt={item.anime_title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent flex items-end p-4">
                  <h3 className="font-bold text-white shadow-black drop-shadow-md">{item.anime_title}</h3>
                </div>
              </div>
              <div className="p-3 bg-white/5 flex justify-between items-center text-xs">
                <span className={`px-2 py-1 rounded bg-white/10 ${item.status === 'Completed' ? 'text-emerald-400' : 'text-pink-400'}`}>
                  {item.status}
                </span>
                <span className="flex items-center text-yellow-400"><Star size={12} className="mr-1 fill-yellow-400" /> {item.rating}/10</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md glass-panel border border-pink-500/30 rounded-2xl relative z-10 p-6">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400"><X size={20} /></button>
              <h2 className="text-2xl font-bold mb-6 text-pink-400">Add to Watchlist</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div><label className="block text-sm text-slate-300 mb-1">Anime Title</label><input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-slate-200" /></div>
                <div><label className="block text-sm text-slate-300 mb-1">Cover Image URL (Optional)</label><input type="url" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-slate-200 text-sm" placeholder="https://..." /></div>
                <div><label className="block text-sm text-slate-300 mb-1">Status</label><select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-slate-200"><option>Plan to Watch</option><option>Watching</option><option>Completed</option><option>Dropped</option></select></div>
                <div><label className="block text-sm text-slate-300 mb-1">Rating (Out of 10)</label><input type="number" min="0" max="10" value={rating === 0 ? "" : rating} onChange={e => setRating(parseInt(e.target.value) || 0)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-slate-200" /></div>
                <button type="submit" disabled={adding} className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg">{adding ? "Saving..." : "Save Anime"}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
