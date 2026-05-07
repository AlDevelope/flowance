"use client";

import { Wallet, Bell, Search, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";

export function MobileHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useStore();

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-[#4CAF85] rounded-xl flex items-center justify-center text-white shadow-sm shadow-[#4CAF85]/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><rect x="2" y="9" width="20" height="6" rx="2"/></svg>
        </div>
        <span className="font-bold text-slate-900 tracking-tight text-lg">Flowance</span>
      </div>
      
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
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {isNotifOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <button onClick={() => setIsNotifOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-[#4CAF85]" />
                Notifikasi
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Anggaran Makan", desc: "Sisa anggaran makan kamu tinggal 10%.", time: "2 jam yang lalu" },
                  { title: "Pemasukan Baru", desc: "Gaji bulan ini telah masuk ke rekening.", time: "5 jam yang lalu" },
                  { title: "Mingguan Selesai", desc: "Laporan pengeluaran mingguan sudah siap.", time: "Kemarin" }
                ].map((n, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 italic">
                    <p className="text-sm font-bold text-slate-800">{n.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{n.desc}</p>
                    <p className="text-[10px] text-slate-400 mt-2">{n.time}</p>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setIsNotifOpen(false)}
                className="w-full mt-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
        <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden ml-1">
          <Image 
            src="https://picsum.photos/seed/user/100/100" 
            alt="Profile" 
            width={32} 
            height={32}
            className="object-cover"
          />
        </div>
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
