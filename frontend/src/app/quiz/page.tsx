 "use client";
 import { useRouter } from "next/navigation";
 import { useState } from "react";
 import Reveal from "@/components/common/Reveal";
 
 type SkinType = "dry" | "oily" | "combination";
 
 export default function Quiz() {
   const router = useRouter();
   const [type, setType] = useState<SkinType | null>(null);
   const [concerns, setConcerns] = useState<string[]>([]);
   const [wear, setWear] = useState<string | null>(null);
   const [undertone, setUndertone] = useState<"warm" | "cool" | "neutral" | null>(null);
  const [needAuth, setNeedAuth] = useState(false);
 
   const toggleConcern = (c: string) => {
     setConcerns((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
   };
 
   const submit = (e: React.FormEvent) => {
     e.preventDefault();
     try {
       if (type) sessionStorage.setItem("quiz:type", type);
       if (wear) sessionStorage.setItem("quiz:wear", wear);
       if (undertone) sessionStorage.setItem("quiz:undertone", undertone);
       sessionStorage.setItem("quiz:concerns", JSON.stringify(concerns));
      const authed = sessionStorage.getItem("auth:loggedIn");
      if (!authed) {
        sessionStorage.setItem("auth:next", "/try-on");
        setNeedAuth(true);
        router.push("/login");
        return;
      }
    } catch {}
    router.push("/try-on");
   };
 
   return (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
      <Reveal className="w-full max-w-2xl mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-black/45 backdrop-blur-xl shadow-2xl p-6 relative z-10">
        <Reveal as="h1" className="text-3xl font-extrabold text-center mb-2 text-primary text-pop-bright" variant="fade">
          Quick Style Quiz
        </Reveal>
        <Reveal className="text-center text-sm text-gray-700 dark:text-gray-300 mb-6" delay={60}>
          Answer a few quick questions to tailor your virtual try-on experience.
        </Reveal>
         <form className="space-y-5" onSubmit={submit}>
           {needAuth && (
             <div className="rounded-md bg-white/70 dark:bg-white/10 border border-white/30 dark:border-white/10 p-3 text-sm text-gray-700 dark:text-gray-300">
               Please sign up to continue to Virtual Try‑On.
             </div>
           )}
           <div>
             <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Your Skin Type</div>
             <div className="grid grid-cols-3 gap-2">
               {(["dry", "oily", "combination"] as SkinType[]).map((t) => (
                 <button
                   key={t}
                   type="button"
                   onClick={() => setType(t)}
                   className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                     type === t ? "bg-secondary text-white border-secondary" : "bg-white/70 dark:bg-white/10 text-dark dark:text-white"
                   }`}
                 >
                   {t[0].toUpperCase() + t.slice(1)}
                 </button>
               ))}
             </div>
           </div>
 
           <div>
             <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Primary Concerns</div>
             <div className="grid grid-cols-2 gap-2">
               {["Uneven tone", "Redness", "Texture", "Acne", "Dark circles", "Dryness"].map((c) => (
                 <button
                   key={c}
                   type="button"
                   onClick={() => toggleConcern(c)}
                   className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                     concerns.includes(c) ? "bg-primary text-white border-primary" : "bg-white/70 dark:bg_white/10 text-dark dark:text-white"
                   }`}
                 >
                   {c}
                 </button>
               ))}
             </div>
           </div>
 
           <div>
             <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Preferred Daily Wear</div>
             <div className="grid grid-cols-3 gap-2">
               {["Natural", "Soft‑matte", "Dewy"].map((w) => (
                 <button
                   key={w}
                   type="button"
                   onClick={() => setWear(w)}
                   className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                     wear === w ? "bg-secondary text-white border-secondary" : "bg-white/70 dark:bg_white/10 text-dark dark:text-white"
                   }`}
                 >
                   {w}
                 </button>
               ))}
             </div>
           </div>
 
           <div>
             <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Undertone (self‑assessment)</div>
             <div className="grid grid-cols-3 gap-2">
               {(["warm", "cool", "neutral"] as const).map((u) => (
                 <button
                   key={u}
                   type="button"
                   onClick={() => setUndertone(u)}
                   className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                     undertone === u ? "bg-secondary text-white border-secondary" : "bg-white/70 dark:bg_white/10 text-dark dark:text-white"
                   }`}
                 >
                   {u[0].toUpperCase() + u.slice(1)}
                 </button>
               ))}
             </div>
           </div>
 
          <Reveal as="div" delay={80}>
            <button type="submit" className="w-full mt-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-md">
              Continue to Try‑On
            </button>
          </Reveal>
         </form>
      </Reveal>
     </div>
   );
 }
