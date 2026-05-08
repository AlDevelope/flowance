"use client";

import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { MobileHeader } from "@/components/MobileHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { useSync } from "@/lib/hooks/useSync";

function SyncWrapper({ children }: { children: React.ReactNode }) {
  useSync();
  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [router]);

  if (!isReady) return null;

  return (
    <SessionProvider>
      <SyncWrapper>
        <div className="flex h-screen bg-white font-sans text-slate-800 overflow-hidden">
          <div className="hidden md:flex">
            <Sidebar />
          </div>
          <main className="flex-1 flex flex-col overflow-hidden pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
            <MobileHeader />
            {children}
          </main>
          <MobileNav />
        </div>
      </SyncWrapper>
    </SessionProvider>
  );
}
