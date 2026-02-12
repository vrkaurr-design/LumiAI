"use client";
import Link from "next/link";
import Reveal from "@/components/common/Reveal";
import FooterPager from "@/components/common/FooterPager";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="relative px-4 pt-20 pb-16 text-center">
        <div className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-br from-secondary/35 via-primary/25 to-pink-200/10 mix-blend-soft-light" />
        <Reveal className="max-w-5xl mx-auto space-y-6" variant="fade">
          <Reveal
            as="h1"
            className="font-semibold whitespace-nowrap text-4xl sm:text-5xl md:text-7xl tracking-tight leading-tight bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent text-shadow-under"
          >
            Future of Beauty Tech
          </Reveal>
          <Reveal className="mx-auto h-1.5 w-28 rounded-full bg-gradient-to-r from-secondary via-primary to-accent shadow-md" delay={40} />
          <Reveal
            as="p"
            className="text-xl md:text-2xl text-gray-800 dark:text-gray-100 max-w-2xl mx-auto text-glow-soft"
            delay={80}
          >
            Hyper‑real virtual try‑ons and AI skin analysis in your browser.
          </Reveal>
          <Reveal className="flex flex-wrap gap-4 justify-center" delay={120}>
            <Link className="px-8 py-3 bg-primary text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-primary/30 shine-sweep" href="/quiz">
              Virtual Try‑On
            </Link>
            <Link className="px-8 py-3 bg-secondary text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-secondary/30 shine-sweep" href="/take-selfie">
              AI Skin Analysis
            </Link>
          </Reveal>
        </Reveal>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Reveal className="group p-6 rounded-2xl border card-pop tilt-hover bg-gradient-to-br from-purple-50 to-pink-50 dark:from-fuchsia-900/40 dark:to-pink-900/40 border-purple-100 dark:border-fuchsia-800 shadow-xl transition-all">
            <div className="w-12 h-12 bg-primary/30 group-hover:bg-primary/50 rounded-xl flex items-center justify-center mb-4 text-2xl">💄</div>
            <div className="text-xl font-bold mb-2 text-dark dark:text-white">Virtual Makeup</div>
            <p className="text-gray-700 dark:text-gray-300">Try lipsticks, eyeshadows, and shade matches tailored to your undertone.</p>
          </Reveal>
          <Reveal className="group p-6 rounded-2xl border card-pop tilt-hover bg-gradient-to-br from-green-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 border-green-100 dark:border-emerald-800 shadow-xl transition-all" delay={40}>
            <div className="w-12 h-12 bg-secondary/30 group-hover:bg-secondary/50 rounded-xl flex items-center justify-center mb-4 text-2xl">🔍</div>
            <div className="text-xl font-bold mb-2 text-dark dark:text-white">Skin Analysis</div>
            <p className="text-gray-700 dark:text-gray-300">Clinical‑grade analysis detecting wrinkles, spots, and texture in seconds.</p>
          </Reveal>
          <Reveal className="group p-6 rounded-2xl border card-pop tilt-hover bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-indigo-900/40 dark:to-slate-900/40 border-indigo-100 dark:border-indigo-800 shadow-xl transition-all" delay={80}>
            <div className="w-12 h-12 bg-accent/30 group-hover:bg-accent/50 rounded-xl flex items-center justify-center mb-4 text-2xl">✨</div>
            <div className="text-xl font-bold mb-2 text-dark dark:text-white">Generative Advisor</div>
            <p className="text-gray-700 dark:text-gray-300">Create complete looks and styles powered by generative intelligence.</p>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-12 bg-white/40 dark:bg-white/5 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <Reveal as="h2" className="text-2xl font-extrabold text-center text-dark dark:text-white">How It Works</Reveal>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Reveal className="p-5 rounded-xl border bg-white/70 dark:bg-white/10">
              <div className="text-lg font-bold mb-1">1. Take Selfie</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Quick, guided capture for best results.</p>
            </Reveal>
            <Reveal className="p-5 rounded-xl border bg-white/70 dark:bg-white/10" delay={40}>
              <div className="text-lg font-bold mb-1">2. AI Analysis</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Undertone, type, and key concerns.</p>
            </Reveal>
            <Reveal className="p-5 rounded-xl border bg-white/70 dark:bg-white/10" delay={80}>
              <div className="text-lg font-bold mb-1">3. Recommendations</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Makeup shades and care routines.</p>
            </Reveal>
            <Reveal className="p-5 rounded-xl border bg-white/70 dark:bg-white/10" delay={120}>
              <div className="text-lg font-bold mb-1">4. Shop</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">Browse company products tailored to you.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Reveal className="rounded-2xl border bg-white/80 dark:bg-white/10 p-6 backdrop-blur-xl shadow-xl">
            <div className="text-4xl font-extrabold text-primary">98%</div>
            <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">Users report improved product discovery</div>
          </Reveal>
          <Reveal className="rounded-2xl border bg-white/80 dark:bg-white/10 p-6 backdrop-blur-xl shadow-xl" delay={40}>
            <div className="text-4xl font-extrabold text-secondary">30s</div>
            <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">Average time to complete analysis</div>
          </Reveal>
          <Reveal className="rounded-2xl border bg-white/80 dark:bg-white/10 p-6 backdrop-blur-xl shadow-xl" delay={80}>
            <div className="text-4xl font-extrabold text-accent">100+</div>
            <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">Curated products across shades and types</div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-12 bg-white/40 dark:bg-white/5 backdrop-blur">
        <div className="max-w-6xl mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-xl shadow-xl p-8 text-center">
          <Reveal as="h3" className="text-2xl font-extrabold text-dark dark:text-white">Start Your Journey</Reveal>
          <Reveal className="mt-2 text-sm text-gray-700 dark:text-gray-300" delay={40}>
            Sign in and explore virtual try‑ons or run a quick skin analysis.
          </Reveal>
          <Reveal className="mt-6 flex items-center justify-center gap-3" delay={80}>
            <Link href="/quiz" className="px-5 py-2.5 rounded-full bg-primary text-white font-semibold shine-sweep">Virtual Try‑On</Link>
            <Link href="/take-selfie" className="px-5 py-2.5 rounded-full bg-secondary text-white font-semibold shine-sweep">AI Skin Analysis</Link>
            <Link href="/shop" className="px-5 py-2.5 rounded-full bg-dark dark:bg-white text-white dark:text-dark font-semibold shine-sweep">Shop</Link>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <FooterPager hidePrevious nextHref="/shop" />
        </div>
      </section>
    </div>
  );
}
