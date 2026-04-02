"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Sparkles, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimeResult {
  mal_id: number;
  title: string;
  images: {
    webp: {
      large_image_url: string;
    };
  };
  episodes: number | null;
  score: number | null;
  synopsis: string;
}

interface AnimeSearchProps {
  onSelect: (anime: { title: string; coverImage: string; totalEpisodes: number }) => void;
}

export default function AnimeSearch({ onSelect }: AnimeSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`);
        const data = await response.json();
        setResults(data.data || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Jikan API error:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search global anime database..."
          className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 transition-all"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4 animate-spin" />}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#0D0D15] border border-white/10 rounded-xl overflow-hidden z-[60] shadow-2xl backdrop-blur-xl"
          >
            <div className="p-2 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center tracking-wider">
                <Sparkles className="w-3 h-3 mr-1 text-purple-400" /> Discoveries
              </span>
              <span className="text-[10px] text-slate-600">Jikan Database</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {results.map((anime) => (
                <button
                  key={anime.mal_id}
                  onClick={() => {
                    onSelect({
                      title: anime.title,
                      coverImage: anime.images.webp.large_image_url,
                      totalEpisodes: anime.episodes || 0,
                    });
                    setIsOpen(false);
                    setQuery(anime.title);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left group border-b border-white/5 last:border-0"
                >
                  <div className="w-10 h-14 rounded-md overflow-hidden shrink-0 border border-white/10 relative">
                     <img 
                      src={anime.images.webp.large_image_url} 
                      alt={anime.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-200 truncate group-hover:text-purple-400 transition-colors">
                      {anime.title}
                    </h4>
                    <div className="flex items-center text-[10px] text-slate-400 mt-1 gap-2">
                       <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5 lowercase">
                         {anime.episodes ? `${anime.episodes} eps` : 'ongoing'}
                       </span>
                       {anime.score && <span className="text-yellow-500/80">★ {anime.score}</span>}
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
