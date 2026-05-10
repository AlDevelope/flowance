"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Tags, 
  Target, 
  PieChart,
  LogOut
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transaksi", href: "/transactions", icon: ArrowRightLeft },
  { name: "Kategori", href: "/categories", icon: Tags },
  { name: "Anggaran", href: "/budgets", icon: Target },
  { name: "Laporan", href: "/reports", icon: PieChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useStore();

  return (
    <aside className="w-60 flex-shrink-0 bg-[#F9FAFB] border-r border-[#E5E7EB] flex flex-col">
      <div className="p-6">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium",
                isActive
                  ? "bg-white text-[#4CAF85] border border-[#E5E7EB]"
                  : "text-slate-500 hover:bg-slate-100 border border-transparent"
              )}
            >
              <item.icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4">
        <div className="bg-[#4CAF8510] border border-[#4CAF8530] p-4 rounded-xl">
          <p className="text-xs font-semibold text-[#4CAF85] uppercase tracking-wider mb-1">Tip Hemat</p>
          <p className="text-xs text-slate-600">Kamu menghemat 12% lebih banyak dibanding bulan lalu!</p>
        </div>
      </div>

      <div 
        className={cn(
          "border-t border-slate-200 p-4 flex items-center gap-2",
          pathname === "/profile" && "bg-white"
        )}
      >
        <Link href="/profile" className="flex items-center gap-3 flex-1 min-w-0 group">
          <div className="w-9 h-9 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden group-hover:ring-2 group-hover:ring-[#4CAF85] transition-all">
            <img 
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate font-display">{user.displayName}</p>
            <p className="text-[10px] font-medium text-slate-500 truncate">{user.email || 'Pengaturan Profil'}</p>
          </div>
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          type="button"
          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95"
          title="Keluar"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
