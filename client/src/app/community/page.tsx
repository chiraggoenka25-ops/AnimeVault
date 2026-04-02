"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ThumbsUp, ThumbsDown, Share2, Flame, Clock, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  title: string;
  description: string;
  author: string;
  time: string;
  rawTime: Date;
  upvotes: number;
  comments: number;
  tags: string[];
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await apiClient.get('/community/posts');
      const formattedPosts = res.data.data.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        author: p.users?.username || 'Unknown Otaku',
        time: new Date(p.created_at).toLocaleDateString(),
        rawTime: new Date(p.created_at),
        upvotes: p.upvotes || 0,
        comments: p.comments || 0,
        tags: p.tags || [],
      }));
      setPosts(formattedPosts.sort((a, b) => b.rawTime.getTime() - a.rawTime.getTime()));
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Set up Realtime WebSockets
    const channel = supabase.channel('realtime_posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => {
        // Trigger refetch instantly so new post pops up automatically!
        fetchPosts(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await apiClient.post('/community/posts', {
        title: newTitle,
        description: newDesc,
        tags: ["Discussion"]
      });
      setShowModal(false);
      setNewTitle("");
      setNewDesc("");
      // WebSockets will automatically trigger fetchPosts() for us!
    } catch (error) {
      console.error("Failed to post:", error);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto flex gap-8 h-full relative">
      <div className="flex-1 overflow-y-auto pr-4 pb-20">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 mr-3">Community</span>
              🔥
            </h1>
            <p className="text-slate-400">Discuss your favorite anime with fellow otakus</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          >
            Create Post
          </button>
        </header>

        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
          <button className="flex items-center text-emerald-400 font-medium bg-emerald-400/10 px-4 py-2 rounded-lg">
            <Flame size={18} className="mr-2" /> Trending
          </button>
          <button className="flex items-center text-slate-400 font-medium hover:bg-white/5 px-4 py-2 rounded-lg transition-colors">
            <Clock size={18} className="mr-2" /> Newest
          </button>
        </div>

        {loading ? (
          <div className="text-center text-emerald-400">Loading feeds...</div>
        ) : (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center text-slate-500 py-10">No posts. Be the first to start a discussion!</div>
            ) : posts.map((post, idx) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
                className="glass-panel p-0 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex">
                  <div className="bg-black/20 w-12 flex flex-col items-center py-4 border-r border-white/5 shrink-0">
                    <button className="text-slate-400 hover:text-emerald-400 transition-colors p-1">
                      <ThumbsUp size={20} />
                    </button>
                    <span className="font-bold py-2 text-sm">{post.upvotes}</span>
                    <button className="text-slate-400 hover:text-red-400 transition-colors p-1">
                      <ThumbsDown size={20} />
                    </button>
                  </div>
                  
                  <div className="p-5 flex-1 cursor-pointer">
                    <div className="flex items-center text-xs text-slate-400 mb-2">
                      <span className="font-semibold text-slate-300">@{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{post.time}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 text-slate-100">{post.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <span key={`${post.id}-${tag}`} className="flex items-center text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-300">
                          <Tag size={12} className="mr-1 text-emerald-400" /> {tag}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-slate-300 mb-4">{post.description}</p>
                    
                    <div className="flex items-center text-slate-400 text-sm gap-6">
                      <button className="flex items-center hover:text-emerald-400 transition-colors">
                        <MessageSquare size={18} className="mr-2" /> {post.comments} Comments
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="w-80 hidden lg:block shrink-0">
        <div className="glass-panel rounded-xl p-5 mb-6 sticky top-8">
          <h3 className="font-bold text-lg mb-4 text-emerald-400">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {["Discussion", "Review", "News", "Manga", "Theories", "Art", "Memes"].map(t => (
              <span key={t} className="bg-white/5 hover:bg-white/10 cursor-pointer border border-white/10 px-3 py-1.5 rounded-lg text-sm text-slate-300 transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg glass-panel border border-emerald-500/30 rounded-2xl relative z-10 p-6"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold mb-6 text-emerald-400">Create a Discussion</h2>
              
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    placeholder="What's your hot take?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Content</label>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none"
                    placeholder="Explain your thoughts in detail..."
                  />
                </div>
                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    Post to Community
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
