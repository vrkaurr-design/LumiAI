 "use client";
import Image from "next/image";
import Link from "next/link";
import FooterPager from "@/components/common/FooterPager";
 import { useUI } from "@/context/UIContext";
 import { useRouter } from "next/navigation";
 import { useState } from "react";

export default function Home() {
   const { openLogin } = useUI();
   const router = useRouter();
   const [modal, setModal] = useState<null | "makeup" | "skin">(null);
   const proceed = () => {
     const target = modal === "makeup" ? "/quiz" : "/take-selfie";
     try {
       const authed = sessionStorage.getItem("auth:loggedIn");
       if (!authed) {
         sessionStorage.setItem("auth:next", target);
         openLogin();
         return;
       }
     } catch {}
     router.push(target);
   };
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] p-4 text-center">
      <div className="max-w-5xl mx-auto space-y-8 mt-16">
        <h1 className={`font-semibold whitespace-nowrap text-4xl sm:text-5xl md:text-7xl tracking-tight leading-tight bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent text-shadow-under`}>
          Future of Beauty Tech
        </h1>
        <div className="mx-auto mt-3 h-1.5 w-28 rounded-full bg-gradient-to-r from-secondary via-primary to-accent shadow-md" />
        <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-100 max-w-2xl mx-auto text-glow-soft">
          Experience hyper-realistic virtual try-ons and AI-powered skin analysis directly in your browser.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Link 
            href="/quiz" 
            className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-primary/30"
          >
            Virtual Try-On
          </Link>
          <Link 
            href="/take-selfie" 
            className="px-8 py-3 bg-secondary text-white rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-secondary/30"
          >
            AI Skin Analysis
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <button type="button" onClick={() => setModal("makeup")} className="group block text-left w-full p-6 rounded-2xl border card-pop bg-gradient-to-br from-purple-50 to-pink-50 dark:from-fuchsia-900/40 dark:to-pink-900/40 border-purple-100 dark:border-fuchsia-800 hover:from-purple-200/60 hover:to-pink-200/60 hover:border-pink-300 shadow-xl hover:shadow-2xl transition-all" title="Makeup: AI analysis with tailored try-ons for lipsticks, eyeshadows, and shade matches.">
            <div className="w-12 h-12 bg-primary/30 group-hover:bg-primary/50 rounded-xl flex items-center justify-center mb-4 text-2xl">💄</div>
            <h3 className="text-xl font-bold mb-2 text-dark dark:text-white">Makeup</h3>
            <p className="text-gray-700 dark:text-gray-300">AI analyzes your face and lets you preview lipsticks, eyeshadows, and shade matches tailored to your undertone and features.</p>
          </button>
          <button type="button" onClick={() => setModal("skin")} className="group block text-left w-full p-6 rounded-2xl border card-pop bg-gradient-to-br from-purple-50 to-pink-50 dark:from-fuchsia-900/40 dark:to-pink-900/40 border-purple-100 dark:border-fuchsia-800 hover:from-purple-200/60 hover:to-pink-200/60 hover:border-pink-300 shadow-xl hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-secondary/30 group-hover:bg-secondary/50 rounded-xl flex items-center justify-center mb-4 text-2xl">🔍</div>
            <h3 className="text-xl font-bold mb-2 text-dark dark:text-white">Skin Tech</h3>
            <p className="text-gray-700 dark:text-gray-300">Clinical-grade skin analysis detecting wrinkles, spots, and texture in seconds.</p>
          </button>
          <Link href="/style-advisor" className="group block p-6 rounded-2xl border card-pop bg-gradient-to-br from-purple-50 to-pink-50 dark:from-fuchsia-900/40 dark:to-pink-900/40 border-purple-100 dark:border-fuchsia-800 hover:from-purple-200/60 hover:to-pink-200/60 hover:border-pink-300 shadow-xl hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-accent/30 group-hover:bg-accent/50 rounded-xl flex items-center justify-center mb-4 text-2xl">✨</div>
            <h3 className="text-xl font-bold mb-2 text-dark dark:text-white">Gen AI</h3>
            <p className="text-gray-700 dark:text-gray-300">Generate complete beauty looks and fashion styles with generative AI.</p>
          </Link>
        </div>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)} />
            <div className="relative w-full max-w-md mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-black/60 backdrop-blur-xl shadow-2xl p-6 text-left">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-extrabold text-dark dark:text-white">{modal === "makeup" ? "Virtual Makeup Try‑On" : "AI Skin Tech"}</h2>
                <button onClick={() => setModal(null)} className="rounded-md px-2 py-1 bg-white/70 dark:bg-white/10 text-dark dark:text-white hover:bg-white/90 dark:hover:bg-white/20">
                  ✕
                </button>
              </div>
              <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">
                {modal === "makeup"
                  ? "Preview lipsticks, eyeshadows, and shades tailored to your undertone. Sign in to proceed to quick selects and get results."
                  : "Analyze undertone, skin type, and key concerns in seconds. Sign in to proceed with selfie steps and see your results."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={proceed}
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
                <button
                  onClick={() => setModal(null)}
                  className="px-4 py-2.5 rounded-lg bg-white/80 dark:bg-white/10 text-dark dark:text-white text-sm font-semibold hover:bg-white/90 dark:hover:bg-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto mt-8 px-6">
        <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 text-center">
          Perfect Corp is a beauty‑tech innovator building AI and AR experiences that help customers discover products with confidence.
          This website showcases hyper‑real virtual try‑ons and clinical‑grade skin analysis, delivering tailored recommendations with
          privacy‑friendly on‑device processing and responsive performance.
        </p>
        <p className="mt-3 text-base md:text-lg text-gray-800 dark:text-gray-200 text-center">
          Our platform integrates shade matching, routine guidance, and AR previews, optimizing decisions with real‑time insights, inclusive recommendations, and efficient performance across modern devices and browsers.
        </p>
      </div>


      <section className="w-full mt-12 mb-10">
        <FooterPager
          hidePrevious
          nextHref="/access"
        />
      </section>
    </div>
  );
}
