import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ParticleTextProps {
  text: string;
  className?: string;
}

export function ParticleText({ text, className = "" }: ParticleTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Split text into characters, including spaces
  const characters = text.split("");

  return (
    <span 
      className={`inline cursor-default align-baseline ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block whitespace-pre align-baseline"
          animate={isHovered ? {
            opacity: [1, 0.8, 0],
            scale: [1, 0.4, 0.1],
            x: [0, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 300],
            y: [0, (Math.random() - 0.5) * 40, (Math.random() - 0.8) * 300],
            rotate: [0, (Math.random() - 0.5) * 90, (Math.random() - 0.5) * 360],
            filter: ["blur(0px)", "blur(4px)", "blur(15px)"],
          } : {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: isHovered ? 2.5 : 0.8,
            times: [0, 0.15, 1], // 0-15% is the "break" phase, 15-100% is the "fly away" phase
            ease: isHovered ? ["easeIn", "easeOut"] : "backOut",
            delay: isHovered ? Math.random() * 0.2 : index * 0.005,
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
