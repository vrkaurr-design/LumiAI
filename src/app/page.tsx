import Image from "next/image";
import Link from "next/link";
import FooterPager from "@/components/common/FooterPager";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-primary text-pop-bright">
          Future of Beauty Tech
        </h1>
        <div className="mx-auto mt-3 h-1.5 w-28 rounded-full bg-gradient-to-r from-secondary via-primary to-accent shadow-md" />
        <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-100 max-w-2xl mx-auto text-glow-soft">
          Experience hyper-realistic virtual try-ons and AI-powered skin analysis directly in your browser.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Link 
            href="/try-on" 
            className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-primary/30"
          >
            Virtual Try-On
          </Link>
          <Link 
            href="/skin-analysis" 
            className="px-8 py-3 bg-secondary text-white rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-secondary/30"
          >
            AI Skin Analysis
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <Link href="/ar-experience" className="group block p-6 rounded-2xl border card-pop bg-gradient-to-br from-purple-50 to-pink-50 dark:from-fuchsia-900/40 dark:to-pink-900/40 border-purple-100 dark:border-fuchsia-800 hover:from-purple-200/60 hover:to-pink-200/60 hover:border-pink-300 shadow-xl hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-primary/30 group-hover:bg-primary/50 rounded-xl flex items-center justify-center mb-4 text-2xl">💄</div>
            <h3 className="text-xl font-bold mb-2 text-dark dark:text-white">AR Makeup</h3>
            <p className="text-gray-700 dark:text-gray-300">Real-time lipstick, eyeshadow, and foundation try-on using advanced face tracking.</p>
          </Link>
          <Link href="/skin-analysis" className="group block p-6 rounded-2xl border card-pop bg-gradient-to-br from-purple-50 to-pink-50 dark:from-fuchsia-900/40 dark:to-pink-900/40 border-purple-100 dark:border-fuchsia-800 hover:from-purple-200/60 hover:to-pink-200/60 hover:border-pink-300 shadow-xl hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-secondary/30 group-hover:bg-secondary/50 rounded-xl flex items-center justify-center mb-4 text-2xl">🔍</div>
            <h3 className="text-xl font-bold mb-2 text-dark dark:text-white">Skin Tech</h3>
            <p className="text-gray-700 dark:text-gray-300">Clinical-grade skin analysis detecting wrinkles, spots, and texture in seconds.</p>
          </Link>
          <Link href="/style-advisor" className="group block p-6 rounded-2xl border card-pop bg-gradient-to-br from-purple-50 to-pink-50 dark:from-fuchsia-900/40 dark:to-pink-900/40 border-purple-100 dark:border-fuchsia-800 hover:from-purple-200/60 hover:to-pink-200/60 hover:border-pink-300 shadow-xl hover:shadow-2xl transition-all">
            <div className="w-12 h-12 bg-accent/30 group-hover:bg-accent/50 rounded-xl flex items-center justify-center mb-4 text-2xl">✨</div>
            <h3 className="text-xl font-bold mb-2 text-dark dark:text-white">Gen AI</h3>
            <p className="text-gray-700 dark:text-gray-300">Generate complete beauty looks and fashion styles with generative AI.</p>
          </Link>
        </div>

        <FooterPager
          previousLabel="Previous"
          nextHref="/access"
          nextLabel="Next: Access"
        />
      </div>
    </div>
  );
}
