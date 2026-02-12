"use client";
import { useEffect, useRef } from "react";

export default function SkinShadeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const centers = [
      { x: 0.28, y: 0.32, r: 0.62, color: "rgba(240,245,255,0.55)", dx: 0.00028, dy: -0.00018 },
      { x: 0.68, y: 0.38, r: 0.58, color: "rgba(235,240,248,0.5)", dx: -0.00022, dy: 0.00022 },
      { x: 0.45, y: 0.75, r: 0.68, color: "rgba(245,250,255,0.48)", dx: 0.00018, dy: 0.00012 },
      { x: 0.18, y: 0.66, r: 0.55, color: "rgba(235,245,250,0.45)", dx: -0.00018, dy: -0.00009 },
    ];

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawNoise = (w: number, h: number) => {
      const density = Math.floor(Math.sqrt(w * h) * 0.01);
      ctx.globalAlpha = 0.06;
      for (let i = 0; i < density; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const s = Math.random() * 2 + 0.8;
        const c = `rgba(${240 + Math.floor(Math.random() * 10)},${240 + Math.floor(Math.random() * 10)},${240 + Math.floor(Math.random() * 10)},1)`;
        ctx.fillStyle = c;
        ctx.fillRect(x, y, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const animate = (start: number) => {
      const loop = (now: number) => {
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";

        for (let i = 0; i < centers.length; i++) {
          const c = centers[i];
          const gx = w * c.x;
          const gy = h * c.y;
          const gr = Math.max(w, h) * c.r;
          const g = ctx.createRadialGradient(gx, gy, gr * 0.15, gx, gy, gr);
          g.addColorStop(0, c.color);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
          c.x += c.dx;
          c.y += c.dy;
          if (c.x < 0.1 || c.x > 0.9) c.dx *= -1;
          if (c.y < 0.1 || c.y > 0.9) c.dy *= -1;
        }

        const vg = ctx.createRadialGradient(w * 0.5, h * 0.6, 0, w * 0.5, h * 0.6, Math.max(w, h) * 0.8);
        vg.addColorStop(0, "rgba(255,255,255,0.08)");
        vg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, w, h);

        drawNoise(w, h);

        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    };
    animate(performance.now());

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/15 to-transparent dark:from-black/30 dark:via-black/20 dark:to-transparent" />
    </div>
  );
}
