"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Wallet, ArrowRight, ShieldCheck, PieChart, Target } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { signIn, useSession } from "next-auth/react";
import { Logo } from "@/components/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (searchParams.get("signup") === "success") {
      setSuccess("Akun berhasil dibuat! Silakan masuk.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        remember: rememberMe.toString(),
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
    <form onSubmit={handleLogin} className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 ml-1" />
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
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
            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF85]/50 focus:border-[#4CAF85] transition-all text-slate-900 font-medium font-sans"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
        </div>
        <div className="relative">
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF85]/50 focus:border-[#4CAF85] transition-all text-slate-900 font-medium font-sans"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-[#4CAF85] focus:ring-[#4CAF85] transition-all cursor-pointer"
          />
          <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Selalu Ingat</span>
        </label>
        <Link href="#" className="text-xs font-bold text-[#4CAF85] hover:underline">Lupa Password?</Link>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full h-12 bg-[#4CAF85] text-white rounded-xl font-bold shadow-lg shadow-[#4CAF85]/20 hover:bg-[#3d9871] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 font-display"
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
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-[#4CAF85] p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="mb-12">
            <Logo iconClassName="w-12 h-12" size={28} className="brightness-0 invert" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 max-w-md"
          >
            <h1 className="text-5xl font-black leading-tight font-display tracking-tight">Kelola Keuangan dengan Lebih Pintar.</h1>
            <p className="text-white/80 text-lg leading-relaxed font-medium">
              Pantau pengeluaran, atur anggaran, dan capai tujuan finansial Anda dengan platform yang elegan.
            </p>
            
            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Aman & Privat</p>
                  <p className="text-sm text-white/50">Data Anda terenkripsi dengan standar industri.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Laporan Visual</p>
                  <p className="text-sm text-white/50">Grafik interaktif untuk mengerti pola belanja Anda.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-white/40 text-xs font-bold uppercase tracking-widest">
          <span>&copy; 2026 Flowance Inc.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex flex-col items-center mb-10">
            <Logo />
            <p className="text-slate-500 text-sm mt-1">Smart Financial Management</p>
          </div>

          <div className="mb-10 lg:mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-2 font-display tracking-tight text-center lg:text-left">Selamat Datang</h2>
            <p className="text-slate-500 font-medium text-center lg:text-left">Masuk untuk mengelola keuangan Anda.</p>
          </div>

          <Suspense fallback={<div className="h-48 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#4CAF85]/20 border-t-[#4CAF85] rounded-full animate-spin"></div></div>}>
            <LoginForm />
          </Suspense>

          <p className="mt-10 text-center text-slate-500 text-sm font-medium">
            Belum punya akun? <Link href="/signup" className="font-bold text-[#4CAF85] hover:underline">Daftar Sekarang</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
