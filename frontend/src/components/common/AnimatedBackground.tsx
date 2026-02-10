"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const blobRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    blobRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        x: () => gsap.utils.random(-200, 200),
        y: () => gsap.utils.random(-160, 160),
        scale: () => gsap.utils.random(0.9, 1.25),
        duration: () => gsap.utils.random(8, 16),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        repeatRefresh: true,
      });
    });

    const onPointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 8;
      const y = (e.clientY / innerHeight - 0.5) * 8;
      gsap.to(containerRef.current, {
        x,
        y,
        duration: 0.6,
        ease: "sine.out",
      });
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <div
        ref={(el) => {
          if (el) blobRefs.current.push(el);
        }}
        className="absolute blur-3xl opacity-50"
        style={{
          width: "70vw",
          height: "70vw",
          left: "-10vw",
          top: "-20vw",
          background:
            "radial-gradient(circle at 30% 30%, #FF6B9D 0%, rgba(255,107,157,0.0) 60%)",
        }}
      />
      <div
        ref={(el) => {
          if (el) blobRefs.current.push(el);
        }}
        className="absolute blur-[60px] opacity-45"
        style={{
          width: "60vw",
          height: "60vw",
          right: "-15vw",
          top: "-10vw",
          background:
            "radial-gradient(circle at 70% 40%, #C06CFF 0%, rgba(192,108,255,0.0) 60%)",
        }}
      />
      <div
        ref={(el) => {
          if (el) blobRefs.current.push(el);
        }}
        className="absolute blur-[80px] opacity-40"
        style={{
          width: "65vw",
          height: "65vw",
          left: "10vw",
          bottom: "-15vw",
          background:
            "radial-gradient(circle at 50% 60%, #4ECDC4 0%, rgba(78,205,196,0.0) 60%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent dark:via-black/10" />
    </div>
  );
}
