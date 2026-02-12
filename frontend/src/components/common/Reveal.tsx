"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  variant?: "fade" | "pop";
  delay?: number;
};

export default function Reveal({
  children,
  as = "div",
  className = "",
  variant = "fade",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag: any = as;
  const base = "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform will-change-opacity";
  const hidden = variant === "pop"
    ? "opacity-0 translate-y-3 scale-[0.98]"
    : "opacity-0 translate-y-3";
  const shown = "opacity-100 translate-y-0 scale-100";

  return (
    <Tag
      ref={ref as any}
      className={`${base} ${visible ? shown : hidden} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
