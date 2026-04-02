"use client";

import { motion } from "framer-motion";
import { FolderOpen, ListVideo, PenTool, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const quickLinks = [
    { title: "Anime Files", desc: "Manage your vault storage", icon: FolderOpen, href: "/vault/files", color: "text-purple-400" },
    { title: "Watchlist", desc: "Track your current series", icon: ListVideo, href: "/vault/watchlist", color: "text-pink-400" },
    { title: "Notes", desc: "Review and organize thoughts", icon: PenTool, href: "/vault/notes", color: "text-blue-400" },
    { title: "Community", desc: "Join the discussion", icon: Users, href: "/community", color: "text-emerald-400" },
  ];

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold mb-2"
        >
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">AnimeVault</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg"
        >
          Your personal data is secure. Dive into the community when you are ready.
        </motion.p>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <motion.div key={link.title} variants={itemVariants}>
              <Link href={link.href} className="block h-full group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative glass-card h-full p-6 flex flex-col justify-between">
                  <div>
                    <div className={`p-3 bg-white/5 rounded-lg w-fit mb-4 ${link.color}`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">{link.desc}</p>
                  </div>
                  <div className="flex items-center text-sm font-medium text-slate-300 group-hover:text-purple-400 transition-colors">
                    Access <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-panel rounded-2xl p-6"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <span className="w-2 h-6 bg-pink-500 rounded-full mr-3 neon-border-pink"></span>
            Recent Vault Activity
          </h2>
          <div className="text-center text-slate-500 py-10">
            <FolderOpen size={48} className="mx-auto mb-4 opacity-20" />
            <p>Your vault is empty. Started adding your favorite anime records!</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel rounded-2xl p-6"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <span className="w-2 h-6 bg-purple-500 rounded-full mr-3 border-none" style={{boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)'}}></span>
            Trending Feed
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-pink-400 bg-pink-400/10 px-2 py-1 rounded">Discussion</span>
                <span className="text-xs text-slate-500">2h ago</span>
              </div>
              <h4 className="font-semibold text-slate-200 mb-1">AOT Ending Thoughts</h4>
              <p className="text-sm text-slate-400 line-clamp-2">What did everyone think about the final episode? I feel like the animation was on point but...</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
