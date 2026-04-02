"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, X } from "lucide-react";
import { apiClient } from "@/lib/api";

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const res = await apiClient.get('/vault/notes');
      setNotes(res.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/vault/notes', { anime_title: title, content });
      setShowModal(false); setTitle(""); setContent(""); fetchNotes();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-8 h-full flex flex-col relative w-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            <PenTool className="text-blue-400 mr-3" size={32} /> Reviews & Notes
          </h1>
          <p className="text-slate-400">Write down your deep thoughts and episode summaries.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2 rounded-lg font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)]">
          + Draft Note
        </button>
      </header>

      {loading ? <div className="text-blue-400 m-auto">Loading...</div> : notes.length === 0 ? (
        <div className="m-auto glass-panel p-16 rounded-3xl max-w-lg w-full flex flex-col items-center opacity-70">
          <PenTool size={48} className="text-blue-500/50 mb-4" />
          <p className="text-slate-400">You haven't written any notes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, idx) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} key={note.id} className="glass-panel p-6 rounded-xl border-blue-500/10">
              <h3 className="font-bold text-xl text-blue-300 mb-1">{note.anime_title}</h3>
              <p className="text-xs text-slate-500 mb-4">{new Date(note.created_at).toLocaleDateString()}</p>
              <p className="text-slate-300 whitespace-pre-wrap">{note.content}</p>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg glass-panel border border-blue-500/30 rounded-2xl relative z-10 p-6">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400"><X size={20} /></button>
              <h2 className="text-2xl font-bold mb-6 text-blue-400">Write a Review</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div><label className="block text-sm text-slate-300 mb-1">Anime Context</label><input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-slate-200" /></div>
                <div><label className="block text-sm text-slate-300 mb-1">Thoughts</label><textarea required rows={6} value={content} onChange={e => setContent(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-slate-200 resize-none" /></div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg">Save Note</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
