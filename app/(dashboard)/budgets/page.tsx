"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatRupiahInput, parseRupiah } from "@/lib/utils";

export default function BudgetsPage() {
  const { budgets, categories, transactions, addBudget, deleteBudget, searchTerm } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [budgetCategoryId, setBudgetCategoryId] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  // Use current month by default
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [budgetMonth, setBudgetMonth] = useState(currentMonthStr);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState(currentMonthStr);

  useEffect(() => {
    setMounted(true);
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('open-new-item-modal', handleOpenModal);
    return () => window.removeEventListener('open-new-item-modal', handleOpenModal);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseRupiah(budgetAmount);
    if (!budgetCategoryId || !numericAmount || !budgetMonth) return;
    addBudget({
      categoryId: budgetCategoryId,
      amount: numericAmount,
      month: budgetMonth
    });
    setIsModalOpen(false);
    setBudgetAmount('');
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  if (!mounted) return <div className="p-8">Memuat...</div>;

  const expenseCategories = categories.filter(c => c.type === 'EXPENSE');
  const activeBudgets = budgets.filter(b => {
    const matchesMonth = b.month === selectedMonthFilter;
    const cat = categories.find(c => c.id === b.categoryId);
    const matchesSearch = searchTerm 
      ? (cat && cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return matchesMonth && matchesSearch;
  });

  return (
    <>
      <header className="h-16 flex-shrink-0 border-b border-[#E5E7EB] px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <h1 className="text-xs md:text-xl font-bold text-slate-900 whitespace-nowrap">Anggaran</h1>
          <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>
          <div className="flex items-center bg-[#F9FAFB] border border-[#E5E7EB] px-2 md:px-3 py-1 md:py-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0">
            <input type="month" value={selectedMonthFilter} onChange={(e) => setSelectedMonthFilter(e.target.value)} className="bg-transparent text-[9px] md:text-sm font-medium text-slate-600 outline-none cursor-pointer w-20 md:w-auto" />
          </div>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button data-tx-trigger="true" className="hidden md:flex bg-[#4CAF85] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold shadow-sm hover:bg-[#4CAF85]/90 items-center gap-1 md:gap-2 whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              <span>Anggaran Baru</span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Anggaran Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kategori Pengeluaran</label>
                <select required value={budgetCategoryId} onChange={(e) => setBudgetCategoryId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF85] text-slate-900 bg-white">
                  <option value="" disabled>Pilih Kategori</option>
                  {expenseCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nominal Anggaran (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
                  <input type="text" required value={budgetAmount} onChange={(e) => setBudgetAmount(formatRupiahInput(e.target.value))} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF85] text-slate-900 font-medium tracking-wide" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bulan</label>
                <input type="month" required value={budgetMonth} onChange={(e) => setBudgetMonth(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF85] text-slate-900 font-medium" />
              </div>
              <button type="submit" className="w-full bg-[#4CAF85] text-white py-2 rounded-lg font-bold hover:bg-[#3d9871] transition-colors">Simpan Anggaran</button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
           {activeBudgets.length > 0 ? (
             activeBudgets.map(b => {
               const cat = categories.find(c => c.id === b.categoryId);
               if (!cat) return null;
               
               const spent = transactions
                 .filter(t => t.type === 'EXPENSE' && t.categoryId === b.categoryId && t.date.startsWith(b.month))
                 .reduce((sum, t) => sum + t.amount, 0);
               
               const percent = Math.min(100, (spent / b.amount) * 100);
               const isOver = spent > b.amount;
               const isNear = percent >= 80 && percent <= 100;

               return (
                 <div key={b.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm relative group overflow-hidden hover:shadow-md hover:border-slate-200 transition-all transform hover:-translate-y-0.5 cursor-default">
                   <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>{cat.icon}</div>
                       <div>
                         <h3 className="font-bold text-slate-900">{cat.name}</h3>
                         <p className="text-xs text-slate-500 font-medium">{isOver ? 'Melebihi batas!' : isNear ? 'Hampir habis' : 'Masih aman'}</p>
                       </div>
                     </div>
                     <button onClick={() => deleteBudget(b.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-colors bg-white p-1 rounded-md border border-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                     </button>
                   </div>
                   
                   <div>
                     <div className="flex justify-between items-end mb-2">
                       <p className={`text-2xl font-bold ${isOver ? 'text-red-500' : 'text-slate-900'}`}>{formatIDR(spent)}</p>
                       <p className="text-sm font-medium text-slate-400">dari {formatIDR(b.amount)}</p>
                     </div>
                     <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : isNear ? 'bg-amber-400' : 'bg-[#4CAF85]'}`} style={{ width: `${percent}%` }}></div>
                     </div>
                   </div>
                   
                   {isOver && (
                     <div className="mt-4 bg-red-50 text-red-600 text-xs font-medium p-2 rounded-lg flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                       Pengeluaran melebihi anggaran sebesar {formatIDR(spent - b.amount)}
                     </div>
                   )}
                 </div>
               );
             })
           ) : (
             <div className="col-span-1 md:col-span-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl flex justify-center items-center h-[400px] text-slate-500 text-sm">
               Belum ada anggaran yang diatur untuk bulan ini.
             </div>
           )}
        </div>
      </div>
    </>
  );
}
