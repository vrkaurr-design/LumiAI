 "use client";
 import { useMemo, useState } from "react";
 
 type BodyShape = "apple" | "pear" | "rectangle" | "hourglass" | "inverted";
 type FitPref = "relaxed" | "tailored" | "streetwear";
 
 export default function StyleAdvisor() {
   const [unit, setUnit] = useState<"cm" | "ft">("cm");
   const [heightCm, setHeightCm] = useState<number | null>(null);
   const [heightFt, setHeightFt] = useState<{ ft: number | ""; in: number | "" }>({ ft: "", in: "" });
   const [shape, setShape] = useState<BodyShape | null>(null);
   const [fit, setFit] = useState<FitPref | null>(null);
   const [waist, setWaist] = useState<number | "">("");
   const [hips, setHips] = useState<number | "">("");
   const [chest, setChest] = useState<number | "">("");
   const [done, setDone] = useState(false);
 
   const heightValueCm = useMemo(() => {
     if (unit === "cm") return typeof heightCm === "number" ? heightCm : null;
     const ft = typeof heightFt.ft === "number" ? heightFt.ft : 0;
     const inch = typeof heightFt.in === "number" ? heightFt.in : 0;
     const totalIn = ft * 12 + inch;
     return totalIn > 0 ? Math.round(totalIn * 2.54) : null;
   }, [unit, heightCm, heightFt]);
 
   const submit = (e: React.FormEvent) => {
     e.preventDefault();
     try {
       if (heightValueCm) sessionStorage.setItem("style:heightCm", String(heightValueCm));
       if (shape) sessionStorage.setItem("style:shape", shape);
       if (fit) sessionStorage.setItem("style:fit", fit);
       if (waist !== "") sessionStorage.setItem("style:waist", String(waist));
       if (hips !== "") sessionStorage.setItem("style:hips", String(hips));
       if (chest !== "") sessionStorage.setItem("style:chest", String(chest));
     } catch {}
     setDone(true);
   };
 
   const rec = useMemo(() => {
     const tips: string[] = [];
     const items: string[] = [];
     const h = heightValueCm || 0;
     if (h > 0 && h < 160) {
       tips.push("Use vertical lines and high‑rise silhouettes to elongate.");
       items.push("High‑waisted trousers", "Cropped jacket", "Monochrome sets", "Pointed shoes");
     } else if (h >= 160 && h <= 175) {
       tips.push("Balanced proportions with mid‑rise and tailored layers.");
       items.push("Straight‑leg trousers", "Buttoned shirt", "Trench coat", "Clean sneakers");
     } else if (h > 175) {
       tips.push("Leverage longlines; avoid overly cropped tops unless layered.");
       items.push("Longline coat", "Wide‑leg pants", "Chunky boots", "Layered overshirt");
     }
     if (shape === "apple") {
       tips.push("Define the torso with structure and V‑necklines.");
       items.push("Structured blazer", "Straight‑leg pants", "V‑neck knit", "Shift dress");
     }
     if (shape === "pear") {
       tips.push("Balance hips with volume up top and A‑line bottoms.");
       items.push("Fit‑and‑flare dress", "A‑line skirt", "Statement top", "Dark denim");
     }
     if (shape === "rectangle") {
       tips.push("Create waist with belts, peplum, and layered textures.");
       items.push("Belted jacket", "Peplum top", "Tapered trousers", "Layered cardigan");
     }
     if (shape === "hourglass") {
       tips.push("Follow natural lines with wrap silhouettes and high‑rise fits.");
       items.push("Wrap dress", "Tailored blazer", "High‑rise jeans", "Midi skirt");
     }
     if (shape === "inverted") {
       tips.push("Soften shoulders, add volume below to balance.");
       items.push("A‑line skirt", "Bootcut jeans", "Scoop‑neck tee", "Soft cardigan");
     }
     if (fit === "relaxed") {
       tips.push("Prefer drape and ease; size up selectively.");
     }
     if (fit === "tailored") {
       tips.push("Crisp seams and defined shoulders for polished lines.");
     }
     if (fit === "streetwear") {
       tips.push("Play with oversized tops and grounded bottoms.");
     }
     const uniqueItems = Array.from(new Set(items));
     return { tips, items: uniqueItems };
   }, [heightValueCm, shape, fit]);
 
   return (
     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
       <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-secondary/35 via-primary/25 to-pink-200/10 mix-blend-soft-light" />
       <div className="w-full max-w-3xl mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/85 dark:bg-black/50 backdrop-blur-xl shadow-2xl p-6 relative z-10">
         <h1 className="text-3xl font-extrabold text-center mb-2 text-primary text-pop-bright">Gen AI Style Advisor</h1>
         <p className="text-center text-sm text-gray-700 dark:text-gray-300 mb-6">
           Provide height and body details to personalize clothing recommendations.
         </p>
         {!done ? (
           <form className="space-y-6" onSubmit={submit}>
             <div>
               <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Height</div>
               <div className="flex items-center gap-2 mb-3">
                 <button type="button" onClick={() => setUnit("cm")} className={`px-3 py-1.5 rounded-md border text-sm font-semibold ${unit === "cm" ? "bg-secondary text-white border-secondary" : "bg-white/70 dark:bg-white/10 text-dark dark:text-white"}`}>cm</button>
                 <button type="button" onClick={() => setUnit("ft")} className={`px-3 py-1.5 rounded-md border text-sm font-semibold ${unit === "ft" ? "bg-secondary text-white border-secondary" : "bg-white/70 dark:bg-white/10 text-dark dark:text-white"}`}>ft/in</button>
               </div>
               {unit === "cm" ? (
                 <input
                   type="number"
                   min={120}
                   max={220}
                   value={heightCm ?? ""}
                   onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : null)}
                   placeholder="e.g., 170"
                   className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white"
                 />
               ) : (
                 <div className="grid grid-cols-2 gap-2">
                   <input
                     type="number"
                     min={4}
                     max={7}
                     value={heightFt.ft === "" ? "" : heightFt.ft}
                     onChange={(e) => setHeightFt((s) => ({ ...s, ft: e.target.value === "" ? "" : Number(e.target.value) }))}
                     placeholder="ft"
                     className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white"
                   />
                   <input
                     type="number"
                     min={0}
                     max={11}
                     value={heightFt.in === "" ? "" : heightFt.in}
                     onChange={(e) => setHeightFt((s) => ({ ...s, in: e.target.value === "" ? "" : Number(e.target.value) }))}
                     placeholder="in"
                     className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white"
                   />
                 </div>
               )}
             </div>
 
             <div>
               <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Body Shape</div>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                 {(["apple", "pear", "rectangle", "hourglass", "inverted"] as BodyShape[]).map((s) => (
                   <button
                     key={s}
                     type="button"
                     onClick={() => setShape(s)}
                     className={`px-3 py-2 rounded-lg text-sm font-semibold border ${shape === s ? "bg-secondary text-white border-secondary" : "bg-white/70 dark:bg-white/10 text-dark dark:text-white"}`}
                   >
                     {s[0].toUpperCase() + s.slice(1)}
                   </button>
                 ))}
               </div>
             </div>
 
             <div>
               <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Fit Preference</div>
               <div className="grid grid-cols-3 gap-2">
                 {(["relaxed", "tailored", "streetwear"] as FitPref[]).map((f) => (
                   <button
                     key={f}
                     type="button"
                     onClick={() => setFit(f)}
                     className={`px-3 py-2 rounded-lg text-sm font-semibold border ${fit === f ? "bg-primary text-white border-primary" : "bg-white/70 dark:bg-white/10 text-dark dark:text-white"}`}
                   >
                     {f[0].toUpperCase() + f.slice(1)}
                   </button>
                 ))}
               </div>
             </div>
 
             <div>
               <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Measurements (optional)</div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                 <input
                   type="number"
                   min={50}
                   max={140}
                   value={waist}
                   onChange={(e) => setWaist(e.target.value === "" ? "" : Number(e.target.value))}
                   placeholder="Waist (cm)"
                   className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white"
                 />
                 <input
                   type="number"
                   min={70}
                   max={150}
                   value={hips}
                   onChange={(e) => setHips(e.target.value === "" ? "" : Number(e.target.value))}
                   placeholder="Hips (cm)"
                   className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white"
                 />
                 <input
                   type="number"
                   min={70}
                   max={140}
                   value={chest}
                   onChange={(e) => setChest(e.target.value === "" ? "" : Number(e.target.value))}
                   placeholder="Chest/Bust (cm)"
                   className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white"
                 />
               </div>
             </div>
 
            <button type="submit" className="w-full mt-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-primary text-white font-semibold shadow-md shine-sweep">
               Get Clothing Style Recommendations
             </button>
           </form>
         ) : (
          <div className="space-y-5">
            <div className="rounded-xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-fuchsia-900/30 dark:to-pink-900/30 border border-purple-100 dark:border-fuchsia-800 tilt-hover">
               <div className="flex items-start gap-3">
                 <div className="w-10 h-10 rounded-lg bg-accent/40 flex items-center justify-center text-2xl">✨</div>
                 <div className="flex-1">
                   <div className="font-bold text-dark dark:text-white">Personalized Tips</div>
                   <ul className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                     {rec.tips.length > 0 ? rec.tips.map((t, i) => <li key={i}>• {t}</li>) : <li>• Add details above for more tailored advice.</li>}
                   </ul>
                 </div>
               </div>
             </div>
            <div className="rounded-xl p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-green-100 dark:border-emerald-800 tilt-hover">
               <div className="flex items-start gap-3">
                 <div className="w-10 h-10 rounded-lg bg-secondary/40 flex items-center justify-center text-2xl">🧥</div>
                 <div className="flex-1">
                   <div className="font-bold text-dark dark:text-white">Suggested Pieces</div>
                   <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                     {rec.items.length > 0 ? rec.items.map((it) => (
                       <div key={it} className="px-3 py-2 rounded-md bg-white/70 dark:bg-white/10 text-gray-800 dark:text-gray-200 border border-white/30 dark:border-white/10 text-sm font-semibold">
                         {it}
                       </div>
                     )) : (
                       <div className="px-3 py-2 rounded-md bg-white/70 dark:bg-white/10 text-gray-800 dark:text-gray-200 border border-white/30 dark:border-white/10 text-sm font-semibold">
                         Add height and shape to see items.
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             </div>
             <div className="text-center">
               <button
                 onClick={() => setDone(false)}
                 className="px-4 py-2.5 rounded-lg bg-dark dark:bg-white text-white dark:text-dark text-sm font-semibold hover:opacity-90 transition-opacity"
               >
                 Edit Details
               </button>
             </div>
           </div>
         )}
       </div>
     </div>
   );
 }
