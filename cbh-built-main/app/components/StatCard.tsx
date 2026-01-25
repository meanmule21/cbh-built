"use client";

import AnimatedCounter from "./AnimatedCounter";

interface StatCardProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
      {icon && (
        <div className="w-14 h-14 bg-pink/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
          {icon}
        </div>
      )}
      <p className="text-4xl sm:text-5xl font-bold text-white mb-2">
        <AnimatedCounter value={value} duration={1000} />
      </p>
      <p className="text-white/70 font-medium">{label}</p>
    </div>
  );
}
