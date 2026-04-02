"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { User, Mail, Calendar, Settings, Edit3, X, Save, AlertTriangle } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
      
      setProfile({
        id: user.id,
        username: data?.username || "Unknown",
        email: user.email || "",
        avatar_url: data?.avatar_url || "",
        created_at: new Date(data?.created_at || user.created_at).toLocaleDateString(),
      });
      setEditUsername(data?.username || "");
      setEditEmail(user.email || "");
      setEditAvatar(data?.avatar_url || "");
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      // Update public.users first
      await supabase.from("users").update({ 
        username: editUsername,
        avatar_url: editAvatar 
      }).eq("id", profile.id);

      // Explicitly update Auth Email if changed
      if (editEmail !== profile.email) {
        const { error } = await supabase.auth.updateUser({ email: editEmail });
        if (error) alert("Email change requested! Check your current email AND new email for verification links.");
      }
      
      setProfile({ ...profile, username: editUsername, email: editEmail, avatar_url: editAvatar });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-pink-400 m-auto">Loading Profile...</div>;

  return (
    <div className="p-8 h-full max-w-4xl mx-auto w-full relative pt-16">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-900/40 via-pink-900/40 rounded-b-3xl -z-10" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 rounded-2xl relative mt-20">
        <div className="absolute -top-16 left-8">
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-dark-bg bg-black shadow-[0_0_20px_rgba(236,72,153,0.5)]">
            <img src={profile?.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex justify-between items-start ml-40 min-h-[5rem]">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{profile?.username}</h1>
            <p className="text-slate-400 mt-1 flex items-center"><Mail size={16} className="mr-2" /> {profile?.email}</p>
          </div>
          <button onClick={() => setIsEditing(true)} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-medium border border-white/10 flex items-center">
            <Edit3 size={16} className="mr-2 text-pink-400" /> Edit Profile
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-black/40 rounded-xl border border-white/5">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center"><User className="text-purple-400 mr-2" size={20} /> Details</h3>
            <div className="space-y-4">
              <div><p className="text-xs text-slate-500">ID</p><p className="font-mono text-slate-300 text-sm truncate">{profile?.id}</p></div>
              <div><p className="text-xs text-slate-500">Join Date</p><p className="text-slate-300 text-sm">{profile?.created_at}</p></div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isEditing && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 shadow-lg" onClick={() => setIsEditing(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm glass-panel border border-pink-500/30 rounded-2xl relative z-10 p-6">
              <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-slate-400"><X size={20} /></button>
              <h2 className="text-xl font-bold mb-4 text-pink-400">Settings</h2>
              <div className="space-y-4">
                <div><label className="block text-sm text-slate-300">Username</label><input type="text" value={editUsername} onChange={e => setEditUsername(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-slate-200 mt-1" /></div>
                <div><label className="block text-sm text-slate-300">Email</label><input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-slate-200 mt-1" /></div>
                <div><label className="block text-sm text-slate-300">Avatar Image URL</label><input type="url" value={editAvatar} onChange={e => setEditAvatar(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-slate-200 mt-1" /></div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-2 rounded text-xs text-yellow-400 flex"><AlertTriangle size={14} className="mr-2 shrink-0" /> Changing emails requires validating verification links before it updates securely.</div>
                <button onClick={handleSaveProfile} disabled={saving} className="w-full bg-pink-600 text-white font-bold py-2 rounded-lg">{saving ? "Saving..." : "Save Changes"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
