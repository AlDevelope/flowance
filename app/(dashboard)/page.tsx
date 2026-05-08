"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useStore } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatRupiahInput, parseRupiah } from "@/lib/utils";
import { toPng } from "html-to-image";
import { Share2, Download, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function DashboardPage() {
  const { initialBalance, setInitialBalance, transactions, categories, budgets, accounts, addTransaction, user } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isSharePreviewOpen, setIsSharePreviewOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Global Filters
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

  const handleDownloadImage = useCallback(async () => {
    if (shareRef.current === null) return;
    setIsSharing(true);
    
    try {
      const dataUrl = await toPng(shareRef.current, {
        cacheBust: true,
        backgroundColor: '#FFFFFF',
        pixelRatio: 3,
        style: {
          padding: '40px',
          borderRadius: '40px',
        }
      });
      
      const link = document.createElement('a');
      link.download = `flowance-expense-${selectedMonth}.png`;
      link.href = dataUrl;
      link.click();
      setIsSharePreviewOpen(false);
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsSharing(false);
    }
  }, [shareRef, selectedMonth]);
  
  // Transaction Form State
  const [txType, setTxType] = useState<'INCOME'|'EXPENSE'>('EXPENSE');
  const [txAmount, setTxAmount] = useState('');
  const [txCategoryId, setTxCategoryId] = useState('');
  const [txAccountId, setTxAccountId] = useState(accounts[0]?.id || '');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txNote, setTxNote] = useState('');

  // Category Details Modal State
  const [selectedCatDetails, setSelectedCatDetails] = useState<string | null>(null);

  // Initial Balance Modal State
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [balanceInput, setBalanceInput] = useState('');

  useEffect(() => {
    setMounted(true);
    setBalanceInput(formatRupiahInput(initialBalance));
    
    const handleOpenModal = () => setIsTxModalOpen(true);
    window.addEventListener('open-new-item-modal', handleOpenModal);
    return () => window.removeEventListener('open-new-item-modal', handleOpenModal);
  }, [initialBalance]);

  useEffect(() => {
    if (accounts.length > 0 && !txAccountId) {
      setTxAccountId(accounts[0].id);
    }
  }, [accounts]);

  const { totalIncome, totalExpense, currentBalance, recentTransactions, filteredTxs, accountBalances } = useMemo(() => {
    // Current Monthly Data
    const monthTxs = transactions.filter(t => t.date.startsWith(selectedMonth));
    const income = monthTxs.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTxs.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    
    // Overall balance logic (all time)
    const allIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const allExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const balance = initialBalance + allIncome - allExpense;

    // Account balances
    const balances = accounts.map(acc => {
      const accIncome = transactions.filter(t => t.accountId === acc.id && t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
      const accExpense = transactions.filter(t => t.accountId === acc.id && t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
      return {
        ...acc,
        currentBalance: acc.balance + accIncome - accExpense
      };
    });
    
    return {
      totalIncome: income,
      totalExpense: expense,
      currentBalance: balance,
      recentTransactions: monthTxs.slice(0, 5),
      filteredTxs: monthTxs,
      accountBalances: balances
    };
  }, [transactions, initialBalance, selectedMonth, accounts]);

  const catExpenses = useMemo(() => {
    const expenses = filteredTxs.filter(t => t.type === 'EXPENSE');
    const map = new Map<string, number>();
    expenses.forEach(t => {
      map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
    });
    return Array.from(map.entries()).map(([id, amount]) => ({
      category: categories.find(c => c.id === id),
      amount
    })).filter(x => x.category).sort((a, b) => b.amount - a.amount);
  }, [transactions, categories, filteredTxs]);

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

  const handleUpdateBalance = (e: React.FormEvent) => {
    e.preventDefault();
    setInitialBalance(parseRupiah(balanceInput));
    setIsBalanceModalOpen(false);
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  // Chart Data preparation
  const chartData = useMemo(() => {
    if (!mounted) return [];
    // Group transactions by day for the selected month
    const daysInMonth = new Date(
      parseInt(selectedMonth.split('-')[0]), 
      parseInt(selectedMonth.split('-')[1]), 
      0
    ).getDate();
    
    const data = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = `${selectedMonth}-${i.toString().padStart(2, '0')}`;
      const dailyIncome = transactions
        .filter(t => t.date === dayStr && t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);
      const dailyExpense = transactions
        .filter(t => t.date === dayStr && t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);
      
      data.push({
        day: i,
        income: dailyIncome,
        expense: dailyExpense,
        name: i.toString()
      });
    }
    return data;
  }, [transactions, selectedMonth, mounted]);

  const selectedCategoryObj = useMemo(() => 
    selectedCatDetails ? categories.find(c => c.id === selectedCatDetails) : null
  , [selectedCatDetails, categories]);

  if (!mounted) return <div className="p-8">Memuat...</div>;

  const selectedCategoryTxs = selectedCatDetails ? filteredTxs.filter(t => t.categoryId === selectedCatDetails) : [];

  return (
    <>
      {/* Share Preview Modal */}
      <Dialog open={isSharePreviewOpen} onOpenChange={setIsSharePreviewOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-slate-50 border-none">
          <DialogHeader className="p-6 bg-white border-b border-slate-100">
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#4CAF85]" />
              Pratinjau Pengeluaran
            </DialogTitle>
          </DialogHeader>

          <div className="p-8 flex flex-col items-center">
            {/* The Actual Card to Capture */}
            <div 
              ref={shareRef}
              className="w-full max-w-sm bg-white rounded-[40px] shadow-2xl shadow-slate-200 p-8 border border-slate-100 relative overflow-hidden"
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4CAF85]/5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F28B6E]/5 rounded-full -ml-16 -mb-16"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <Logo size={20} className="gap-2" />
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Bulan</p>
                    <p className="text-xs font-bold text-slate-900">{format(new Date(selectedMonth), 'MMMM yyyy', { locale: id })}</p>
                  </div>
                </div>

                <div className="mb-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Pengeluaran</p>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">{formatIDR(totalExpense).split(',')[0]}</h2>
                  <div className="w-12 h-1.5 bg-[#F28B6E] rounded-full mt-4"></div>
                </div>

                {/* Mini Chart */}
                <div className="h-32 w-full mb-10">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="shareGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F28B6E" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#F28B6E" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="expense" 
                          stroke="#F28B6E" 
                          strokeWidth={4} 
                          fill="url(#shareGrad)" 
                          animationDuration={0}
                        />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs border border-slate-200 overflow-hidden">
                      <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-700">{user.displayName}</p>
                  </div>
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">flowance.app</p>
                </div>
              </div>

              {/* Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none opacity-[0.03] select-none">
                 <p className="text-6xl font-black whitespace-nowrap">FLOWANCE FLOWANCE</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col w-full gap-3">
              <button 
                onClick={handleDownloadImage}
                disabled={isSharing}
                className="w-full h-12 bg-[#4CAF85] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#4CAF85]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isSharing ? (
                   <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Simpan Gambar
                  </>
                )}
              </button>
              <button 
                onClick={() => setIsSharePreviewOpen(false)}
                className="w-full h-12 bg-white text-slate-500 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Kategori Modal */}
      <Dialog open={!!selectedCatDetails} onOpenChange={(open) => !open && setSelectedCatDetails(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Laporan Detail: {selectedCategoryObj?.icon} {selectedCategoryObj?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <div className="mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
               <span className="text-sm font-semibold text-slate-600">Total Pengeluaran Bulan Ini:</span>
               <span className="text-xl font-bold text-slate-900">{formatIDR(selectedCategoryTxs.reduce((sum, t) => sum + t.amount, 0))}</span>
            </div>
            {selectedCategoryTxs.length > 0 ? (
              <div className="space-y-3">
                {selectedCategoryTxs.map(tx => (
                  <div key={tx.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{tx.note || selectedCategoryObj?.name}</p>
                      <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <p className="font-bold text-[#F28B6E]">{formatIDR(tx.amount)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-sm">Tidak ada transaksi ditemukan.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="h-16 flex-shrink-0 border-b border-[#E5E7EB] px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <h1 className="text-xs md:text-xl font-bold text-slate-900 whitespace-nowrap">Dashboard Utama</h1>
          <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>
          <div className="flex items-center bg-[#F9FAFB] border border-[#E5E7EB] px-2 md:px-3 py-1 md:py-1.5 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0">
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-transparent text-[9px] md:text-sm font-medium text-slate-600 outline-none cursor-pointer w-20 md:w-auto" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSharePreviewOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
          >
            <Share2 className="w-4 h-4 text-[#4CAF85]" />
            <span className="hidden sm:inline">Bagikan</span>
          </button>
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
                <input type="text" value={txNote} onChange={(e) => setTxNote(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF85] text-slate-900" placeholder="Makan siang..." />
              </div>
              <button type="submit" className="w-full bg-[#4CAF85] text-white py-2 rounded-lg font-bold hover:bg-[#3d9871] transition-colors">Simpan Transaksi</button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </header>

      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6">
        {/* Top Cards: Total Balance & Accounts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-800 p-5 md:p-6 rounded-3xl text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            </div>
            <div className="relative">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Saldo Bersih</span>
              <h2 className="text-3xl font-black mt-2 mb-6">{formatIDR(currentBalance)}</h2>
              <div className="flex gap-4">
                <div className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                  <span className="text-[9px] font-bold text-slate-300 block mb-1">PEMASUKAN</span>
                  <span className="text-sm font-bold text-emerald-400">{formatIDR(totalIncome).replace('Rp', '')}</span>
                </div>
                <div className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                  <span className="text-[9px] font-bold text-slate-300 block mb-1">PENGELUARAN</span>
                  <span className="text-sm font-bold text-red-400">{formatIDR(totalExpense).replace('Rp', '')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {accountBalances.map((acc) => (
              <div key={acc.id} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                      {acc.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{acc.name}</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saldo Saat Ini</span>
                    </div>
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{formatIDR(acc.currentBalance)}</p>
                <div className="mt-4 w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full opacity-50" 
                    style={{ backgroundColor: acc.color, width: '100%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col min-h-[350px]">
             <div className="flex items-center justify-between mb-8">
               <div>
                <h3 className="font-black text-slate-800 text-lg">Tren Keuangan</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pemasukan vs Pengeluaran Bulan Ini</p>
               </div>
            </div>
            
            <div className="flex-1 w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF85" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4CAF85" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F28B6E" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F28B6E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      padding: '12px'
                    }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ marginBottom: '8px', fontWeight: 'bold', color: '#64748b' }}
                    formatter={(value: number) => [formatIDR(value).replace(',00', ''), '']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#4CAF85" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                    animationDuration={1500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    stroke="#F28B6E" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorExpense)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col items-center min-h-[350px]">
            <h3 className="font-black text-slate-800 text-lg self-start mb-1">Alokasi</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest self-start mb-8">Berdasarkan Kategori</p>
            
            {totalExpense > 0 ? (
              <div className="flex-1 w-full flex flex-col items-center justify-center">
                <div className="relative w-full h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={catExpenses}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="amount"
                        stroke="none"
                        animationDuration={1500}
                      >
                        {catExpenses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.category.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatIDR(value).replace(',00', '')}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] uppercase font-black text-slate-400">Total</span>
                    <span className="text-sm font-black text-slate-900">{formatIDR(totalExpense).split(',')[0]}</span>
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 w-full">
                  {catExpenses.slice(0, 4).map((ce, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ce.category.color }}></div>
                       <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{ce.category.name}</span>
                         <span className="text-xs font-black text-slate-900">{Math.round((ce.amount / totalExpense) * 100)}%</span>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
               <div className="flex-1 flex items-center justify-center text-sm font-bold text-slate-400 italic">Belum ada data</div>
            )}
          </div>
        </div>

        {/* Bottom Row: Recent + Budget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 min-h-[180px]">
          {/* Recent Trans */}
          <div className="lg:col-span-7 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 md:p-5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm">Transaksi Terbaru</h3>
              <a href="/transactions" className="text-xs font-semibold text-[#4CAF85]">Lihat Semua</a>
            </div>
            
            {recentTransactions.length > 0 ? (
              <div className="space-y-3 flex-1">
                {recentTransactions.map(tx => {
                  const cat = categories.find(c => c.id === tx.categoryId);
                  if (!cat) return null;
                  const isExp = tx.type === 'EXPENSE';
                  return (
                    <div key={tx.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-lg">{cat.icon}</div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{tx.note || cat.name}</p>
                          <p className="text-[11px] font-medium text-slate-500">{new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} • {cat.name}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-bold ${isExp ? 'text-[#F28B6E]' : 'text-[#4CAF85]'}`}>
                        {isExp ? '-' : '+'}{formatIDR(tx.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
               <div className="flex-1 flex items-center justify-center text-sm text-slate-500">Belum ada transaksi</div>
            )}
          </div>

          {/* Budget Progress (Automated based on budgets and transactions) */}
          <div className="lg:col-span-5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 md:p-5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm">Progress Anggaran (Bulan Ini)</h3>
              <a href="/budgets" className="text-xs font-semibold text-[#4CAF85]">Atur</a>
            </div>
            {budgets.length > 0 ? (
              <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                {budgets.map(b => {
                  const cat = categories.find(c => c.id === b.categoryId);
                  if (!cat) return null;
                  
                  // Calculate spent for this category
                  const spent = transactions
                    .filter(t => t.type === 'EXPENSE' && t.categoryId === b.categoryId)
                    .reduce((sum, t) => sum + t.amount, 0);
                  
                  const percent = Math.min(100, (spent / b.amount) * 100);
                  const isOver = spent > b.amount;

                  return (
                    <div key={b.id} onClick={() => setSelectedCatDetails(cat.id)} className="cursor-pointer p-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all transform hover:-translate-y-0.5">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">{cat.icon} {cat.name}</span>
                        <span className="text-[11px] font-bold text-slate-900">{formatIDR(spent)} / {formatIDR(b.amount)}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${isOver ? 'bg-[#EF4444]' : 'bg-[#4CAF85]'}`} style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
               <div className="flex-1 flex items-center justify-center text-sm text-slate-500 flex-col gap-2 text-center">
                 Belum ada anggaran. <br/> Atur anggaran agar pengeluaran terkendali.
               </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
