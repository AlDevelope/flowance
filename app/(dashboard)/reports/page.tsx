"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";

export default function ReportsPage() {
  const { transactions, categories, budgets } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  if (!mounted) return <div className="p-8">Memuat...</div>;

  // Generate automated insight notifications
  const notifications = [];

  // Sort transactions chronology
  const recentTxs = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Check budget warnings
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  budgets.filter(b => b.month === currentMonthStr).forEach(b => {
    const cat = categories.find(c => c.id === b.categoryId);
    if (!cat) return;
    
    const spent = transactions
      .filter(t => t.type === 'EXPENSE' && t.categoryId === b.categoryId && t.date.startsWith(b.month))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const percent = (spent / b.amount) * 100;
    if (percent >= 100) {
      notifications.push({
        id: `alert-budget-over-${b.id}`,
        type: 'DANGER',
        title: 'Anggaran Terlampaui!',
        message: `Kategori ${cat.name} melebihi anggaran sebesar ${formatIDR(spent - b.amount)}.`,
        date: new Date().toISOString(),
        icon: '⚠️'
      });
    } else if (percent >= 80) {
      notifications.push({
        id: `alert-budget-near-${b.id}`,
        type: 'WARNING',
        title: 'Peringatan Anggaran',
        message: `Pengeluaran ${cat.name} sudah mencapai ${percent.toFixed(0)}% dari anggaran.`,
        date: new Date().toISOString(),
        icon: '🔔'
      });
    }
  });

  // Map recent transactions into notifications
  recentTxs.slice(0, 15).forEach(tx => {
    const cat = categories.find(c => c.id === tx.categoryId);
    const isIncome = tx.type === 'INCOME';
    notifications.push({
      id: `tx-${tx.id}`,
      type: isIncome ? 'SUCCESS' : 'INFO',
      title: isIncome ? 'Pemasukan Baru' : 'Pengeluaran Tercatat',
      message: `${isIncome ? 'Menerima' : 'Mengeluarkan'} ${formatIDR(tx.amount)} untuk ${cat?.name || 'Kategori tidak diketahui'} ${tx.note ? `(${tx.note})` : ''}.`,
      date: tx.date,
      icon: isIncome ? '💰' : '💸'
    });
  });

  // Sort all notifications by date/id mock
  notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || a.id.localeCompare(b.id));

  return (
    <>
      <header className="h-16 flex-shrink-0 border-b border-[#E5E7EB] px-4 md:px-8 flex items-center justify-between">
        <h1 className="text-xs md:text-xl font-bold text-slate-900 whitespace-nowrap">Laporan & Notifikasi</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-3xl mx-auto w-full">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notif, i) => {
              let colorClass = "bg-white border-[#E5E7EB]";
              if (notif.type === 'DANGER') colorClass = "bg-red-50 border-red-100";
              else if (notif.type === 'WARNING') colorClass = "bg-amber-50 border-amber-100";
              else if (notif.type === 'SUCCESS') colorClass = "bg-[#4CAF85]/5 border-[#4CAF85]/20";

              return (
                <div key={notif.id + i} className={`border rounded-2xl p-5 flex gap-4 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${colorClass}`}>
                  <div className="w-10 h-10 flex-shrink-0 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-slate-100">
                    {notif.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-900">{notif.title}</h4>
                      <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">
                        {new Date(notif.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 flex flex-col flex-1 min-h-[400px] justify-center items-center">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">📭</div>
             <p className="text-slate-500 font-medium">Belum ada aktivitas yang tercatat.</p>
          </div>
        )}
      </div>
    </>
  );
}
