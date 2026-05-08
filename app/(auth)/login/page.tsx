"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, ArrowRight, ShieldCheck, PieChart, Target } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

import { signIn } from "next-auth/react";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan saat masuk.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row">
      {/* Left Side: Branding & Info (Hidden on small mobile if needed, but we make it look good) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#4CAF85] p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Logo iconClassName="w-12 h-12" size={28} className="text-white" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 max-w-md"
          >
            <h1 className="text-5xl font-bold leading-tight">Kelola Keuangan dengan Lebih Pintar.</h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Pantau pengeluaran, atur anggaran, dan capai tujuan finansial Anda dengan platform yang elegan dan mudah digunakan.
            </p>
            
            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Aman & Privat</p>
                  <p className="text-sm text-white/60">Data Anda terenkripsi dengan standar industri.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Laporan Visual</p>
                  <p className="text-sm text-white/60">Grafik interaktif untuk mengerti pola belanja Anda.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-white/60 text-sm">
          <span>&copy; 2026 Flowance Inc.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          {/* Logo for mobile only */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#4CAF85] rounded-2xl flex items-center justify-center text-white shadow-xl mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><rect x="2" y="9" width="20" height="6" rx="2"/></svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Flowance</h2>
            <p className="text-slate-500 text-sm mt-1">Smart Financial Management</p>
          </div>

          <div className="mb-10 lg:mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Selamat Datang</h2>
            <p className="text-slate-500">Masuk untuk mengelola keuangan Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in zoom-in duration-200">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF85]/50 focus:border-[#4CAF85] transition-all text-slate-900 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-xs font-bold text-[#4CAF85] hover:underline">Lupa Password?</Link>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF85]/50 focus:border-[#4CAF85] transition-all text-slate-900 font-medium"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-[#4CAF85] text-white rounded-xl font-bold shadow-lg shadow-[#4CAF85]/20 hover:bg-[#3d9871] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 text-sm">
            Belum punya akun? <Link href="/signup" className="font-bold text-[#4CAF85] hover:underline">Daftar Sekarang</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
