import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AnimeVault | Secure Personal Media & Community",
  description: "Your secure personal anime media platform and community discussion system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dark-bg text-slate-100 flex h-screen overflow-hidden`}>
        {/* We will conditionally render the sidebar based on auth state later, for now we will show it */}
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10 -z-10" />
          {children}
        </main>
      </body>
    </html>
  );
}
