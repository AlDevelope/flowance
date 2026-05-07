"use client";

import { useState, useEffect } from "react";
import { useStore, TransactionType } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function CategoriesPage() {
  const { categories, addCategory, deleteCategory, searchTerm } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState<TransactionType>('EXPENSE');
  const [catIcon, setCatIcon] = useState('📦');
  const [catColor, setCatColor] = useState('#8B5CF6');

  useEffect(() => {
    setMounted(true);
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('open-new-item-modal', handleOpenModal);
    return () => window.removeEventListener('open-new-item-modal', handleOpenModal);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    addCategory({
      name: catName,
      type: catType,
      icon: catIcon,
      color: catColor
    });
    setIsModalOpen(false);
    setCatName('');
  };

  if (!mounted) return <div className="p-8">Memuat...</div>;

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const expenses = filteredCategories.filter(c => c.type === 'EXPENSE');
  const incomes = filteredCategories.filter(c => c.type === 'INCOME');

  return (
    <>
      <header className="h-16 flex-shrink-0 border-b border-[#E5E7EB] px-4 md:px-8 flex items-center justify-between">
        <h1 className="text-xs md:text-xl font-bold text-slate-900 whitespace-nowrap">Kelola Kategori</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button data-tx-trigger="true" className="hidden md:flex bg-[#4CAF85] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold shadow-sm hover:bg-[#4CAF85]/90 items-center gap-1 md:gap-2 whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              <span>Kategori Baru</span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kategori</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-4">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                <button type="button" onClick={() => setCatType('EXPENSE')} className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${catType === 'EXPENSE' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Pengeluaran</button>
                <button type="button" onClick={() => setCatType('INCOME')} className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${catType === 'INCOME' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Pemasukan</button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Kategori</label>
                <input type="text" required value={catName} onChange={(e) => setCatName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF85] text-slate-900 font-medium" placeholder="Misal: Jajan, Liburan..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ikon (Emoji)</label>
                  <input type="text" required value={catIcon} onChange={(e) => setCatIcon(e.target.value)} maxLength={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF85] text-slate-900 font-medium text-center text-xl" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Warna Teks/Indikator</label>
                  <input type="color" required value={catColor} onChange={(e) => setCatColor(e.target.value)} className="w-full h-[42px] p-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF85]" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#4CAF85] text-white py-2 rounded-lg font-bold hover:bg-[#3d9871] transition-colors">Simpan Kategori</button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
        <div>
           <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#F28B6E]"></div>
             Kategori Pengeluaran
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {expenses.map(c => (
               <div key={c.id} className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm flex items-center justify-between group">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${c.color}20`, color: c.color }}>{c.icon}</div>
                   <span className="font-semibold text-slate-900 text-sm truncate">{c.name}</span>
                 </div>
                 <button onClick={() => deleteCategory(c.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                 </button>
               </div>
             ))}
           </div>
        </div>

        <div>
           <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#4CAF85]"></div>
             Kategori Pemasukan
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {incomes.map(c => (
               <div key={c.id} className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-sm flex items-center justify-between group">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${c.color}20`, color: c.color }}>{c.icon}</div>
                   <span className="font-semibold text-slate-900 text-sm truncate">{c.name}</span>
                 </div>
                 <button onClick={() => deleteCategory(c.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                 </button>
               </div>
             ))}
           </div>
        </div>
      </div>
    </>
  );
}
