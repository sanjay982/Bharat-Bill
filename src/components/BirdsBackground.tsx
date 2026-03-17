import React, { useEffect, useRef } from 'react';

interface Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  targetX: number;
  targetY: number;
}

export const BirdsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    let mouseX = width / 2;
    let mouseY = height / 2;

    // Vibrant colors for the birds
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];
    const birds: Bird[] = [];
    const numBirds = 60;

    for (let i = 0; i < numBirds; i++) {
      birds.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 8,
        targetX: mouseX,
        targetY: mouseY,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const drawBird = (bird: Bird, time: number) => {
      ctx.save();
      ctx.translate(bird.x, bird.y);
      const angle = Math.atan2(bird.vy, bird.vx);
      ctx.rotate(angle);
      
      // Flapping wings animation using sine wave
      const flapSpeed = 0.2 + (Math.abs(bird.vx) + Math.abs(bird.vy)) * 0.05;
      const wingY = Math.sin(time * flapSpeed + bird.x) * bird.size;

      ctx.beginPath();
      // Body
      ctx.moveTo(bird.size * 2, 0); // Beak
      ctx.lineTo(-bird.size, -bird.size * 0.5); // Top tail
      ctx.lineTo(-bird.size * 0.5, 0); // Inner tail
      ctx.lineTo(-bird.size, bird.size * 0.5); // Bottom tail
      ctx.closePath();
      
      ctx.fillStyle = bird.color;
      ctx.fill();

      // Wings
      ctx.beginPath();
      ctx.moveTo(bird.size * 0.5, 0);
      ctx.lineTo(-bird.size * 0.5, wingY * 1.5);
      ctx.lineTo(-bird.size, 0);
      ctx.fillStyle = bird.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();

      ctx.restore();
    };

    let time = 0;

    const update = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      for (let i = 0; i < birds.length; i++) {
        const bird = birds[i];

        // Separation (avoiding other birds)
        let sepX = 0;
        let sepY = 0;
        let count = 0;
        for (let j = 0; j < birds.length; j++) {
          if (i !== j) {
            const other = birds[j];
            const dSq = (bird.x - other.x) ** 2 + (bird.y - other.y) ** 2;
            if (dSq < 900) { // 30px radius
              sepX += bird.x - other.x;
              sepY += bird.y - other.y;
              count++;
            }
          }
        }
        if (count > 0) {
          bird.vx += (sepX / count) * 0.05;
          bird.vy += (sepY / count) * 0.05;
        }

        // Steer towards mouse
        const dx = mouseX - bird.x;
        const dy = mouseY - bird.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
          const force = Math.min(dist, 300) / 3000;
          bird.vx += (dx / dist) * force;
          bird.vy += (dy / dist) * force;
        }

        // Add some random wandering
        bird.vx += (Math.random() - 0.5) * 0.3;
        bird.vy += (Math.random() - 0.5) * 0.3;

        // Limit speed
        const speed = Math.sqrt(bird.vx * bird.vx + bird.vy * bird.vy);
        const maxSpeed = 5;
        const minSpeed = 2;
        
        if (speed > maxSpeed) {
          bird.vx = (bird.vx / speed) * maxSpeed;
          bird.vy = (bird.vy / speed) * maxSpeed;
        } else if (speed < minSpeed && speed > 0) {
          bird.vx = (bird.vx / speed) * minSpeed;
          bird.vy = (bird.vy / speed) * minSpeed;
        }

        bird.x += bird.vx;
        bird.y += bird.vy;

        // Wrap around edges smoothly
        if (bird.x < -50) bird.x = width + 50;
        if (bird.x > width + 50) bird.x = -50;
        if (bird.y < -50) bird.y = height + 50;
        if (bird.y > height + 50) bird.y = -50;

        drawBird(bird, time);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};
