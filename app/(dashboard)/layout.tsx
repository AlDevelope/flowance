"use client";

import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { MobileHeader } from "@/components/MobileHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { useSync } from "@/lib/hooks/useSync";
import { motion } from "motion/react";

function SyncWrapper({ children }: { children: React.ReactNode }) {
  useSync();
  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SyncWrapper>
      <div className="flex h-screen bg-white font-sans text-slate-800 overflow-hidden">
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        <main className="flex-1 flex flex-col overflow-hidden pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 relative">
          <MobileHeader />
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 overflow-y-auto"
          >
            {children}
          </motion.div>
        </main>
        <MobileNav />
      </div>
    </SyncWrapper>
  );
}
