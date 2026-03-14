import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export function CubeBackground() {
  const [cubes, setCubes] = useState<{ id: number; x: number; y: number; size: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    const colors = ['bg-slate-200/40', 'bg-orange-200/30', 'bg-slate-300/20', 'bg-orange-300/20'];
    const newCubes = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5
    }));
    setCubes(newCubes);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {cubes.map((cube) => (
        <motion.div
          key={cube.id}
          className={`absolute rounded-lg ${cube.color}`}
          style={{
            width: cube.size,
            height: cube.size,
            left: `${cube.x}%`,
            top: `${cube.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: cube.delay
          }}
        />
      ))}
    </div>
  );
}
