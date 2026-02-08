"use client";
import { useEffect, useState } from "react";

type Product = { name: string; shade: string };
type MakeupSet = {
  foundations: Product[];
  concealer: Product[];
  corrector: Product[];
  lipstick: Product[];
  fixer: Product[];
  contour: Product[];
};

const shadeText: Record<string, { foundation: string; concealer: string; corrector: string; lipstick: string; fixer: string; contour: string }> = {
  warm: {
    foundation: "Golden/Yellow base",
    concealer: "Peach/Yellow undertone",
    corrector: "Peach/Orange for blue/purple areas",
    lipstick: "Coral, Peach, Warm reds",
    fixer: "Dewy finish suits warm glow",
    contour: "Honey/Golden brown",
  },
  cool: {
    foundation: "Neutral/Rosy base",
    concealer: "Pink/Neutral undertone",
    corrector: "Pink/Salmon for blue areas",
    lipstick: "Berry, Rose, Blue-based reds",
    fixer: "Soft-matte for balanced finish",
    contour: "Ash/Neutral brown",
  },
  neutral: {
    foundation: "Neutral balanced base",
    concealer: "Neutral undertone",
    corrector: "Peach/Salmon versatile",
    lipstick: "Nude, Mauve, Balanced reds",
    fixer: "Natural finish setting spray",
    contour: "Neutral brown",
  },
};

const makeupProducts: Record<"warm" | "cool" | "neutral", MakeupSet> = {
  warm: {
    foundations: [
      { name: "Radiant Glow Foundation", shade: "Golden Beige 210" },
      { name: "Silk Finish Foundation", shade: "Warm Sand 220" },
      { name: "Longwear Fluid", shade: "Honey 240" },
    ],
    concealer: [
      { name: "Bright Fix Concealer", shade: "Peach 02" },
      { name: "Ultra Cover Concealer", shade: "Warm Ivory 1.5" },
    ],
    corrector: [
      { name: "Tone Corrector", shade: "Peach" },
      { name: "Deep Corrector", shade: "Orange" },
    ],
    lipstick: [
      { name: "Velvet Lip", shade: "Coral Crush" },
      { name: "Moist Matte", shade: "Sunset Peach" },
      { name: "Satin Rouge", shade: "Spiced Red" },
    ],
    fixer: [
      { name: "Dew Set Mist", shade: "Hydrating Finish" },
      { name: "Glow Lock", shade: "Radiant Hold" },
    ],
    contour: [
      { name: "Cream Contour", shade: "Golden Tan" },
      { name: "Powder Sculpt", shade: "Honey Brown" },
    ],
  },
  cool: {
    foundations: [
      { name: "Balance Base", shade: "Neutral Porcelain 110" },
      { name: "Soft Matte Foundation", shade: "Cool Ivory 120" },
      { name: "Skin Tint", shade: "Rosy Nude 130" },
    ],
    concealer: [
      { name: "Blur Concealer", shade: "Pink 01" },
      { name: "Precision Conceal", shade: "Neutral Light 1.0" },
    ],
    corrector: [
      { name: "Under-Eye Correct", shade: "Salmon" },
      { name: "Neutralize Stick", shade: "Pink" },
    ],
    lipstick: [
      { name: "Cream Lip Color", shade: "Berry Bloom" },
      { name: "Matte Luxe", shade: "Rose Petal" },
      { name: "Liquid Lip", shade: "Ruby Blue" },
    ],
    fixer: [
      { name: "Soft-Matte Mist", shade: "Balanced Finish" },
      { name: "Stay Cool Spray", shade: "Oil-Control" },
    ],
    contour: [
      { name: "Contour Palette", shade: "Ash Brown" },
      { name: "Sculpt Stick", shade: "Neutral Taupe" },
    ],
  },
  neutral: {
    foundations: [
      { name: "True Match", shade: "Neutral Beige 200" },
      { name: "Natural Wear", shade: "Nude 210" },
      { name: "Even Tone", shade: "Balanced Buff 230" },
    ],
    concealer: [
      { name: "Flex Concealer", shade: "Neutral 2.0" },
      { name: "Cover Pen", shade: "Balanced Light 1.8" },
    ],
    corrector: [
      { name: "Universal Corrector", shade: "Peach" },
      { name: "Perfecting Correct", shade: "Salmon" },
    ],
    lipstick: [
      { name: "Comfort Lip", shade: "Nude Veil" },
      { name: "Soft Matte", shade: "Mauve Glow" },
      { name: "Gloss Tint", shade: "Balanced Red" },
    ],
    fixer: [
      { name: "Natural Set", shade: "Weightless Hold" },
      { name: "Comfort Mist", shade: "Fresh Finish" },
    ],
    contour: [
      { name: "Neutral Sculpt", shade: "Balanced Brown" },
      { name: "Contour Duo", shade: "Soft Tan" },
    ],
  },
};

