"use client";
import { useEffect, useState } from "react";

type SkinType = "dry" | "oily" | "combination";

type CareItem = { name: string; detail: string };
type CareSet = {
  toner: CareItem[];
  cleanser: CareItem[];
  facewash: CareItem[];
  facepacks: CareItem[];
  masks: CareItem[];
  sunscreen: CareItem[];
  moisturiser: CareItem[];
};

const careText: Record<SkinType, { toner: string; cleanser: string; facewash: string; facepacks: string; masks: string; sunscreen: string; moisturiser: string }> = {
  dry: {
    toner: "Hydrating toner with hyaluronic acid",
    cleanser: "Cream cleanser, non-stripping",
    facewash: "Gentle, sulphate-free",
    facepacks: "Nourishing packs with oils",
    masks: "Hydrating sheet masks",
    sunscreen: "Moisturizing SPF, dewy finish",
    moisturiser: "Rich cream with ceramides",
  },
  oily: {
    toner: "Balancing toner with BHA",
    cleanser: "Gel cleanser, controls sebum",
    facewash: "Foaming, non-comedogenic",
    facepacks: "Clay packs to absorb oil",
    masks: "Clay/charcoal masks weekly",
    sunscreen: "Lightweight, matte SPF",
    moisturiser: "Oil-free gel moisturiser",
  },
  combination: {
    toner: "pH-balancing toner",
    cleanser: "Gentle gel cleanser",
    facewash: "Mild, daily use",
    facepacks: "Hydrate cheeks; clay T-zone",
    masks: "Multi-masking for zones",
    sunscreen: "Light SPF, non-greasy",
    moisturiser: "Balanced lotion",
  },
};

const careProducts: Record<SkinType, CareSet> = {
  dry: {
    toner: [
      { name: "Hydra Toner", detail: "2% HA + Vitamin B5" },
      { name: "Moist Glow Toner", detail: "Ceramide complex" },
    ],
    cleanser: [
      { name: "Cream Cleanse", detail: "Gentle, non-foaming" },
      { name: "Comfort Wash", detail: "Oat extract" },
    ],
    facewash: [
      { name: "Soft Foam", detail: "Sulphate-free" },
    ],
    facepacks: [
      { name: "Nourish Pack", detail: "Argan & Shea" },
      { name: "Deep Comfort", detail: "Squalane mask" },
    ],
    masks: [
      { name: "Hydra Sheet", detail: "HA + Aloe" },
      { name: "Plump Mask", detail: "Collagen boost" },
    ],
    sunscreen: [
      { name: "Dewy SPF 50", detail: "Moisturizing finish" },
    ],
    moisturiser: [
      { name: "Rich Cream", detail: "Ceramides + Lipids" },
      { name: "Night Repair", detail: "Peptides complex" },
    ],
  },
  oily: {
    toner: [
      { name: "Balance Toner", detail: "2% BHA" },
      { name: "Clarify Mist", detail: "Niacinamide" },
    ],
    cleanser: [
      { name: "Gel Cleanse", detail: "Oil-control" },
      { name: "Clear Wash", detail: "Tea tree" },
    ],
    facewash: [
      { name: "Foam Fresh", detail: "Non-comedogenic" },
    ],
    facepacks: [
      { name: "Clay Pack", detail: "Kaolin + Zinc" },
      { name: "Oil Absorb", detail: "Charcoal" },
    ],
    masks: [
      { name: "Charcoal Mask", detail: "Weekly detox" },
    ],
    sunscreen: [
      { name: "Matte SPF 50", detail: "Shine-free" },
    ],
    moisturiser: [
      { name: "Oil-Free Gel", detail: "Lightweight" },
      { name: "Balance Lotion", detail: "Niacinamide 5%" },
    ],
  },
  combination: {
    toner: [
      { name: "pH Balance", detail: "Gentle formula" },
      { name: "Zone Care", detail: "Targeted hydration" },
    ],
    cleanser: [
      { name: "Gentle Gel", detail: "Daily use" },
      { name: "Pure Cleanse", detail: "Low surfactant" },
    ],
    facewash: [
      { name: "Mild Wash", detail: "Comfort cleanse" },
    ],
    facepacks: [
      { name: "Hydrate Cheeks", detail: "HA rich" },
      { name: "Clay T-zone", detail: "Sebum control" },
    ],
    masks: [
      { name: "Multi-Mask", detail: "Zone targeting" },
    ],
    sunscreen: [
      { name: "Light SPF 50", detail: "Non-greasy" },
    ],
    moisturiser: [
      { name: "Balanced Lotion", detail: "Hydrate + control" },
      { name: "Comfort Gel-Cream", detail: "Flexible wear" },
    ],
  },
};

