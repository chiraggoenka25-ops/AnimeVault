"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, X, SkipForward, SkipBack, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPlayerProps {
  url: string;
  onClose: () => void;
  title?: string;
}

export default function VideoPlayer({ url, onClose, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) videoRef.current.pause();
      else videoRef.current.play();
      setPlaying(!playing);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-4"
    >
      <div className="w-full max-w-6xl relative group rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(139,92,246,0.2)] bg-black">
        <video 
          ref={videoRef}
          src={url}
          className="w-full h-full cursor-pointer aspect-video"
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlay}
          autoPlay
        />

        {/* Top Header */}
        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent"
            >
              <h2 className="text-xl font-black text-white italic tracking-tighter drop-shadow-md">
                Watching: <span className="text-purple-400 font-bold">{title || "Anime File"}</span>
              </h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all"
              >
                <X className="text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            >
              {/* Progress Bar */}
              <div className="relative w-full h-1.5 mb-6 group/seeker">
                 <input 
                  type="range" min="0" max="100" step="0.1" value={progress}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                />
                <div className="absolute inset-0 bg-white/10 rounded-full" />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)]" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Control Buttons Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                   <button onClick={togglePlay} className="p-2 text-white hover:text-purple-400 transition-colors">
                     {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                   </button>
                   <div className="flex items-center gap-4">
                      <button onClick={() => setMuted(!muted)} className="p-2 text-white hover:text-purple-400">
                        {muted ? <VolumeX /> : <Volume2 />}
                      </button>
                      <div className="w-24 h-1 bg-white/10 rounded-full relative overflow-hidden hidden md:block">
                         <div className="absolute inset-0 bg-white/40 w-3/4 rounded-full" />
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-6 text-slate-400">
                   <Settings size={20} className="hover:text-white cursor-pointer" />
                   <Maximize2 size={20} className="hover:text-white cursor-pointer" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <p className="mt-6 text-slate-500 text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">AnimeVault Cinema Mode Active</p>
    </motion.div>
  );
}
