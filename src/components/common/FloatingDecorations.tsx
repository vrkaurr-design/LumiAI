"use client";
import { useEffect, useRef } from "react";

export default function FloatingDecorations() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sparkles: Array<{ x: number; y: number; r: number; hue: number; vx: number; vy: number; ph: number }> = [];
    const emojis: Array<{ x: number; y: number; s: number; vx: number; vy: number; ph: number; ch: string; a: number }> = [];
    const emojiSet = ["✨", "💖", "🌸", "⭐", "💎"];

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sparkles.length = 0;
      emojis.length = 0;
      const sc = Math.floor(Math.sqrt(w * h) * 0.08);
      for (let i = 0; i < sc; i++) {
        sparkles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.2 + 0.8,
          hue: [330, 270, 200][Math.floor(Math.random() * 3)],
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          ph: Math.random() * Math.PI * 2,
        });
      }
      const ec = Math.floor(Math.sqrt(w * h) * 0.018);
      for (let i = 0; i < ec; i++) {
        emojis.push({
          x: Math.random() * w,
          y: Math.random() * h,
          s: Math.random() * 16 + 16,
          vx: (Math.random() - 0.5) * 0.05,
          vy: (Math.random() - 0.5) * 0.05,
          ph: Math.random() * Math.PI * 2,
          ch: emojiSet[Math.floor(Math.random() * emojiSet.length)],
          a: Math.random() * 0.5 + 0.4,
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let s of sparkles) {
        s.ph += 0.02;
        const a = 0.35 + 0.65 * Math.abs(Math.sin(s.ph));
        const r = s.r * (0.8 + 0.6 * Math.sin(s.ph));
        const g = ctx.createRadialGradient(s.x, s.y, r * 0.2, s.x, s.y, r);
        g.addColorStop(0, `hsla(${s.hue}, 90%, 70%, ${a})`);
        g.addColorStop(1, `rgba(0,0,0,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;
        if (s.y < -10) s.y = h + 10;
        if (s.y > h + 10) s.y = -10;
      }
      ctx.globalCompositeOperation = "source-over";
      for (let e of emojis) {
        e.ph += 0.02;
        ctx.globalAlpha = e.a * (0.7 + 0.3 * Math.sin(e.ph));
        ctx.font = `${e.s}px system-ui, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(e.ch, e.x, e.y);
        ctx.globalAlpha = 1;
        e.x += e.vx + Math.sin(e.ph) * 0.05;
        e.y += e.vy + Math.cos(e.ph) * 0.05;
        if (e.x < -20) e.x = w + 20;
        if (e.x > w + 20) e.x = -20;
        if (e.y < -20) e.y = h + 20;
        if (e.y > h + 20) e.y = -20;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-5 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
