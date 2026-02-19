"use client";
import Link from "next/link";
import ProBackground from "@/components/common/ProBackground";
import Header from "@/components/common/Header";
import ApiErrorBanner from "@/components/common/ApiErrorBanner";
import { UIProvider } from "@/context/UIContext";
import { AuthProvider } from "@/context/AuthContext";
import { ApiErrorProvider } from "@/context/ApiErrorContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ApiErrorProvider>
      <AuthProvider>
        <UIProvider>
          <ProBackground />
          <ApiErrorBanner />
          <div className="relative z-20">
            <Header />
          </div>
          <main className="relative z-10 min-h-screen pt-16">{children}</main>
          <footer className="relative z-10 border-t border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-dark/70 backdrop-blur-md">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-wrap justify-center gap-6 text-gray-700 dark:text-gray-200">
                <Link href="/" className="hover:text-primary underline-slide">Home</Link>
                <Link href="/quiz" className="hover:text-primary underline-slide">Virtual Try-On</Link>
                <Link href="/take-selfie" className="hover:text-primary underline-slide">AI Skin Analysis</Link>
                <Link href="/style-advisor" className="hover:text-primary underline-slide">Gen AI</Link>
                <Link href="/shop" className="hover:text-primary underline-slide">Shop</Link>
                <Link href="/feedback" className="hover:text-primary underline-slide">Reviews</Link>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                © Lumi Ai
              </div>
            </div>
          </footer>
        </UIProvider>
      </AuthProvider>
    </ApiErrorProvider>
  );
}
