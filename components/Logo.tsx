"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  size?: number;
}

export function Logo({ className, iconClassName, size = 24 }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn(
        "relative rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-lg border border-slate-100",
        iconClassName || "w-10 h-10"
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF85] to-[#3d9871] opacity-90"></div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="relative z-10"
        >
          <path d="M12 3v18"/>
          <path d="m8 8 4-5 4 5"/>
          <path d="m8 16 4 5 4-5"/>
          <circle cx="12" cy="12" r="3" fill="white" stroke="none" />
        </svg>
      </div>
      <span className="text-2xl font-black tracking-[-0.05em] text-slate-900 font-display">
        flow<span className="text-[#4CAF85]">ance</span>
      </span>
    </div>
  );
}
