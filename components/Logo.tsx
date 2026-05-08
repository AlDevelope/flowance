"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  size?: number;
}

export function Logo({ className, iconClassName, size = 24 }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("bg-[#4CAF85] rounded-xl flex items-center justify-center text-white shadow-xl", iconClassName)}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 2v20"/>
          <path d="m17 5-5-3-5 3"/>
          <path d="m17 19-5 3-5-3"/>
          <rect x="2" y="9" width="20" height="6" rx="2"/>
        </svg>
      </div>
      <span className="text-xl font-extrabold tracking-tighter text-slate-900">Flowance</span>
    </div>
  );
}
