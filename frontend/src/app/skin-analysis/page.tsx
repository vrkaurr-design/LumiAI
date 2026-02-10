"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type ToneResult = {
  tone: "warm" | "cool" | "neutral";
  description: string;
  rgb: { r: number; g: number; b: number };
};

type SkinType = "dry" | "oily" | "combination";

function classifyTone(r: number, g: number, b: number): ToneResult {
  const total = r + g + b || 1;
  const pr = r / total;
  const pg = g / total;
  const pb = b / total;
  let tone: ToneResult["tone"] = "neutral";
  if (pr > pg + 0.03 && pr > pb + 0.03) tone = "warm";
  else if (pb > pr + 0.03 || pg > pr + 0.03) tone = "cool";
  const description =
    tone === "warm"
      ? "Warm undertone with golden/peach hues; foundations with yellow or golden bases suit best."
      : tone === "cool"
      ? "Cool undertone with pink/rosy hues; foundations with neutral/rosy bases suit best."
      : "Neutral undertone balanced between warm and cool; versatile across most shade families.";
  return { tone, description, rgb: { r, g, b } };
}

function classifySkinType(brightnessValues: number[]): SkinType {
  const n = brightnessValues.length || 1;
  const mean = brightnessValues.reduce((a, v) => a + v, 0) / n;
  const variance =
    brightnessValues.reduce((a, v) => a + (v - mean) * (v - mean), 0) / n;
  if (variance > 800) return "oily";
  if (variance < 300) return "dry";
  return "combination";
}

export default function SkinAnalysis() {
  const [result, setResult] = useState<ToneResult | null>(null);
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    try {
      const src = sessionStorage.getItem("analysis:image");
      if (src) {
        setImgSrc(src);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const size = 64;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, size, size);
          const data = ctx.getImageData(0, 0, size, size).data;
          let r = 0, g = 0, b = 0, count = 0;
          const br: number[] = [];
          for (let i = 0; i < data.length; i += 4) {
            const rr = data[i], gg = data[i + 1], bb = data[i + 2];
            const alpha = data[i + 3] / 255;
            if (alpha < 0.99) continue;
            r += rr; g += gg; b += bb; count++;
            br.push(0.2126 * rr + 0.7152 * gg + 0.0722 * bb);
          }
          if (count > 0) {
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            const tone = classifyTone(r, g, b);
            setResult(tone);
            const type = classifySkinType(br);
            setSkinType(type);
            try {
              sessionStorage.setItem("analysis:tone", tone.tone);
              sessionStorage.setItem("analysis:type", type);
            } catch {}
          }
        };
        img.src = src;
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-secondary/35 via-primary/25 to-pink-200/10 mix-blend-soft-light" />
      <div className="w-full max-w-2xl mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/75 dark:bg-black/40 backdrop-blur-xl shadow-xl p-6 relative z-10">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-primary text-pop-bright">AI Skin Analysis</h1>
        <p className="text-center text-sm text-gray-700 dark:text-gray-300 mb-6">
          Based on your selfie, here is a quick undertone summary and next steps.
        </p>

        <div className="rounded-xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-fuchsia-900/30 dark:to-pink-900/30 border border-purple-100 dark:border-fuchsia-800">
          {result ? (
            <div className="flex items-start gap-4">
              {imgSrc && (
                <img src={imgSrc} alt="Analyzed selfie" className="w-20 h-20 rounded-lg object-cover border border-white/40 dark:border-white/10" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-dark text-white dark:bg-white dark:text-dark">
                    {result.tone.toUpperCase()}
                  </span>
                  {skinType && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full text-white ${
                        skinType === "oily"
                          ? "bg-yellow-600"
                          : skinType === "dry"
                          ? "bg-blue-600"
                          : "bg-teal-600"
                      }`}
                    >
                      {skinType.toUpperCase()}
                    </span>
                  )}
                  <span
                    className="inline-block w-6 h-6 rounded-md border border-white/40 dark:border-white/10"
                    style={{ backgroundColor: `rgb(${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b})` }}
                    aria-label="average color swatch"
                  />
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200">{result.description}</p>
                {skinType && (
                  <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                    Detected skin type: <span className="font-semibold capitalize">{skinType}</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-800 dark:text-gray-200">
              Processing your selfie… If this takes long, try resubmitting from Take Selfie.
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/try-on"
            className="group block p-4 rounded-xl border card-pop bg-gradient-to-br from-pink-50 to-purple-50 dark:from-fuchsia-900/40 dark:to-purple-900/40 border-pink-100 dark:border-fuchsia-800 hover:from-pink-200/60 hover:to-purple-200/60 hover:border-purple-300 shadow-xl hover:shadow-2xl transition-all text-center"
          >
            <div className="w-12 h-12 mx-auto bg-primary/30 group-hover:bg-primary/50 rounded-xl flex items-center justify-center mb-2 text-2xl">💄</div>
            <div className="font-bold text-dark dark:text-white">Makeup</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Explore shades matched to your undertone</div>
          </Link>
          <Link
            href="/recommendations"
            className="group block p-4 rounded-xl border card-pop bg-gradient-to-br from-green-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 border-green-100 dark:border-emerald-800 hover:from-green-200/60 hover:to-teal-200/60 hover:border-teal-300 shadow-xl hover:shadow-2xl transition-all text-center"
          >
            <div className="w-12 h-12 mx-auto bg-secondary/30 group-hover:bg-secondary/50 rounded-xl flex items-center justify-center mb-2 text-2xl">🧴</div>
            <div className="font-bold text-dark dark:text-white">Skin Care</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Routine and products tailored to your skin</div>
          </Link>
          <Link
            href="/feedback"
            className="group block p-4 rounded-xl border card-pop bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-indigo-900/40 dark:to-slate-900/40 border-indigo-100 dark:border-indigo-800 hover:from-indigo-200/60 hover:to-slate-200/60 hover:border-indigo-300 shadow-xl hover:shadow-2xl transition-all text-center"
          >
            <div className="w-12 h-12 mx-auto bg-indigo-400/40 group-hover:bg-indigo-500/60 rounded-xl flex items-center justify-center mb-2 text-2xl">💬</div>
            <div className="font-bold text-dark dark:text-white">Share Review</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Leave feedback and connect with our team</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
