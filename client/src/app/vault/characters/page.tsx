"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X } from "lucide-react";
import { apiClient } from "@/lib/api";

export default function CharactersPage() {
  const [chars, setChars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => { fetchChars(); }, []);

  const fetchChars = async () => {
    try {
      const res = await apiClient.get('/vault/characters');
      setChars(res.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/vault/characters', { 
        name, 
        image_url: image || "https://images.unsplash.com/photo-1578314643033-0c46c051ac17?auto=format&fit=crop&q=80&w=400", 
        reason 
      });
      setShowModal(false); setName(""); setImage(""); setReason(""); fetchChars();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-8 h-full flex flex-col relative w-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            <Users className="text-amber-400 mr-3" size={32} /> Favorite Characters
          </h1>
          <p className="text-slate-400">Build a shrine of your absolute favorite characters.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]">
          + Add Character
        </button>
      </header>

      {loading ? <div className="text-amber-400 m-auto">Loading...</div> : chars.length === 0 ? (
        <div className="m-auto glass-panel p-16 rounded-3xl max-w-lg w-full flex flex-col items-center opacity-70">
          <Users size={48} className="text-amber-500/50 mb-4" />
          <p className="text-slate-400">Your shrine is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {chars.map((char, idx) => (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} key={char.id} className="relative group rounded-2xl overflow-hidden aspect-[3/4] border border-amber-500/20">
              <img src={char.image_url} alt={char.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-4">
                <h3 className="font-black text-amber-400 text-lg drop-shadow-md leading-tight">{char.name}</h3>
                <p className="text-xs text-white/80 mt-1 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity">{char.reason}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md glass-panel border border-amber-500/30 rounded-2xl relative z-10 p-6">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400"><X size={20} /></button>
              <h2 className="text-2xl font-bold mb-6 text-amber-400">Shrine Addition</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div><label className="block text-sm text-slate-300 mb-1">Character Name</label><input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-slate-200" /></div>
                <div><label className="block text-sm text-slate-300 mb-1">Image URL</label><input type="url" value={image} onChange={e => setImage(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-slate-200" /></div>
                <div><label className="block text-sm text-slate-300 mb-1">Why are they the best?</label><textarea rows={3} value={reason} onChange={e => setReason(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-slate-200 resize-none" /></div>
                <button type="submit" className="w-full bg-amber-600 text-white font-bold py-3 rounded-lg">Add to Shrine</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
