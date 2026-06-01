import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function GlassCard({ children, className = "", noPadding = false }: GlassCardProps) {
  return (
    <div
      className={`bg-white/60 backdrop-blur-lg border border-white/40 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden ${
        noPadding ? "" : "p-6 md:p-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}
