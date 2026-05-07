"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Plus,
  Target, 
  Bell
} from "lucide-react";

const navItems = [
  { name: "Beranda", href: "/", icon: LayoutDashboard },
  { name: "Riwayat", href: "/transactions", icon: ArrowRightLeft },
  { name: "Tambah", href: "#", isAction: true },
  { name: "Anggaran", href: "/budgets", icon: Target },
  { name: "Notif", href: "/reports", icon: Bell },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Curved Shadow Effect */}
      <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-black/[0.03] to-transparent pointer-events-none"></div>
      
      <div className="bg-white/90 backdrop-blur-xl border-t border-slate-100 px-2 pb-safe pt-2 h-16 flex items-center justify-around">
        {navItems.map((item, idx) => {
          if (item.isAction) {
            return (
              <div key="fab-placeholder" className="relative -mt-10 mx-2">
                 <button 
                  className="w-14 h-14 bg-[#4CAF85] text-white rounded-2xl shadow-lg shadow-[#4CAF85]/30 flex items-center justify-center transform active:scale-90 transition-transform"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-new-item-modal'));
                  }}
                 >
                   <Plus className="w-8 h-8" strokeWidth={3} />
                 </button>
              </div>
            );
          }

          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[56px]",
                isActive ? "text-[#4CAF85]" : "text-slate-400"
              )}
            >
              <item.icon className={cn("w-5 h-5 mb-1 transition-transform", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold">{item.name}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -top-2 w-1 h-1 bg-[#4CAF85] rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
