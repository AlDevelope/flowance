"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { 
  User, 
  Mail, 
  Lock, 
  Chrome, 
  ChevronRight, 
  LogOut, 
  CheckCircle2, 
  Camera,
  ShieldCheck,
  Bell,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { user, updateUser, transactions } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'other'>('info');

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const transactionCount = transactions.length;

  useEffect(() => {
    setMounted(true);
    setDisplayName(user.displayName);
    setEmail(user.email);
  }, [user]);

  // Sync user info from session if available and not yet set
  useEffect(() => {
    if (session?.user && !user.isGoogleConnected) {
      updateUser({
        isGoogleConnected: true,
        email: session.user.email || user.email,
        displayName: session.user.name || user.displayName,
        avatar: session.user.image || user.avatar
      });
      if (session.user.name) setDisplayName(session.user.name);
      if (session.user.email) setEmail(session.user.email);
    }
  }, [session, user.isGoogleConnected, updateUser, user.email, user.displayName, user.avatar]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser({ displayName, email });
      setIsUpdating(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handleConnectGoogle = async () => {
    if (user.isGoogleConnected || status === "authenticated") return;
    
    setIsUpdating(true);
    await signIn("google");
    setIsUpdating(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  if (!mounted) return <div className="p-8 flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-[#4CAF85] border-t-transparent rounded-full animate-spin"></div>
  </div>;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FAFB] pb-24 md:pb-8">
      {/* Mobile Top Header (Sticky) */}
      <div className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center px-4 h-16">
        <button 
          onClick={() => router.back()}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="ml-2 text-lg font-black text-slate-900">Pengaturan Akun</h1>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10">
        
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col gap-1">
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Akun Saya</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Kelola informasi dan keamanan akun kamu</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar (For Desktop/iPad) */}
          <div className="lg:col-span-3 space-y-2 hidden md:block">
            <button 
              onClick={() => setActiveTab('info')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all",
                activeTab === 'info' ? "bg-white text-[#4CAF85] shadow-sm border border-slate-100" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              <User className={cn("w-5 h-5", activeTab === 'info' ? "text-[#4CAF85]" : "text-slate-300")} />
              Profil Umum
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all",
                activeTab === 'security' ? "bg-white text-[#4CAF85] shadow-sm border border-slate-100" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              <Lock className={cn("w-5 h-5", activeTab === 'security' ? "text-[#4CAF85]" : "text-slate-300")} />
              Keamanan
            </button>
            <button 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm text-slate-400 hover:bg-slate-50 transition-all opacity-50 cursor-not-allowed"
            >
              <CreditCard className="w-5 h-5 text-slate-300" />
              Langganan
            </button>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Profile Summary Card */}
            <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
              {/* Background Decor */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-700"></div>
              
              <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-8 border-slate-50 overflow-hidden shadow-xl shadow-slate-200">
                    <img 
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-1 right-1 w-10 h-10 bg-[#4CAF85] text-white rounded-2xl flex items-center justify-center shadow-lg hover:rotate-12 transition-transform cursor-pointer">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 text-center md:text-left space-y-2 md:pt-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-900">{user.displayName}</h2>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4CAF8515] text-[#4CAF85] text-[10px] font-black uppercase tracking-wider rounded-full self-center md:self-auto">
                      <CheckCircle2 className="w-3 h-3" /> Akun Terverifikasi
                    </span>
                  </div>
                  <p className="text-slate-500 font-bold text-sm">{user.email || 'Harap setel email kamu'}</p>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                    <div className="text-center md:text-left">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Transaksi</p>
                      <p className="text-lg font-black text-slate-900">{transactionCount}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-100"></div>
                    <div className="text-center md:text-left">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Pendapatan</p>
                      <p className="text-lg font-black text-[#4CAF85]">Rp {totalIncome.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs (Mobile Only) */}
            <div className="flex md:hidden bg-slate-100/50 p-1 rounded-2xl">
              <button 
                onClick={() => setActiveTab('info')}
                className={cn(
                  "flex-1 py-3 rounded-[0.9rem] text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === 'info' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                )}
              >
                Profil
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={cn(
                  "flex-1 py-3 rounded-[0.9rem] text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === 'security' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                )}
              >
                Keamanan
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'info' ? (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* General Info Card */}
                  <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-[2.5rem] shadow-sm">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-xl bg-[#4CAF8510] flex items-center justify-center">
                            <User className="w-4 h-4 text-[#4CAF85]" />
                          </div>
                          <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Informasi Pribadi</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="group space-y-2">
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest pl-1 group-focus-within:text-[#4CAF85] transition-colors">Nama Panggilan</label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#4CAF85] transition-colors" />
                              <input 
                                type="text" 
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Masukkan nama kamu"
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#4CAF85]/5 focus:bg-white focus:border-[#4CAF85]/30 transition-all"
                              />
                            </div>
                          </div>

                          <div className="group space-y-2">
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest pl-1 group-focus-within:text-[#4CAF85] transition-colors">Alamat Email Utama</label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#4CAF85] transition-colors" />
                              <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@email.com"
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#4CAF85]/5 focus:bg-white focus:border-[#4CAF85]/30 transition-all"
                              />
                            </div>
                          </div>

                          <div className="group space-y-2">
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest pl-1 group-focus-within:text-[#4CAF85] transition-colors">Nomor HP</label>
                            <div className="relative">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#4CAF85] transition-colors flex items-center justify-center font-black text-[10px]">62</div>
                              <input 
                                type="tel" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="812xxxxxx"
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#4CAF85]/5 focus:bg-white focus:border-[#4CAF85]/30 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
                        <button 
                          disabled={isUpdating}
                          className="w-full md:w-auto px-10 py-4 bg-[#4CAF85] text-white rounded-[1.2rem] font-black text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-[#4CAF85]/20"
                        >
                          {isUpdating ? 'Memproses...' : 'Simpan Profil'}
                        </button>
                        {showSuccess && (
                          <motion.span 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xs font-black text-emerald-600 inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Berhasil Diperbarui
                          </motion.span>
                        )}
                      </div>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Connections & Security Card */}
                  <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-[2.5rem] shadow-sm space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#8B5CF610] flex items-center justify-center">
                        <Lock className="w-4 h-4 text-[#8B5CF6]" />
                      </div>
                      <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Autentikasi & Keamanan</h3>
                    </div>

                    <div className="space-y-4">
                      {/* Google Connection Section */}
                      <div 
                        onClick={handleConnectGoogle}
                        className={cn(
                          "flex items-center justify-between p-5 rounded-3xl border transition-all cursor-pointer group",
                          user.isGoogleConnected 
                            ? "bg-slate-50 border-slate-100" 
                            : "bg-white border-slate-200 hover:border-[#4285F4]/30 hover:bg-[#4285F4]/5"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Chrome className="w-6 h-6 text-slate-900" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">Hubungkan Google</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                              {user.isGoogleConnected ? 'Terkoneksi dengan akun Google' : 'Login lebih cepat dengan Google'}
                            </p>
                          </div>
                        </div>
                        {user.isGoogleConnected ? (
                          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                          </div>
                        ) : (
                          <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                            Hubungkan <ChevronRight className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Password Change Section */}
                      <div className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 bg-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                            <ShieldCheck className="w-6 h-6 text-slate-900" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">Kata Sandi</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Terakhir diubah 2 bulan lalu</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest">
                          Ubah
                        </button>
                      </div>

                      {/* Biometric Option */}
                      <div className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 bg-slate-50 opacity-60">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                            <Bell className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-400">Autentikasi Dua Faktor (2FA)</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Segera Hadir</p>
                          </div>
                        </div>
                        <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                          <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Logout Mobile (Floating / Fixed Button at bottom on mobile) */}
            <div className="md:hidden pt-4 pb-12">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-5 rounded-[2rem] border-2 border-red-50 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-50 active:scale-95 transition-all"
              >
                <LogOut className="w-5 h-5" /> Keluar dari Aplikasi
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
