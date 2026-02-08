import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-glow-strong">
          Future of Beauty Tech
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto text-glow-soft">
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
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 text-2xl">💄</div>
            <h3 className="text-xl font-bold mb-2 text-glow-soft">AR Makeup</h3>
            <p className="text-gray-500 dark:text-gray-400">Real-time lipstick, eyeshadow, and foundation try-on using advanced face tracking.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4 text-2xl">🔍</div>
            <h3 className="text-xl font-bold mb-2 text-glow-soft">Skin Tech</h3>
            <p className="text-gray-500 dark:text-gray-400">Clinical-grade skin analysis detecting wrinkles, spots, and texture in seconds.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4 text-2xl">✨</div>
            <h3 className="text-xl font-bold mb-2 text-glow-soft">Gen AI</h3>
            <p className="text-gray-500 dark:text-gray-400">Generate complete beauty looks and fashion styles with generative AI.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
