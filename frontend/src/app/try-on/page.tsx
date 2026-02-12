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

function svgThumb(kind: string, tone: "warm" | "cool" | "neutral") {
  const bg =
    tone === "warm" ? "#F9E3D0" : tone === "cool" ? "#E5E7F7" : "#EFE9E4";
  const fg =
    kind === "foundation"
      ? tone === "warm"
        ? "#D8B074"
        : tone === "cool"
        ? "#D4C7D9"
        : "#D7C2AE"
      : kind === "concealer"
      ? tone === "warm"
        ? "#FFC099"
        : tone === "cool"
        ? "#E6DCEB"
        : "#EAD7C8"
      : kind === "corrector"
      ? tone === "warm"
        ? "#FF9A6E"
        : tone === "cool"
        ? "#F5B8C8"
        : "#F1BFA9"
      : kind === "lipstick"
      ? tone === "warm"
        ? "#C7362E"
        : tone === "cool"
        ? "#8A3B6E"
        : "#B94A4A"
      : kind === "fixer"
      ? tone === "warm"
        ? "#9EC7D4"
        : tone === "cool"
        ? "#7FA9C7"
        : "#92B7C4"
      : tone === "warm"
      ? "#8C6239"
      : tone === "cool"
      ? "#7A6D6A"
      : "#8B6F5A";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="0" y="0" width="64" height="64" rx="12" fill="${bg}"/><g><rect x="22" y="12" width="20" height="36" rx="8" fill="${fg}"/><rect x="24" y="8" width="16" height="6" rx="3" fill="#333" opacity="0.25"/></g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

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
  const palette: Record<"warm" | "cool" | "neutral", { label: string; color: string }[]> = {
    warm: [
      { label: "Golden Beige", color: "#D8B074" },
      { label: "Honey", color: "#C78B4E" },
      { label: "Coral", color: "#FF7F6E" },
      { label: "Peach", color: "#FFC099" },
      { label: "Warm Red", color: "#C7362E" },
      { label: "Bronze", color: "#8C6239" },
    ],
    cool: [
      { label: "Porcelain", color: "#E9D8CF" },
      { label: "Cool Ivory", color: "#E6DCEB" },
      { label: "Berry", color: "#8A3B6E" },
      { label: "Rose", color: "#E58CA6" },
      { label: "Blue‑Red", color: "#A1102D" },
      { label: "Ash Brown", color: "#7A6D6A" },
    ],
    neutral: [
      { label: "Neutral Beige", color: "#D7C2AE" },
      { label: "Nude", color: "#E3D0C5" },
      { label: "Mauve", color: "#B58AA5" },
      { label: "Balanced Red", color: "#B94A4A" },
      { label: "Soft Tan", color: "#C29977" },
      { label: "Balanced Brown", color: "#8B6F5A" },
    ],
  };

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
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-indigo-900/25 via-slate-800/20 to-indigo-700/15" />
      <div className="w-full mx-auto rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl p-6 relative z-10">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-white">Virtual Try‑On Studio</h1>
        <p className="text-center text-sm text-gray-300 mb-6">
          Undertone detected: <span className="font-semibold capitalize text-white">{tone}</span>
        </p>
        <div className="mb-6">
          <div className="text-sm font-semibold mb-2 text-gray-200 text-center">Shade Match Palette</div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {palette[tone].map((sw, i) => (
              <div key={`sw-${i}`} className="flex flex-col items-center">
                <div className="pulse-hover w-12 h-12 rounded-md border border-white/10 shadow-sm" style={{ backgroundColor: sw.color }} />
                <div className="mt-1 text-[10px] text-gray-300">{sw.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border bg-white/10 border-white/20">
            <div className="text-xl font-bold mb-1 text-white">Foundations</div>
            <div className="text-sm text-gray-300">{s.foundation}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.foundations.map((it, i) => (
                <div key={`fd-${i}`} className="rounded-lg border bg-white/5 border-white/20 text-white px-3 py-2">
                  <div className="flex items-center gap-2">
                    <img src={svgThumb("foundation", tone)} alt="Foundation" className="w-10 h-10 rounded-md border border-white/10" />
                    <div>
                      <div className="text-sm font-semibold">{it.name}</div>
                      <div className="text-xs text-gray-300">{it.shade}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-white/10 border-white/20" style={{ animationDelay: "60ms" }}>
            <div className="text-xl font-bold mb-1 text-white">Concealer</div>
            <div className="text-sm text-gray-300">{s.concealer}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.concealer.map((it, i) => (
                <div key={`cn-${i}`} className="rounded-lg border bg-white/5 border-white/20 text-white px-3 py-2">
                  <div className="flex items-center gap-2">
                    <img src={svgThumb("concealer", tone)} alt="Concealer" className="w-10 h-10 rounded-md border border-white/10" />
                    <div>
                      <div className="text-sm font-semibold">{it.name}</div>
                      <div className="text-xs text-gray-300">{it.shade}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-white/10 border-white/20" style={{ animationDelay: "120ms" }}>
            <div className="text-xl font-bold mb-1 text-white">Colour Corrector</div>
            <div className="text-sm text-gray-300">{s.corrector}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.corrector.map((it, i) => (
                <div key={`cc-${i}`} className="rounded-lg border bg-white/5 border-white/20 text-white px-3 py-2">
                  <div className="flex items-center gap-2">
                    <img src={svgThumb("corrector", tone)} alt="Corrector" className="w-10 h-10 rounded-md border border-white/10" />
                    <div>
                      <div className="text-sm font-semibold">{it.name}</div>
                      <div className="text-xs text-gray-300">{it.shade}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-white/10 border-white/20" style={{ animationDelay: "180ms" }}>
            <div className="text-xl font-bold mb-1 text-white">Lipsticks</div>
            <div className="text-sm text-gray-300">{s.lipstick}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.lipstick.map((it, i) => (
                <div key={`lp-${i}`} className="rounded-lg border bg-white/5 border-white/20 text-white px-3 py-2">
                  <div className="flex items-center gap-2">
                    <img src={svgThumb("lipstick", tone)} alt="Lipstick" className="w-10 h-10 rounded-md border border-white/10" />
                    <div>
                      <div className="text-sm font-semibold">{it.name}</div>
                      <div className="text-xs text-gray-300">{it.shade}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-white/10 border-white/20" style={{ animationDelay: "240ms" }}>
            <div className="text-xl font-bold mb-1 text-white">Makeup Fixer</div>
            <div className="text-sm text-gray-300">{s.fixer}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.fixer.map((it, i) => (
                <div key={`fx-${i}`} className="rounded-lg border bg-white/5 border-white/20 text-white px-3 py-2">
                  <div className="flex items-center gap-2">
                    <img src={svgThumb("fixer", tone)} alt="Fixer" className="w-10 h-10 rounded-md border border-white/10" />
                    <div>
                      <div className="text-sm font-semibold">{it.name}</div>
                      <div className="text-xs text-gray-300">{it.shade}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-white/10 border-white/20" style={{ animationDelay: "300ms" }}>
            <div className="text-xl font-bold mb-1 text-white">Contour</div>
            <div className="text-sm text-gray-300">{s.contour}</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.contour.map((it, i) => (
                <div key={`ct-${i}`} className="rounded-lg border bg-white/5 border-white/20 text-white px-3 py-2">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-gray-300">{it.shade}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <a href="/skin-analysis" className="px-5 py-2 rounded-lg bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors">
            Back to Analysis
          </a>
        </div>
      </div>
    </div>
  );
}
