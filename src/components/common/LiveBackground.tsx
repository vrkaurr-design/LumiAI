"use client";
import { useEffect, useRef } from "react";

export default function LiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      tw: number;
      ph: number;
      hue: number;
    }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor(Math.sqrt(w * h) * 0.06);
      particlesRef.current = Array.from({ length: count }).map(() => {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.4 + 0.8,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          tw: Math.random() * 2 + 0.6,
          ph: Math.random() * Math.PI * 2,
          hue: [330, 270, 170][Math.floor(Math.random() * 3)],
        };
      });
    };
    resize();

    const onPointerMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 0.08;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 0.08;
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", resize);

    const drawBlob = (
      x: number,
      y: number,
      r: number,
      color: string,
      fade = 0.65
    ) => {
      const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, `rgba(0,0,0,0)`);
      ctx.globalAlpha = fade;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const animate = (tStart: number) => {
      const loop = (now: number) => {
        const t = (now - tStart) * 0.00025;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";

        const px = pointer.current.x * w;
        const py = pointer.current.y * h;

        const rBase = Math.max(w, h) * 0.55;

        const x1 = w * 0.3 + Math.sin(t * 1.1) * w * 0.15 + px;
        const y1 = h * 0.35 + Math.cos(t * 1.5) * h * 0.12 + py;
        drawBlob(x1, y1, rBase * 0.85, "rgba(255,107,157,0.8)", 0.55);

        const x2 = w * 0.68 + Math.cos(t * 1.3) * w * 0.18 - px;
        const y2 = h * 0.32 + Math.sin(t * 1.7) * h * 0.14 - py;
        drawBlob(x2, y2, rBase * 0.8, "rgba(192,108,255,0.8)", 0.5);

        const x3 = w * 0.5 + Math.sin(t * 0.9) * w * 0.1 + px * 0.5;
        const y3 = h * 0.75 + Math.cos(t * 1.2) * h * 0.12 + py * 0.5;
        drawBlob(x3, y3, rBase * 0.9, "rgba(78,205,196,0.75)", 0.45);

        ctx.globalCompositeOperation = "source-over";
        ctx.globalCompositeOperation = "lighter";
        for (let p of particlesRef.current) {
          p.ph += 0.02;
          const alpha = 0.35 + 0.65 * Math.abs(Math.sin(p.ph * p.tw));
          const r = p.r * (0.8 + 0.6 * Math.sin(p.ph * p.tw));
          const g = ctx.createRadialGradient(p.x, p.y, r * 0.2, p.x, p.y, r);
          g.addColorStop(0, `hsla(${p.hue}, 85%, 70%, ${alpha})`);
          g.addColorStop(1, `rgba(0,0,0,0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
          p.x += p.vx + px * 0.0003;
          p.y += p.vy + py * 0.0003;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }
        ctx.globalCompositeOperation = "source-over";

        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    };
    animate(performance.now());

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/10 to-transparent dark:from-black/30 dark:via-black/20 dark:to-transparent" />
    </div>
  );
}
