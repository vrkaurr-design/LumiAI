 "use client";
 import { useEffect, useMemo, useState } from "react";
 import Reveal from "@/components/common/Reveal";
 import ProductCard from "@/components/common/ProductCard";
 
 type SkinType = "dry" | "oily" | "combination";
 type Tone = "warm" | "cool" | "neutral";
 type Category = "makeup" | "skincare";
 
 type CatalogItem = {
   id: string;
   name: string;
   category: Category;
   type: string;
   detail: string;
   price: number;
   currency?: "₹" | "$" | "€";
   shade?: Tone;
   skinType?: SkinType;
   badge?: "new" | "bestseller";
   stock?: number;
   ratingAvg?: number;
   ratingCount?: number;
 };
 
 const catalog: CatalogItem[] = [
   { id: "mk-lip-w1", name: "Aura Lipstick", category: "makeup", type: "lipstick", shade: "warm", detail: "Long‑wear satin finish", price: 799, badge: "bestseller", stock: 42, ratingAvg: 4.6, ratingCount: 318 },
   { id: "mk-lip-c1", name: "Aura Lipstick", category: "makeup", type: "lipstick", shade: "cool", detail: "Long‑wear satin finish", price: 799, stock: 35, ratingAvg: 4.5, ratingCount: 256 },
   { id: "mk-lip-n1", name: "Aura Lipstick", category: "makeup", type: "lipstick", shade: "neutral", detail: "Long‑wear satin finish", price: 799, stock: 28, ratingAvg: 4.4, ratingCount: 201 },
   { id: "mk-fnd-w1", name: "Silk Foundation", category: "makeup", type: "foundation", shade: "warm", detail: "Medium coverage, skin‑like", price: 1299, badge: "new", stock: 18, ratingAvg: 4.2, ratingCount: 97 },
   { id: "mk-fnd-c1", name: "Silk Foundation", category: "makeup", type: "foundation", shade: "cool", detail: "Medium coverage, skin‑like", price: 1299, stock: 22, ratingAvg: 4.1, ratingCount: 83 },
   { id: "mk-fnd-n1", name: "Silk Foundation", category: "makeup", type: "foundation", shade: "neutral", detail: "Medium coverage, skin‑like", price: 1299, stock: 25, ratingAvg: 4.0, ratingCount: 76 },
   { id: "sk-ton-d1", name: "Hydra Toner", category: "skincare", type: "toner", skinType: "dry", detail: "2% HA + B5 hydration", price: 699, badge: "bestseller", stock: 64, ratingAvg: 4.7, ratingCount: 412 },
   { id: "sk-ton-o1", name: "Balance Toner", category: "skincare", type: "toner", skinType: "oily", detail: "2% BHA clarity", price: 699, stock: 59, ratingAvg: 4.6, ratingCount: 368 },
   { id: "sk-ton-cm1", name: "pH Toner", category: "skincare", type: "toner", skinType: "combination", detail: "Gentle, daily balance", price: 699, stock: 48, ratingAvg: 4.5, ratingCount: 295 },
   { id: "sk-cln-d1", name: "Cream Cleanser", category: "skincare", type: "cleanser", skinType: "dry", detail: "Non‑stripping comfort", price: 599, stock: 40, ratingAvg: 4.3, ratingCount: 187 },
   { id: "sk-cln-o1", name: "Gel Cleanser", category: "skincare", type: "cleanser", skinType: "oily", detail: "Oil‑control freshness", price: 599, stock: 44, ratingAvg: 4.4, ratingCount: 203 },
   { id: "sk-cln-cm1", name: "Gentle Cleanser", category: "skincare", type: "cleanser", skinType: "combination", detail: "Daily pure cleanse", price: 599, stock: 46, ratingAvg: 4.3, ratingCount: 176 },
   { id: "sk-spf-d1", name: "Dewy SPF 50", category: "skincare", type: "sunscreen", skinType: "dry", detail: "Moisturizing finish", price: 899, stock: 53, ratingAvg: 4.5, ratingCount: 221 },
   { id: "sk-spf-o1", name: "Matte SPF 50", category: "skincare", type: "sunscreen", skinType: "oily", detail: "Shine‑free wear", price: 899, stock: 57, ratingAvg: 4.6, ratingCount: 239 },
   { id: "sk-spf-cm1", name: "Light SPF 50", category: "skincare", type: "sunscreen", skinType: "combination", detail: "Balanced protection", price: 899, stock: 49, ratingAvg: 4.5, ratingCount: 198 },
  { id: "sk-fw-d1", name: "Soft Foam", category: "skincare", type: "facewash", skinType: "dry", detail: "Sulphate‑free comfort", price: 549, stock: 61, ratingAvg: 4.2, ratingCount: 144 },
   { id: "sk-fw-o1", name: "Foam Fresh", category: "skincare", type: "facewash", skinType: "oily", detail: "Non‑comedogenic cleanse", price: 549, stock: 66, ratingAvg: 4.3, ratingCount: 162 },
   { id: "sk-fw-cm1", name: "Mild Wash", category: "skincare", type: "facewash", skinType: "combination", detail: "Comfort daily cleanse", price: 549, stock: 63, ratingAvg: 4.2, ratingCount: 151 },
   { id: "sk-pack-d1", name: "Nourish Pack", category: "skincare", type: "facepacks", skinType: "dry", detail: "Argan & Shea rich", price: 799, stock: 38, ratingAvg: 4.4, ratingCount: 127 },
   { id: "sk-pack-o1", name: "Clay Pack", category: "skincare", type: "facepacks", skinType: "oily", detail: "Kaolin + Zinc", price: 799, stock: 41, ratingAvg: 4.5, ratingCount: 139 },
   { id: "sk-pack-cm1", name: "Zone Care Pack", category: "skincare", type: "facepacks", skinType: "combination", detail: "Hydrate cheeks; clay T‑zone", price: 799, stock: 36, ratingAvg: 4.3, ratingCount: 118 },
   { id: "sk-mask-d1", name: "Hydra Sheet", category: "skincare", type: "masks", skinType: "dry", detail: "HA + Aloe plump", price: 699, stock: 52, ratingAvg: 4.4, ratingCount: 174 },
   { id: "sk-mask-o1", name: "Charcoal Detox", category: "skincare", type: "masks", skinType: "oily", detail: "Weekly detox", price: 699, stock: 55, ratingAvg: 4.5, ratingCount: 186 },
   { id: "sk-mask-cm1", name: "Multi‑Mask", category: "skincare", type: "masks", skinType: "combination", detail: "Zone targeting", price: 699, stock: 50, ratingAvg: 4.3, ratingCount: 159 },
   { id: "sk-ms-d1", name: "Rich Cream", category: "skincare", type: "moisturiser", skinType: "dry", detail: "Ceramides + Lipids", price: 999, stock: 47, ratingAvg: 4.6, ratingCount: 208 },
   { id: "sk-ms-o1", name: "Oil‑Free Gel", category: "skincare", type: "moisturiser", skinType: "oily", detail: "Lightweight hydration", price: 999, stock: 51, ratingAvg: 4.5, ratingCount: 193 },
   { id: "sk-ms-cm1", name: "Balanced Lotion", category: "skincare", type: "moisturiser", skinType: "combination", detail: "Hydrate + control", price: 999, stock: 49, ratingAvg: 4.4, ratingCount: 182 },
 ];
 
 export default function Shop() {
   const [q, setQ] = useState("");
   const [cat, setCat] = useState<Category | "all">("all");
   const [type, setType] = useState<string | "all">("all");
   const [tone, setTone] = useState<Tone | "all">("all");
   const [skin, setSkin] = useState<SkinType | "all">("all");
   const [minP, setMinP] = useState<number | "">("");
   const [maxP, setMaxP] = useState<number | "">("");
 
   useEffect(() => {
     try {
       const aType = sessionStorage.getItem("analysis:type") as SkinType | null;
       const aTone = sessionStorage.getItem("analysis:tone") as Tone | null;
       if (aType) setSkin(aType);
       if (aTone) setTone(aTone);
     } catch {}
   }, []);
 
   const filtered = useMemo(() => {
     return catalog.filter((p) => {
       if (q && !`${p.name} ${p.type} ${p.detail}`.toLowerCase().includes(q.toLowerCase())) return false;
       if (cat !== "all" && p.category !== cat) return false;
       if (type !== "all" && p.type !== type) return false;
       if (tone !== "all" && p.shade !== tone) return false;
       if (skin !== "all" && p.skinType !== skin) return false;
       if (typeof minP === "number" && p.price < minP) return false;
       if (typeof maxP === "number" && p.price > maxP) return false;
       return true;
     });
   }, [q, cat, type, tone, skin, minP, maxP]);
 
   return (
     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
       <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-white via-gray-50 to-gray-100" />
       <Reveal className="w-full mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-black/45 backdrop-blur-xl shadow-2xl p-6 relative z-10" variant="fade">
         <Reveal as="h1" className="text-3xl font-extrabold text-center mb-2 text-primary text-pop-bright">
           Shop Perfect Corp Products
         </Reveal>
         <Reveal className="text-center text-sm text-gray-700 dark:text-gray-300 mb-6" delay={40}>
           Browse by skin type, undertone, and category. Prices shown in ₹.
         </Reveal>
 
         <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
           <input
             value={q}
             onChange={(e) => setQ(e.target.value)}
             placeholder="Search products"
             className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white shine-sweep"
           />
           <div className="grid grid-cols-3 gap-2">
             <select value={cat} onChange={(e) => setCat(e.target.value as any)} className="rounded-md px-3 py-2 bg-white/80 dark:bg-white/10 shine-sweep">
               <option value="all">All</option>
               <option value="makeup">Makeup</option>
               <option value="skincare">Skincare</option>
             </select>
             <select value={type} onChange={(e) => setType(e.target.value as any)} className="rounded-md px-3 py-2 bg-white/80 dark:bg-white/10 shine-sweep">
               <option value="all">Type</option>
               <option value="lipstick">Lipstick</option>
               <option value="foundation">Foundation</option>
               <option value="toner">Toner</option>
               <option value="cleanser">Cleanser</option>
               <option value="sunscreen">Sunscreen</option>
               <option value="facewash">Facewash</option>
               <option value="facepacks">Facepacks</option>
               <option value="masks">Masks</option>
               <option value="moisturiser">Moisturiser</option>
             </select>
             <select value={tone} onChange={(e) => setTone(e.target.value as any)} className="rounded-md px-3 py-2 bg-white/80 dark:bg-white/10 shine-sweep">
               <option value="all">Undertone</option>
               <option value="warm">Warm</option>
               <option value="cool">Cool</option>
               <option value="neutral">Neutral</option>
             </select>
           </div>
           <div className="grid grid-cols-3 gap-2">
             <select value={skin} onChange={(e) => setSkin(e.target.value as any)} className="rounded-md px-3 py-2 bg-white/80 dark:bg-white/10 shine-sweep">
               <option value="all">Skin Type</option>
               <option value="dry">Dry</option>
               <option value="oily">Oily</option>
               <option value="combination">Combination</option>
             </select>
             <input
               type="number"
               value={minP === "" ? "" : minP}
               onChange={(e) => setMinP(e.target.value === "" ? "" : Number(e.target.value))}
               placeholder="Min ₹"
               className="rounded-md px-3 py-2 bg-white/80 dark:bg-white/10 shine-sweep"
             />
             <input
               type="number"
               value={maxP === "" ? "" : maxP}
               onChange={(e) => setMaxP(e.target.value === "" ? "" : Number(e.target.value))}
               placeholder="Max ₹"
               className="rounded-md px-3 py-2 bg-white/80 dark:bg-white/10 shine-sweep"
             />
           </div>
         </div>
 
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
           {filtered.map((p, i) => (
             <ProductCard key={p.id} product={p as any} delay={i * 30} />
           ))}
           {filtered.length === 0 && (
             <Reveal className="col-span-full text-center text-sm text-gray-700 dark:text-gray-300" delay={40}>
               No products match your filters.
             </Reveal>
           )}
         </div>
       </Reveal>
     </div>
   );
 }