export default function Recommendations() {
  const [type, setType] = useState<SkinType>("combination");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const t = sessionStorage.getItem("analysis:type") as SkinType | null;
      if (t) setType(t);
    } catch {}
    const id = setTimeout(() => setLoaded(true), 20);
    return () => clearTimeout(id);
  }, []);

  const s = careText[type];
  const p = careProducts[type];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-secondary/35 via-primary/25 to-pink-200/10 mix-blend-soft-light" />
      <div className="w-full max-w-3xl mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-black/45 backdrop-blur-xl shadow-2xl p-6 relative z-10">
        {!loaded && (
          <div className="product-ripple">
            <div className="bubble" style={{ width: 180, height: 180, left: "18%", top: "22%" }} />
            <div className="bubble" style={{ width: 140, height: 140, left: "76%", top: "20%" }} />
            <div className="bubble" style={{ width: 200, height: 200, left: "36%", top: "62%" }} />
          </div>
        )}
        <h1 className="text-3xl font-extrabold text-center mb-2 text-primary text-pop-bright">Skin Care Recommendations</h1>
        <p className="text-center text-sm text-gray-700 dark:text-gray-300 mb-6">
          Tailored to your skin type: <span className="font-semibold capitalize">{type}</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border card-pop bg-gradient-to-br from-green-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 border-green-100 dark:border-emerald-800 pop-in">
            <div className="text-xl font-bold mb-1">Toner</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{s.toner}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.toner.map((it, i) => (
                <div key={`to-${i}`} className="rounded-lg border bg-white/70 dark:bg-white/10 dark:text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{it.detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border card-pop bg-gradient-to-br from-green-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 border-green-100 dark:border-emerald-800 pop-in" style={{ animationDelay: "60ms" }}>
            <div className="text-xl font-bold mb-1">Cleanser</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{s.cleanser}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.cleanser.map((it, i) => (
                <div key={`cl-${i}`} className="rounded-lg border bg-white/70 dark:bg-white/10 dark:text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{it.detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border card-pop bg-gradient-to-br from-green-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 border-green-100 dark:border-emerald-800 pop-in" style={{ animationDelay: "120ms" }}>
            <div className="text-xl font-bold mb-1">Facewash</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{s.facewash}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.facewash.map((it, i) => (
                <div key={`fw-${i}`} className="rounded-lg border bg-white/70 dark:bg-white/10 dark:text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{it.detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border card-pop bg-gradient-to-br from-green-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 border-green-100 dark:border-emerald-800 pop-in" style={{ animationDelay: "180ms" }}>
            <div className="text-xl font-bold mb-1">Facepacks</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{s.facepacks}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.facepacks.map((it, i) => (
                <div key={`fp-${i}`} className="rounded-lg border bg-white/70 dark:bg-white/10 dark:text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{it.detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border card-pop bg-gradient-to-br from-green-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 border-green-100 dark:border-emerald-800 pop-in" style={{ animationDelay: "240ms" }}>
            <div className="text-xl font-bold mb-1">Masks</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{s.masks}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.masks.map((it, i) => (
                <div key={`mk-${i}`} className="rounded-lg border bg-white/70 dark:bg-white/10 dark:text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{it.detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border card-pop bg-gradient-to-br from-green-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 border-green-100 dark:border-emerald-800 pop-in" style={{ animationDelay: "300ms" }}>
            <div className="text-xl font-bold mb-1">Sunscreen</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{s.sunscreen}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.sunscreen.map((it, i) => (
                <div key={`sc-${i}`} className="rounded-lg border bg-white/70 dark:bg-white/10 dark:text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{it.detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border card-pop bg-gradient-to-br from-green-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 border-green-100 dark:border-emerald-800 pop-in" style={{ animationDelay: "360ms" }}>
            <div className="text-xl font-bold mb-1">Moisturiser</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{s.moisturiser}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.moisturiser.map((it, i) => (
                <div key={`ms-${i}`} className="rounded-lg border bg-white/70 dark:bg-white/10 dark:text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{it.detail}</div>
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
