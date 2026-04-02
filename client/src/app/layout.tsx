"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [aura, setAura] = useState("default");

  useEffect(() => {
    const fetchAura = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('aura_theme').eq('id', user.id).single();
        if (data?.aura_theme) setAura(data.aura_theme);
      }
    };
    fetchAura();

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
          console.log('SW Registered', reg.scope);
        }).catch((err) => {
          console.log('SW Registration failed', err);
        });
      });
    }

    const channel = supabase.channel('aura_sync')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, (payload) => {
        if (payload.new.aura_theme) setAura(payload.new.aura_theme);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <html lang="en" className="dark" data-aura={aura}>
      <head>
        <title>AnimeVault Elite | Secure Media & Social</title>
        <meta name="description" content="Elite Personal Anime Media Vault & Real-time Community" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=192&auto=format&fit=crop" />
      </head>
      <body className={`${inter.className} bg-dark-bg text-slate-100 flex h-screen overflow-hidden`}>
        <Sidebar aria-aura={aura} />
        <main className="flex-1 overflow-y-auto relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-black to-blue-900/5 -z-10" />
          {children}
        </main>
      </body>
    </html>
  );
}
