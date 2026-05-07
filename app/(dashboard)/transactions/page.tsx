"use client";

import { useState, useEffect } from "react";
import { useStore, Transaction } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatRupiahInput, parseRupiah } from "@/lib/utils";

export default function TransactionsPage() {
  const { transactions, categories, accounts, addTransaction, deleteTransaction, searchTerm } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  const [txType, setTxType] = useState<'INCOME'|'EXPENSE'>('EXPENSE');
  const [txAmount, setTxAmount] = useState('');
  const [txCategoryId, setTxCategoryId] = useState('');
  const [txAccountId, setTxAccountId] = useState(accounts[0]?.id || '');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txNote, setTxNote] = useState('');

  useEffect(() => {
    if (accounts.length > 0 && !txAccountId) {
      setTxAccountId(accounts[0].id);
    }
  }, [accounts]);

  useEffect(() => {
    setMounted(true);
    const handleOpenModal = () => setIsTxModalOpen(true);
    window.addEventListener('open-new-item-modal', handleOpenModal);
    return () => window.removeEventListener('open-new-item-modal', handleOpenModal);
  }, []);

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseRupiah(txAmount);
    if (!numericAmount || !txCategoryId || !txAccountId) return;
    addTransaction({
      amount: numericAmount,
      type: txType,
      categoryId: txCategoryId,
      accountId: txAccountId,
      date: txDate,
      note: txNote
    });
    setIsTxModalOpen(false);
    setTxAmount('');
    setTxNote('');
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  if (!mounted) return <div className="p-8">Memuat...</div>;

  const filteredTransactions = transactions.filter(t => {
    const matchesMonth = selectedMonth ? t.date.startsWith(selectedMonth) : true;
    const cat = categories.find(c => c.id === t.categoryId);
    const matchesSearch = searchTerm 
      ? (t.note.toLowerCase().includes(searchTerm.toLowerCase()) || 
         (cat && cat.name.toLowerCase().includes(searchTerm.toLowerCase())))
      : true;
    return matchesMonth && matchesSearch;
  });

  return (
    <>
      <header className="h-16 flex-shrink-0 border-b border-[#E5E7EB] px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <h1 className="text-xs md:text-xl font-bold text-slate-900 whitespace-nowrap">Histori Transaksi</h1>
          <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>
          <div className="flex items-center bg-[#F9FAFB] border border-[#E5E7EB] px-2 md:px-3 py-1 md:py-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0">
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-transparent text-[9px] md:text-sm font-medium text-slate-600 outline-none cursor-pointer w-20 md:w-auto" />
          </div>
          <button onClick={() => setSelectedMonth('')} className="hidden md:block text-xs font-semibold text-slate-400 hover:text-slate-600">Semua Waktu</button>
        </div>
        <Dialog open={isTxModalOpen} onOpenChange={setIsTxModalOpen}>
          <DialogTrigger asChild>
            <button data-tx-trigger="true" className="hidden md:flex bg-[#4CAF85] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold shadow-sm hover:bg-[#4CAF85]/90 items-center gap-1 md:gap-2 whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              <span>Transaksi Baru</span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Transaksi</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTx} className="space-y-4 mt-4">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                <button type="button" onClick={() => setTxType('EXPENSE')} className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${txType === 'EXPENSE' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Pengeluaran</button>
                <button type="button" onClick={() => setTxType('INCOME')} className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${txType === 'INCOME' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Pemasukan</button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nominal (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
                  <input type="text" required value={txAmount} onChange={(e) => setTxAmount(formatRupiahInput(e.target.value))} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF85] text-slate-900 font-medium tracking-wide" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kategori</label>
                <select required value={txCategoryId} onChange={(e) => setTxCategoryId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF85] text-slate-900 bg-white">
                  <option value="" disabled>Pilih Kategori</option>
                  {categories.filter(c => c.type === txType).map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Sumber Dana (Akun)</label>
                <select required value={txAccountId} onChange={(e) => setTxAccountId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF85] text-slate-900 bg-white">
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.icon} {acc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tanggal</label>
                <input type="date" required value={txDate} onChange={(e) => setTxDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF85] text-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Catatan (Opsional)</label>
                <input type="text" value={txNote} onChange={(e) => setTxNote(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF85] text-slate-900" placeholder="Keterangan..." />
              </div>
              <button type="submit" className="w-full bg-[#4CAF85] text-white py-2 rounded-lg font-bold hover:bg-[#3d9871] transition-colors">Simpan Transaksi</button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl flex flex-col flex-1 min-h-[400px]">
           {filteredTransactions.length > 0 ? (
             <div className="divide-y divide-slate-100">
               {filteredTransactions.map(tx => {
                 const cat = categories.find(c => c.id === tx.categoryId);
                 const acc = accounts.find(a => a.id === tx.accountId);
                 if (!cat) return null;
                 const isExp = tx.type === 'EXPENSE';
                 return (
                   <div key={tx.id} className={`flex items-center justify-between p-4 md:p-5 transition-all duration-300 group flex-wrap md:flex-nowrap gap-4 border-l-[3px] md:border-l-[4px] ${isExp ? 'bg-red-50/40 border-red-200/50 hover:bg-red-50/70' : 'bg-emerald-50/40 border-emerald-200/50 hover:bg-emerald-50/70'}`}>
                     <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                       <div className={`w-10 h-10 md:w-12 md:h-12 bg-white border rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-sm flex-shrink-0 transition-transform group-hover:scale-105 ${isExp ? 'border-red-100' : 'border-emerald-100'}`}>{cat.icon}</div>
                       <div className="min-w-0 flex-1">
                         <p className="font-bold text-slate-900 truncate text-sm md:text-base">{tx.note || cat.name}</p>
                         <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                           <span className={`text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-md truncate max-w-[100px] ${isExp ? 'bg-red-100/50 text-red-600' : 'bg-emerald-100/50 text-emerald-600'}`}>{cat.name}</span>
                           {acc && (
                             <span className="text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-100 text-slate-600 flex items-center gap-1 shadow-sm">
                               {acc.icon} {acc.name}
                             </span>
                           )}
                           <span className="text-[10px] md:text-xs text-slate-500 font-medium whitespace-nowrap">{new Date(tx.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                         </div>
                       </div>
                     </div>
                     <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 pl-14 md:pl-0">
                        <p className={`text-base md:text-lg font-black ${isExp ? 'text-red-500' : 'text-emerald-600'}`}>
                          {isExp ? '-' : '+'}{formatIDR(tx.amount)}
                        </p>
                        <button onClick={() => deleteTransaction(tx.id)} className="opacity-100 md:opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-2 hover:bg-red-100/50 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                     </div>
                   </div>
                 );
               })}
             </div>
           ) : (
             <div className="flex justify-center items-center h-full text-slate-500 py-20 text-sm">
               Belum ada transaksi historis.
             </div>
           )}
        </div>
      </div>
    </>
  );
}
