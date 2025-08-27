// components/CherryBlossomSnowfall.js
"use client";

import { useEffect, useRef } from "react";

export default function CherryBlossomSnowfall({ isDarkMode }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = window.innerWidth,
      h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    const color = isDarkMode
  ? "rgba(255, 182, 193, 0.9)"  // light pink glow
  : "rgba(220, 20, 60, 0.8)";   // deeper pink

    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 1.6 + 0.6,
      speedY: 0.2 + Math.random() * 0.4,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed: 0.005 + Math.random() * 0.01,
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * 0.3;
        p.y += p.speedY;
        if (p.y > h) {
          p.y = 0;
          p.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w; canvas.height = h;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}