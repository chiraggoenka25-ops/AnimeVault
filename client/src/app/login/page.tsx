"use client";

import { motion } from "framer-motion";
import { Lock, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first to reset password.");
      return;
    }
    setLoading(true);
    setError("");
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("Success! Check your email for the password reset link.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-dark-bg font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-10 glass-panel border border-white/10 rounded-3xl relative shadow-[0_0_50px_rgba(139,92,246,0.1)]"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4"
          >
            Personal Sanctuary
          </motion.div>
          <h1 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-pink-500 neon-text-purple tracking-tighter">
            AnimeVault
          </h1>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            className={`mb-6 p-4 rounded-xl text-sm border flex items-start gap-3 ${
              error.includes("Success") 
                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                : "bg-red-500/10 border-red-500/50 text-red-400"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {error.includes("Success") ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-red-400" />}
            </div>
            <div className="flex-1">
              <p className="font-semibold leading-snug">{error}</p>
              {error.includes("rate limit") && (
                <p className="mt-1 text-xs opacity-70 italic border-t border-white/5 pt-1 mt-2">
                  Please wait about 60 seconds before trying again.
                </p>
              )}
            </div>
          </motion.div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-sans"
                placeholder="shinji@ikari.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex justify-between">
              Password
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-pink-400 hover:text-purple-400 transition-colors"
              >
                Forgot?
              </button>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
                placeholder="••••••••"
                required={!loading}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all mt-4 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Enter Vault"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Don't have a vault yet? <Link href="/register" className="text-pink-400 hover:text-purple-400 font-medium transition-colors">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
