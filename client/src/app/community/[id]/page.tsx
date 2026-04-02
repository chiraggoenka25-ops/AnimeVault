"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ThumbsUp, ThumbsDown, Share2, ArrowLeft, Send, CornerDownRight, ShieldCheck, Zap } from "lucide-react";
import { apiClient } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await apiClient.get(`/community/posts/${id}`);
      setPost(res.data.post);
      setComments(res.data.comments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await apiClient.post('/community/comments', {
        post_id: id,
        content: newComment,
        parent_id: replyTo
      });
      setComments([...comments, res.data.data]);
      setNewComment("");
      setReplyTo(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Nesting logic
  const renderComments = (parentId: string | null = null, depth = 0) => {
    return comments
      .filter(c => c.parent_id === parentId)
      .map(comment => (
        <motion.div 
          key={comment.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ marginLeft: depth > 0 ? `${depth * 2}rem` : '0' }}
          className="mt-6 border-l-2 border-white/5 pl-6 relative group"
        >
          <div className="flex items-center gap-2 mb-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
             <span className="text-slate-300">@{comment.users?.username}</span>
             <span>•</span>
             <span>{new Date(comment.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">{comment.content}</p>
          <button 
            onClick={() => { setReplyTo(comment.id); setNewComment(`@${comment.users?.username} `); }}
            className="text-[10px] font-black text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest flex items-center gap-2"
          >
            <CornerDownRight size={10} /> Reply
          </button>
          {renderComments(comment.id, depth + 1)}
        </motion.div>
      ));
  };

  if (loading) return <div className="p-10 text-purple-400 m-auto text-center animate-pulse">Establishing neural link...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto w-full relative">
       <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Feed
       </button>

       {post && (
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            {/* Main Post */}
            <div className="glass-panel p-8 rounded-[2rem] border-white/5 relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
               
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {post.users?.username?.[0].toUpperCase()}
                  </div>
                  <div>
                     <p className="text-sm font-bold text-white flex items-center gap-2">
                       @{post.users?.username} <ShieldCheck size={14} className="text-purple-400" />
                     </p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(post.created_at).toDateString()}</p>
                  </div>
               </div>

               <h1 className="text-4xl font-black text-white tracking-tighter mb-4 leading-tight">{post.title}</h1>
               <p className="text-slate-300 text-lg leading-relaxed mb-8">{post.description}</p>

               <div className="flex items-center gap-8 border-t border-white/5 pt-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2 text-white">
                     <ThumbsUp size={16} className="text-purple-400" /> {post.upvotes} Votes
                  </div>
                  <div className="flex items-center gap-2">
                     <MessageSquare size={16} /> {comments.length} Discussions
                  </div>
               </div>
            </div>

            {/* Discussion Thread */}
            <div className="mt-12">
               <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                  Thread Mastery <div className="h-px bg-white/10 flex-1" />
               </h2>

               <form onSubmit={handleSubmitComment} className="mb-10 relative">
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={replyTo ? "Entering sub-layer..." : "Share your insight..."}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-slate-200 focus:outline-none focus:border-purple-500/50 resize-none min-h-[120px] transition-all"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-3">
                     {replyTo && (
                       <button onClick={() => setReplyTo(null)} className="text-[10px] font-bold text-red-400 uppercase tracking-widest mr-2">Cancel Reply</button>
                     )}
                     <button type="submit" className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg transition-all group">
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                     </button>
                  </div>
               </form>

               <div className="space-y-6">
                  {renderComments()}
                  {comments.length === 0 && (
                    <div className="p-10 text-center opacity-30">
                       <p className="text-xs font-bold uppercase tracking-[0.5em]">Tread quiet. No voices found yet.</p>
                    </div>
                  )}
               </div>
            </div>
         </motion.div>
       )}
    </div>
  );
}
