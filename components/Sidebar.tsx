"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="w-60 flex-shrink-0 bg-[#F9FAFB] border-r border-[#E5E7EB] flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#4CAF85] rounded-xl flex items-center justify-center text-white shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><rect x="2" y="9" width="20" height="6" rx="2"/></svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">Flowance</span>
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

      <div className="border-t border-[#E5E7EB] p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">Alam</p>
          <p className="text-[10px] text-slate-500 truncate">alam@flowance.io</p>
        </div>
        <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
