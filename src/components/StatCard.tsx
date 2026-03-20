import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../utils';

export function StatCard({ title, value, icon, trend, trendType }: { title: string, value: string, icon: React.ReactNode, trend: string, trendType: 'up' | 'down' }) {
  return (
    <motion.div 
      whileHover={{ y: -12, scale: 1.03, rotateX: 2, rotateY: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="depth-card p-6 rounded-3xl relative overflow-hidden group preserve-3d"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] border border-slate-50 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm border",
          trendType === 'up' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
        )}>
          {trendType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-sm text-slate-500 font-bold mb-1 tracking-tight uppercase opacity-70">{title}</p>
        <h4 className="text-3xl font-black text-slate-900 tracking-tighter drop-shadow-sm">{value}</h4>
      </div>
    </motion.div>
  );
}
