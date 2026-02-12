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
  const dropsRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      len: number;
      alpha: number;
      hue: number;
    }>
  >([]);
  const faceBoxRef = useRef<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });
  const featuresRef = useRef<Array<Array<{ x: number; y: number }>>>([]);
  const nodesRef = useRef<Array<{ x: number; y: number }>>([]);

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
      const count = Math.floor(Math.sqrt(w * h) * 0.05);
      particlesRef.current = Array.from({ length: count }).map(() => {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.2 + 0.8,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          tw: Math.random() * 2 + 0.6,
          ph: Math.random() * Math.PI * 2,
          hue: [210, 200, 190][Math.floor(Math.random() * 3)],
        };
      });
      const dCount = Math.floor(Math.sqrt(w * h) * 0.02);
      dropsRef.current = Array.from({ length: dCount }).map(() => {
        const hue = [210, 200, 190][Math.floor(Math.random() * 3)];
        return {
          x: Math.random() * w,
          y: Math.random() * h * -0.2,
          vx: (Math.random() - 0.5) * 0.25,
          vy: Math.random() * 0.5 + 0.35,
          len: Math.random() * 40 + 30,
          alpha: Math.random() * 0.3 + 0.25,
          hue,
        };
      });
      const minSide = Math.min(w, h);
      const bw = minSide * 0.45;
      const bh = minSide * 0.58;
      const bx = w * 0.5 - bw * 0.5;
      const by = h * 0.5 - bh * 0.5 - minSide * 0.04;
      faceBoxRef.current = { x: bx, y: by, w: bw, h: bh };
      const N = (arr: Array<[number, number]>) =>
        arr.map(([nx, ny]) => ({ x: bx + nx * bw, y: by + ny * bh }));
      const jaw = N([
        [0.07, 0.75],
        [0.15, 0.86],
        [0.28, 0.93],
        [0.5, 0.96],
        [0.72, 0.93],
        [0.85, 0.86],
        [0.93, 0.75],
      ]);
      const browL = N([
        [0.18, 0.33],
        [0.27, 0.29],
        [0.35, 0.28],
      ]);
      const browR = N([
        [0.65, 0.28],
        [0.73, 0.29],
        [0.82, 0.33],
      ]);
      const eyeL = N([
        [0.28, 0.42],
        [0.33, 0.40],
        [0.38, 0.42],
        [0.33, 0.44],
        [0.28, 0.42],
      ]);
      const eyeR = N([
        [0.62, 0.42],
        [0.67, 0.40],
        [0.72, 0.42],
        [0.67, 0.44],
        [0.62, 0.42],
      ]);
      const nose = N([
        [0.5, 0.38],
        [0.5, 0.48],
        [0.47, 0.56],
        [0.53, 0.56],
      ]);
      const lips = N([
        [0.40, 0.72],
        [0.48, 0.70],
        [0.60, 0.72],
        [0.48, 0.74],
        [0.40, 0.72],
      ]);
      const faceOutline = N([
        [0.5, 0.12],
        [0.65, 0.18],
        [0.80, 0.30],
        [0.90, 0.50],
        [0.85, 0.70],
        [0.70, 0.85],
        [0.50, 0.92],
        [0.30, 0.85],
        [0.15, 0.70],
        [0.10, 0.50],
        [0.20, 0.30],
        [0.35, 0.18],
        [0.5, 0.12],
      ]);
      featuresRef.current = [faceOutline, jaw, browL, browR, eyeL, eyeR, nose, lips];
      nodesRef.current = [
        ...eyeL,
        ...eyeR,
        nose[1],
        nose[2],
        lips[1],
        lips[2],
        browL[1],
        browR[1],
      ].map((p) => ({ x: p.x, y: p.y }));
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
        drawBlob(x1, y1, rBase * 0.85, "rgba(210,225,255,0.45)", 0.45);

        const x2 = w * 0.68 + Math.cos(t * 1.3) * w * 0.18 - px;
        const y2 = h * 0.32 + Math.sin(t * 1.7) * h * 0.14 - py;
        drawBlob(x2, y2, rBase * 0.8, "rgba(225,245,255,0.38)", 0.4);

        const x3 = w * 0.5 + Math.sin(t * 0.9) * w * 0.1 + px * 0.5;
        const y3 = h * 0.75 + Math.cos(t * 1.2) * h * 0.12 + py * 0.5;
        drawBlob(x3, y3, rBase * 0.9, "rgba(236,250,245,0.35)", 0.35);

        const rg = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.6);
        rg.addColorStop(0, "rgba(255,255,255,0.12)");
        rg.addColorStop(0.4, "rgba(255,255,255,0.06)");
        rg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, w, h);

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
        for (let d of dropsRef.current) {
          const lg = ctx.createLinearGradient(d.x, d.y - d.len, d.x, d.y);
          lg.addColorStop(0, `hsla(${d.hue}, 80%, 92%, 0)`);
          lg.addColorStop(1, `hsla(${d.hue}, 85%, 75%, ${d.alpha})`);
          ctx.fillStyle = lg;
          ctx.fillRect(d.x - 0.9, d.y - d.len, 1.8, d.len);
          d.vy += 0.008;
          d.x += d.vx + px * 0.0002;
          d.y += d.vy + py * 0.0001;
          if (d.y > h + 20) {
            d.y = -30;
            d.x = Math.random() * w;
            d.vx = (Math.random() - 0.5) * 0.25;
            d.vy = Math.random() * 0.6 + 0.4;
            d.len = Math.random() * 40 + 30;
            d.alpha = Math.random() * 0.4 + 0.35;
            d.hue = [210, 200, 190][Math.floor(Math.random() * 3)];
          }
        }
        ctx.globalCompositeOperation = "source-over";
        const box = faceBoxRef.current;
        const dashOffset = (t * 120) % 200;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([10, 12]);
        for (let poly of featuresRef.current) {
          ctx.strokeStyle = "rgba(255,255,255,0.6)";
          ctx.beginPath();
          for (let i = 0; i < poly.length; i++) {
            const p = poly[i];
            const ox = px * 0.02;
            const oy = py * 0.02;
            if (i === 0) ctx.moveTo(p.x + ox, p.y + oy);
            else ctx.lineTo(p.x + ox, p.y + oy);
          }
          ctx.lineDashOffset = -dashOffset;
          ctx.stroke();
        }
        ctx.setLineDash([]);
        for (let p of nodesRef.current) {
          const ox = px * 0.02;
          const oy = py * 0.02;
          const r = 2 + 1.5 * (0.5 + 0.5 * Math.sin(t * 3 + p.x * 0.01));
          const g = ctx.createRadialGradient(p.x + ox, p.y + oy, r * 0.3, p.x + ox, p.y + oy, r);
          g.addColorStop(0, "rgba(255,255,255,0.9)");
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x + ox, p.y + oy, r, 0, Math.PI * 2);
          ctx.fill();
        }
        const scanY =
          box.y + box.h * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.8))) + py * 0.02;
        const sg = ctx.createLinearGradient(box.x, scanY, box.x + box.w, scanY);
        sg.addColorStop(0, "rgba(255,255,255,0)");
        sg.addColorStop(0.5, "rgba(255,255,255,0.35)");
        sg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = sg;
        ctx.fillRect(box.x, scanY - 1.5, box.w, 3);
        for (let p of nodesRef.current) {
          if (Math.abs(p.y - scanY) < 4) {
            const r = 3.5;
            const g = ctx.createRadialGradient(p.x, p.y, r * 0.3, p.x, p.y, r);
            g.addColorStop(0, "rgba(255,255,255,0.8)");
            g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }

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
