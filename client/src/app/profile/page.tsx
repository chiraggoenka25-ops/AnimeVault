"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { User, Mail, Calendar, Settings, Edit3, X, Save, AlertTriangle, Sparkles, Zap, Folder, List, Users as UsersIcon, Image as ImageIcon, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editBanner, setEditBanner] = useState("");
  const [aura, setAura] = useState("default");
  const [stats, setStats] = useState({ files: 0, watchlist: 0, characters: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
      
      // Fetch Stats
      const [filesRes, watchRes, charRes] = await Promise.all([
        supabase.from("anime_files").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("watchlist").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("characters").select("id", { count: "exact" }).eq("user_id", user.id),
      ]);

      setStats({
        files: filesRes.count || 0,
        watchlist: watchRes.count || 0,
        characters: charRes.count || 0,
      });

      setProfile({
        id: user.id,
        username: data?.username || "Unknown",
        email: user.email || "",
        avatar_url: data?.avatar_url || "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=200&auto=format&fit=crop",
        banner_url: data?.banner_url || "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
        xp: data?.xp || 0,
        aura_theme: data?.aura_theme || "default",
        created_at: new Date(data?.created_at || user.created_at).toLocaleDateString(),
      });
      setEditUsername(data?.username || "");
      setEditEmail(user.email || "");
      setEditAvatar(data?.avatar_url || "");
      setEditBanner(data?.banner_url || "");
      setAura(data?.aura_theme || "default");
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await supabase.from("users").update({ 
        username: editUsername,
        avatar_url: editAvatar,
        banner_url: editBanner,
        aura_theme: aura
      }).eq("id", profile.id);

      if (editEmail !== profile.email) {
        const { error } = await supabase.auth.updateUser({ email: editEmail });
        if (error) alert("Email change requested! Check your current email AND new email for verification links.");
      }
      
      setProfile({ ...profile, username: editUsername, email: editEmail, avatar_url: editAvatar, banner_url: editBanner, aura_theme: aura });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const getRank = (xp: number) => {
    if (xp >= 2000) return "Hokage 👺";
    if (xp >= 1000) return "Jonin ⚔️";
    if (xp >= 500) return "Chunin 🛡️";
    return "Genin 🍃";
  };

  if (loading) return <div className="p-8 text-pink-400 m-auto">Loading Profile...</div>;

  return (
    <div className="p-8 h-full max-w-5xl mx-auto w-full relative pt-20">
      {/* Banner Section */}
      <div className="absolute top-0 left-0 w-full h-80 -z-10 group overflow-hidden rounded-b-[3rem]">
        <img 
          src={profile?.banner_url} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          alt="Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0D0D15]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 rounded-[2.5rem] relative mt-24 border-white/5 shadow-2xl backdrop-blur-3xl">
        <div className="absolute -top-20 left-12 flex items-end gap-6">
          <div className="w-40 h-40 rounded-[2rem] overflow-hidden border-8 border-[#0D0D15] bg-black shadow-[0_20px_50px_rgba(139,92,246,0.3)]">
            <img src={profile?.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="mb-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">
                <ShieldCheck size={12} /> {getRank(profile?.xp)}
             </div>
             <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">{profile?.username}</h1>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button onClick={() => setIsEditing(true)} className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl font-bold border border-white/10 flex items-center transition-all">
            <Edit3 size={18} className="mr-2 text-purple-400" /> Customize Profile
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: "Total XP", val: profile?.xp, icon: Zap, color: "text-yellow-400" },
             { label: "Vault Files", val: stats.files, icon: Folder, color: "text-blue-400" },
             { label: "Watchlist", val: stats.watchlist, icon: List, color: "text-pink-400" },
             { label: "Shrines", val: stats.characters, icon: UsersIcon, color: "text-purple-400" },
           ].map((s, idx) => (
             <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center">
                <s.icon size={20} className={`${s.color} mb-2`} />
                <span className="text-2xl font-black text-white">{s.val}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
             </div>
           ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Aura Selector */}
          <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Sparkles className="text-yellow-400 mr-3" size={20} /> 
              Elite Aura Select
            </h3>
            <div className="grid grid-cols-2 gap-3">
               {[
                 { id: 'default', name: 'Original', color: 'bg-purple-600' },
                 { id: 'naruto', name: 'Will of Fire', color: 'bg-orange-600' },
                 { id: 'demon-slayer', name: 'Breathing Style', color: 'bg-emerald-600' },
                 { id: 'cyberpunk', name: 'Night City', color: 'bg-yellow-400' },
               ].map((t) => (
                 <button 
                  key={t.id}
                  onClick={() => setAura(t.id)}
                  className={`p-3 rounded-xl border transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-between ${
                    aura === t.id ? 'border-white bg-white/10 aura-text' : 'border-white/5 hover:bg-white/5 text-slate-500'
                  }`}
                 >
                   {t.name}
                   <div className={`w-2 h-2 rounded-full ${t.color}`} />
                 </button>
               ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-4 italic">Auras dynamically transform your profile's energy and glow.</p>
          </div>
          
          <div className="p-6 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <ImageIcon size={100} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <User className="text-purple-400 mr-3 shadow-purple-500/50" size={20} /> 
              Identity Vault
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 italic flex items-center gap-2">
                   <Mail size={12} /> Contact Secured
                </p>
                <p className="text-slate-300 font-medium">{profile?.email}</p>
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 italic flex items-center gap-2">
                   <Calendar size={12} /> Member Since
                </p>
                <p className="text-slate-300 font-medium">{profile?.created_at}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Progression Card */}
           <div className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/10 rounded-2xl border border-purple-500/10">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Zap className="text-yellow-400 mr-3" size={20} /> 
              Rank Mastery
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-slate-400">XP Progress</span>
                  <span className="text-sm font-black text-purple-400">{profile?.xp % 500} / 500</span>
               </div>
               <div className="w-full h-3 bg-black/50 rounded-full border border-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(profile?.xp % 500) / 5}%` }}
                    className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto] shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                  />
               </div>
               <p className="text-xs text-slate-500 italic mt-4">Gain XP by sharing with the community and expanding your vault.</p>
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
                <div><label className="block text-xs font-bold text-slate-400 uppercase mb-1">Avatar Image URL</label><input type="url" value={editAvatar} onChange={e => setEditAvatar(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-slate-200 mt-1 text-xs focus:border-purple-500/50 outline-none" /></div>
                <div><label className="block text-xs font-bold text-slate-400 uppercase mb-1">Banner Image URL</label><input type="url" value={editBanner} onChange={e => setEditBanner(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-slate-200 mt-1 text-xs focus:border-purple-500/50 outline-none" /></div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl text-[10px] text-yellow-400 flex items-center"><AlertTriangle size={14} className="mr-2 shrink-0" /> Security: Changing email requires two-factor validation via email links.</div>
                <button onClick={handleSaveProfile} disabled={saving} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all mt-2">{saving ? "Updating Genesis..." : "Push Modifications"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
