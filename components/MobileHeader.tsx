"use client";

import { Wallet, Bell, Search, X, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Logo } from "./Logo";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function MobileHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { searchTerm, setSearchTerm, user, transactions } = useStore();

  const notifications = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastYear = lastMonthDate.getFullYear();

    const currentTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const lastMonthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
    });

    const currentIncome = currentTransactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const currentExpense = currentTransactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    const lastMonthExpense = lastMonthTransactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);

    const reports = [];

    // Compare with last month
    if (lastMonthExpense > 0) {
      const diff = ((currentExpense - lastMonthExpense) / lastMonthExpense) * 100;
      if (diff > 0) {
        reports.push({
          id: 'diff',
          title: "Kenaikan Pengeluaran",
          desc: `Pengeluaran kamu naik ${diff.toFixed(1)}% dibanding bulan ${format(lastMonthDate, 'MMMM', { locale: id })}.`,
          type: 'warning',
          icon: TrendingUp
        });
      } else if (diff < 0) {
        reports.push({
          id: 'diff',
          title: "Penurunan Pengeluaran",
          desc: `Hebat! Pengeluaran kamu turun ${Math.abs(diff).toFixed(1)}% dibanding bulan lalu.`,
          type: 'success',
          icon: TrendingDown
        });
      }
    }

    // Ratio check
    if (currentIncome > 0) {
      const ratio = (currentExpense / currentIncome) * 100;
      if (ratio > 80) {
        reports.push({
          id: 'ratio',
          title: "Waspada Pengeluaran",
          desc: `Kamu sudah menggunakan ${ratio.toFixed(0)}% dari total pendapatan bulan ini.`,
          type: 'danger',
          icon: AlertCircle
        });
      }
    }

    return reports;
  }, [transactions]);

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5">
        <Logo size={20} iconClassName="w-9 h-9" className="gap-2.5" />
      </Link>
      
      <div className="flex items-center gap-1">
        <button 
          onClick={() => {
            setIsSearchOpen(!isSearchOpen);
            if (isSearchOpen) setSearchTerm("");
          }}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setIsNotifOpen(true)}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          {notifications.length > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        {isNotifOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <button onClick={() => setIsNotifOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-[#4CAF85]" />
                Insight Keuangan
              </h3>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className={cn(
                      "p-4 rounded-2xl border flex gap-3",
                      n.type === 'danger' ? "bg-red-50 border-red-100" : 
                      n.type === 'warning' ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"
                    )}>
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        n.type === 'danger' ? "bg-red-500 text-white" : 
                        n.type === 'warning' ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                      )}>
                        <n.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className={cn(
                          "text-sm font-bold",
                          n.type === 'danger' ? "text-red-900" : 
                          n.type === 'warning' ? "text-amber-900" : "text-emerald-900"
                        )}>{n.title}</p>
                        <p className={cn(
                          "text-xs mt-0.5 leading-relaxed",
                          n.type === 'danger' ? "text-red-700 font-medium" : 
                          n.type === 'warning' ? "text-amber-700 font-medium" : "text-emerald-700 font-medium"
                        )}>{n.desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <Bell className="w-8 h-8" />
                    </div>
                    <p className="text-slate-500 font-medium">Semua terkendali!</p>
                    <p className="text-xs text-slate-400 mt-1">Belum ada notifikasi baru untuk kamu.</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsNotifOpen(false)}
                className="w-full mt-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-900/20"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
        <Link href="/profile" className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden ml-1 hover:border-[#4CAF85] transition-colors">
          <img 
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-3 animate-in slide-in-from-top duration-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              autoFocus
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari transaksi atau kategori..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF85]/50"
            />
          </div>
        </div>
      )}
    </header>
  );
}
