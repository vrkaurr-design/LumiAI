"use client";
import SkinShadeBackground from "@/components/common/SkinShadeBackground";
import LiveBackground from "@/components/common/LiveBackground";
import Header from "@/components/common/Header";
import { UIProvider } from "@/context/UIContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <SkinShadeBackground />
      <LiveBackground />
      <div className="relative z-20">
        <Header />
      </div>
      <main className="relative z-10 min-h-screen pt-16">{children}</main>
      <footer className="relative z-10 border-t border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-dark/70 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-6 text-gray-700 dark:text-gray-200">
            <a href="/" className="hover:text-primary underline-slide">Home</a>
            <a href="/quiz" className="hover:text-primary underline-slide">Virtual Try-On</a>
            <a href="/take-selfie" className="hover:text-primary underline-slide">AI Skin Analysis</a>
            <a href="/style-advisor" className="hover:text-primary underline-slide">Gen AI</a>
            <a href="/shop" className="hover:text-primary underline-slide">Shop</a>
            <a href="/feedback" className="hover:text-primary underline-slide">Reviews</a>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            © Perfect Corp
          </div>
        </div>
      </footer>
    </UIProvider>
  );
}