export default function TryOn() {
  const [tone, setTone] = useState<"warm" | "cool" | "neutral">("neutral");
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    try {
      const t = sessionStorage.getItem("analysis:tone") as "warm" | "cool" | "neutral" | null;
      if (t) setTone(t);
    } catch {}
    const id = setTimeout(() => setShowOverlay(false), 900);
    return () => clearTimeout(id);
  }, []);

  const s = shadeText[tone];
  const p = makeupProducts[tone];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
      {showOverlay && (
        <div className="product-ripple">
          <div className="bubble" style={{ width: 160, height: 160, left: "12%", top: "18%" }} />
          <div className="bubble" style={{ width: 220, height: 220, left: "68%", top: "28%" }} />
          <div className="bubble" style={{ width: 140, height: 140, left: "40%", top: "60%" }} />
          <div className="bubble" style={{ width: 260, height: 260, left: "8%", top: "70%" }} />
        </div>
      )}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-secondary/35 via-primary/25 to-pink-200/10 mix-blend-soft-light" />
      <div className="w-full max-w-3xl mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-black/45 backdrop-blur-xl shadow-2xl p-6 relative z-10">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-primary text-pop-bright">Makeup Recommendations</h1>
        <p className="text-center text-sm text-gray-700 dark:text-gray-300 mb-6">
          Tailored to your undertone: <span className="font-semibold capitalize">{tone}</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border card-pop bg-gradient-to-br from-pink-50 to-purple-50 dark:from-fuchsia-900/40 dark:to-purple-900/40 border-pink-100 dark:border-fuchsia-800 pop-in">
            <div className="text-xl font-bold mb-1">Foundations</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{s.foundation}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.foundations.map((it, i) => (
                <div key={`fd-${i}`} className="rounded-lg border bg-white/70 dark:bg-white/10 dark:text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{it.shade}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border card-pop bg-gradient-to-br from-pink-50 to-purple-50 dark:from-fuchsia-900/40 dark:to-purple-900/40 border-pink-100 dark:border-fuchsia-800 pop-in" style={{ animationDelay: "60ms" }}>
            <div className="text-xl font-bold mb-1">Concealer</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{s.concealer}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.concealer.map((it, i) => (
                <div key={`cn-${i}`} className="rounded-lg border bg-white/70 dark:bg-white/10 dark:text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{it.shade}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border card-pop bg-gradient-to-br from-pink-50 to-purple-50 dark:from-fuchsia-900/40 dark:to-purple-900/40 border-pink-100 dark:border-fuchsia-800 pop-in" style={{ animationDelay: "120ms" }}>
            <div className="text-xl font-bold mb-1">Colour Corrector</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{s.corrector}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.corrector.map((it, i) => (
                <div key={`cc-${i}`} className="rounded-lg border bg-white/70 dark:bg-white/10 dark:text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{it.shade}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border card-pop bg-gradient-to-br from-pink-50 to-purple-50 dark:from-fuchsia-900/40 dark:to-purple-900/40 border-pink-100 dark:border-fuchsia-800 pop-in" style={{ animationDelay: "180ms" }}>
            <div className="text-xl font-bold mb-1">Lipsticks</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{s.lipstick}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.lipstick.map((it, i) => (
                <div key={`lp-${i}`} className="rounded-lg border bg-white/70 dark:bg-white/10 dark:text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{it.shade}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border card-pop bg-gradient-to-br from-pink-50 to-purple-50 dark:from-fuchsia-900/40 dark:to-purple-900/40 border-pink-100 dark:border-fuchsia-800 pop-in" style={{ animationDelay: "240ms" }}>
            <div className="text-xl font-bold mb-1">Makeup Fixer</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{s.fixer}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.fixer.map((it, i) => (
                <div key={`fx-${i}`} className="rounded-lg border bg-white/70 dark:bg-white/10 dark:text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{it.shade}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border card-pop bg-gradient-to-br from-pink-50 to-purple-50 dark:from-fuchsia-900/40 dark:to-purple-900/40 border-pink-100 dark:border-fuchsia-800 pop-in" style={{ animationDelay: "300ms" }}>
            <div className="text-xl font-bold mb-1">Contour</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{s.contour}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.contour.map((it, i) => (
                <div key={`ct-${i}`} className="rounded-lg border bg-white/70 dark:bg-white/10 dark:text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{it.shade}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <a href="/skin-analysis" className="px-5 py-2 rounded-lg bg-dark dark:bg-white text-white dark:text-dark text-sm font-semibold hover:opacity-90 transition-opacity">
            Back to Analysis
          </a>
        </div>
      </div>
    </div>
  );
}
