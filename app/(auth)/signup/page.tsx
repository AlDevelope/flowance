"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, ArrowRight, ShieldCheck, PieChart, User } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { Logo } from "@/components/Logo";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mendaftar");
      }

      // Success - Redirect to login
      router.push("/login?signup=success");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mendaftar.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row">
      {/* Left Side: Branding & Info */}
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
            <h1 className="text-5xl font-bold leading-tight">Mulai Perjalanan Finansial Anda.</h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Daftar sekarang dan nikmati kemudahan dalam memantau setiap rupiah yang Anda miliki.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-white/60 text-sm">
          <span>&copy; 2026 Flowance Inc.</span>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Buat Akun</h2>
            <p className="text-slate-500">Gratis dan selamanya akan membantu Anda.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe" 
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF85]/50 focus:border-[#4CAF85] transition-all text-slate-900 font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF85]/50 focus:border-[#4CAF85] transition-all text-slate-900 font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF85]/50 focus:border-[#4CAF85] transition-all text-slate-900 font-medium"
                required
                minLength={6}
              />
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
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 text-sm">
            Sudah punya akun? <Link href="/login" className="font-bold text-[#4CAF85] hover:underline">Masuk</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
