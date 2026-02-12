 "use client";
 import { useEffect, useRef } from "react";
 
 export default function ProBackground() {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const rafRef = useRef<number | null>(null);
   const pointer = useRef({ x: 0, y: 0 });
  const blobsRef = useRef<Array<{ x: number; y: number; r: number; color: string; ph: number }>>([]);
  const nodesRef = useRef<Array<{ x: number; y: number; ox: number; oy: number; vx: number; vy: number; ph: number }>>([]);
 
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
      const d = Math.max(w, h);
      blobsRef.current = [
        { x: w * 0.25, y: h * 0.28, r: d * 0.42, color: "rgba(210,230,255,0.32)", ph: Math.random() * Math.PI * 2 },
        { x: w * 0.7, y: h * 0.33, r: d * 0.38, color: "rgba(235,245,255,0.28)", ph: Math.random() * Math.PI * 2 },
        { x: w * 0.5, y: h * 0.75, r: d * 0.46, color: "rgba(238,250,245,0.26)", ph: Math.random() * Math.PI * 2 },
      ];
      const nx = Math.max(10, Math.floor(w / 140));
      const ny = Math.max(7, Math.floor(h / 140));
      nodesRef.current = [];
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          const ox = (i / (nx - 1)) * w;
          const oy = (j / (ny - 1)) * h;
          nodesRef.current.push({
            x: ox + (Math.random() - 0.5) * 6,
            y: oy + (Math.random() - 0.5) * 6,
            ox,
            oy,
            vx: (Math.random() - 0.5) * 0.08,
            vy: (Math.random() - 0.5) * 0.08,
            ph: Math.random() * Math.PI * 2,
          });
        }
      }
     };
     resize();
     window.addEventListener("resize", resize);
 
     const onPointerMove = (e: PointerEvent) => {
       pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 0.06;
       pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 0.06;
     };
     window.addEventListener("pointermove", onPointerMove);
 
    const drawBase = (w: number, h: number) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(249,251,255,1)");
      g.addColorStop(1, "rgba(244,247,251,1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };
 
    const waveBands = [
      { y: 0.30, amp: 0.08, speed: 0.65, color: "rgba(198,220,255,0.62)" },
      { y: 0.55, amp: 0.07, speed: 0.55, color: "rgba(208,235,255,0.52)" },
      { y: 0.75, amp: 0.06, speed: 0.45, color: "rgba(215,240,255,0.45)" },
    ];
 
     const drawWaves = (t: number, w: number, h: number) => {
       const px = pointer.current.x;
       const py = pointer.current.y;
       for (let b of waveBands) {
         ctx.beginPath();
         const baseY = h * b.y + py * h * 0.05;
         const step = Math.max(16, Math.floor(w / 64));
         for (let x = 0; x <= w; x += step) {
           const k = x / w;
           const y =
             baseY +
             Math.sin(k * Math.PI * 2 + t * b.speed) * h * b.amp * (0.9 + 0.1 * Math.sin(t * 0.3)) +
             Math.cos(k * Math.PI + t * (b.speed * 0.8)) * h * b.amp * 0.3 +
             px * w * 0.02 * (k - 0.5);
           if (x === 0) ctx.moveTo(x, y);
           else ctx.lineTo(x, y);
         }
         ctx.lineTo(w, h);
         ctx.lineTo(0, h);
         ctx.closePath();
         ctx.fillStyle = b.color;
         ctx.fill();
       }
     };
 
    const drawDots = (w: number, h: number) => {
      const spacing = Math.max(40, Math.floor(Math.min(w, h) / 20));
      ctx.globalAlpha = 0.06;
       for (let y = spacing * 0.5; y < h; y += spacing) {
         for (let x = spacing * 0.5; x < w; x += spacing) {
          ctx.fillStyle = "rgba(170,185,215,1)";
           ctx.fillRect(x, y, 1, 1);
         }
       }
       ctx.globalAlpha = 1;
     };
 
    const drawBlobs = (t: number, w: number, h: number) => {
      const px = pointer.current.x;
      const py = pointer.current.y;
      for (let b of blobsRef.current) {
        b.ph += 0.002;
        const x = b.x + Math.sin(t * 0.6 + b.ph) * w * 0.012 + px * w * 0.02;
        const y = b.y + Math.cos(t * 0.5 + b.ph) * h * 0.01 + py * h * 0.02;
        const g = ctx.createRadialGradient(x, y, b.r * 0.18, x, y, b.r);
        g.addColorStop(0, b.color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
    };
 
    const drawStripes = (t: number, w: number, h: number) => {
      ctx.save();
      ctx.translate(w * 0.5, h * 0.5);
      ctx.rotate(Math.PI / 14);
      const spacing = Math.max(90, Math.floor(w / 9));
      const offset = ((t * 36) % spacing) - spacing;
      for (let i = -3; i <= 3; i++) {
        const x = i * spacing + offset;
        const lg = ctx.createLinearGradient(x - 40, -h, x + 40, h);
        lg.addColorStop(0, "rgba(230,240,255,0)");
        lg.addColorStop(0.5, "rgba(200,215,240,0.26)");
        lg.addColorStop(1, "rgba(230,240,255,0)");
        ctx.fillStyle = lg;
        ctx.fillRect(x - 30, -h, 60, h * 2);
      }
      ctx.restore();
    };
 
    const drawNetwork = (t: number, w: number, h: number) => {
      const px = pointer.current.x;
      const py = pointer.current.y;
      ctx.strokeStyle = "rgba(160,180,210,0.35)";
      ctx.lineWidth = 1.0;
      const nx = Math.max(10, Math.floor(w / 140));
      const ny = Math.max(7, Math.floor(h / 140));
      for (let idx = 0; idx < nodesRef.current.length; idx++) {
        const n = nodesRef.current[idx];
        n.ph += 0.01;
        n.vx += Math.sin(n.ph) * 0.0005;
        n.vy += Math.cos(n.ph) * 0.0005;
        n.x += n.vx + px * 0.03;
        n.y += n.vy + py * 0.03;
        n.x += (n.ox - n.x) * 0.02;
        n.y += (n.oy - n.y) * 0.02;
      }
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          const idx = j * nx + i;
          const a = nodesRef.current[idx];
          if (!a) continue;
          if (i + 1 < nx) {
            const b = nodesRef.current[idx + 1];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
          if (j + 1 < ny) {
            const c = nodesRef.current[idx + nx];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(c.x, c.y);
            ctx.stroke();
          }
        }
      }
    };
 
     const animate = (tStart: number) => {
       const loop = (now: number) => {
         const w = canvas.width / dpr;
         const h = canvas.height / dpr;
         const t = (now - tStart) * 0.0012;
         drawBase(w, h);
         drawWaves(t, w, h);
      drawBlobs(t, w, h);
      drawStripes(t, w, h);
      drawNetwork(t, w, h);
         drawDots(w, h);
      const overlay = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
      overlay.addColorStop(0, "rgba(255,255,255,0.18)");
         overlay.addColorStop(1, "rgba(255,255,255,0)");
         ctx.fillStyle = overlay;
         ctx.fillRect(0, 0, w, h);
         rafRef.current = requestAnimationFrame(loop);
       };
       rafRef.current = requestAnimationFrame(loop);
     };
     animate(performance.now());
 
     return () => {
       window.removeEventListener("resize", resize);
       window.removeEventListener("pointermove", onPointerMove);
       if (rafRef.current) cancelAnimationFrame(rafRef.current);
     };
   }, []);
 
   return (
     <div className="fixed inset-0 -z-10 pointer-events-none">
       <canvas ref={canvasRef} className="w-full h-full" />
       <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent" />
     </div>
   );
 }
