import React from 'react';
import { motion } from 'motion/react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowCard({ children, className = "" }: GlowCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative group p-[2px] rounded-[2rem] overflow-hidden transition-all duration-500 ${className}`}
    >
      {/* Animated Glow Border */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_90deg,#ff4d4d_120deg,#ffcc00_180deg,#ff6600_240deg,transparent_270deg,transparent_360deg)]" />
      </div>
      
      {/* Inner Content Container */}
      <div className="relative h-full w-full bg-inherit rounded-[calc(2rem-2px)] overflow-hidden z-10">
        {children}
      </div>
      
      {/* Outer Glow Shadow */}
      <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-30 group-hover:blur-xl transition-all duration-500 bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 -z-10" />
    </motion.div>
  );
}
