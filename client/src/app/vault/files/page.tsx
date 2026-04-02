"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, UploadCloud, Search, FileText, Image as ImageIcon, Film, HardDrive, MoreVertical, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { apiClient } from "@/lib/api";

type VaultFile = {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  icon: any;
  color: string;
};

export default function VaultFilesPage() {
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await apiClient.get('/vault/files');
      const formatted = res.data.data.map((f: any) => ({
        id: f.id,
        name: f.filename,
        type: f.file_type,
        size: `${Math.round(f.size / 1024 / 1024)} MB`,
        date: new Date(f.created_at).toLocaleDateString(),
        icon: f.file_type.includes('video') ? Film : f.file_type.includes('image') ? ImageIcon : FileText,
        color: f.file_type.includes('video') ? "text-purple-400" : f.file_type.includes('image') ? "text-pink-400" : "text-blue-400",
      }));
      setFiles(formatted);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await apiClient.post('/vault/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchFiles(); // Refresh list after upload
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Make sure your 'vault' bucket exists and is public.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-8 h-full flex flex-col relative">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <FolderOpen className="text-purple-400 mr-3" size={32} />
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 ml-2">Vault Files</span>
          </h1>
          <p className="text-slate-400">Securely store your episodes, manga pdfs, and wallpapers</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500/50 text-slate-200 transition-colors w-full md:w-64"
            />
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center shrink-0"
          >
            <UploadCloud size={18} className="mr-2" /> {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </header>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm mb-1">Total Files</p>
            <p className="text-xl font-bold text-slate-200">{files.length}</p>
          </div>
          <div className="p-3 bg-pink-500/10 rounded-lg text-pink-400">
            <FolderOpen size={24} />
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl flex-1 overflow-hidden flex flex-col">
        <div className="grid grid-cols-12 gap-4 place-items-center p-4 border-b border-white/10 text-sm font-medium text-slate-400 bg-white/5">
          <div className="col-span-6 place-self-start ml-2">Name</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-3">Date Added</div>
          <div className="col-span-1">Action</div>
        </div>
        
        <div className="overflow-y-auto p-2 min-h-[200px] relative">
          {loading ? (
             <div className="absolute inset-0 flex items-center justify-center text-purple-400">Loading files...</div>
          ) : filteredFiles.length === 0 ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
               <FolderOpen size={48} className="mb-4 opacity-30" />
               <p>{searchQuery ? "No matching files found." : "Your vault is empty. Upload your first anime file!"}</p>
             </div>
          ) : filteredFiles.map((file, idx) => {
            const IconComponent = file.icon;
            return (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={file.id} 
                className="grid grid-cols-12 gap-4 place-items-center p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group border-b border-white/5 last:border-0"
              >
                <div className="col-span-6 place-self-start flex items-center w-full truncate pr-4">
                  <div className={`p-2 rounded-lg bg-white/5 mr-3 group-hover:bg-black/20 ${file.color}`}>
                    <IconComponent size={18} />
                  </div>
                  <span className="font-medium text-slate-300 truncate">{file.name}</span>
                </div>
                <div className="col-span-2 text-sm text-slate-400">{file.size}</div>
                <div className="col-span-3 text-sm text-slate-400">{file.date}</div>
                <div className="col-span-1">
                  <button className="text-slate-500 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
