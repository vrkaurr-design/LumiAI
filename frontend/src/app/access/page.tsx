"use client";
import Link from "next/link";
import FooterPager from "@/components/common/FooterPager";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "@/context/UIContext";

export default function Access() {
  const [showPwd, setShowPwd] = useState(false);
  const router = useRouter();
  const { openLogin } = useUI();
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/65 dark:bg-black/40 backdrop-blur-xl shadow-xl p-6 relative z-10">
        <h2 className="text-2xl font-extrabold text-center mb-4 text-dark dark:text-white text-glow-soft">
          Pursue Skin Analysis
        </h2>
        <div className="mb-6 text-sm text-gray-800 dark:text-gray-200">
          <p className="mb-2">
            Our AI evaluates your skin tone, type, and key concerns to personalize recommendations.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Tone mapping: natural undertone and shade detection</li>
            <li>Type classification: dry, oily, combination, sensitive</li>
            <li>Concerns: spots, wrinkles, texture, redness</li>
            <li>Daily guidance: care routines and product matches</li>
          </ul>
        </div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); router.push("/selfie-prep"); }}>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white"
              placeholder="you@example.com"
              title="Use your email to sign in if you already have an account, or sign up to create one."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">
              Password
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-secondary text-dark dark:text-white"
                placeholder="••••••••"
                title="Enter a strong password. Toggle the eye icon to view or hide your entry."
              />
              <button
                type="button"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-white/60 dark:bg-white/10 text-dark dark:text-white hover:bg-white/80 dark:hover:bg-white/20 transition-colors"
              >
                {showPwd ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M15 9L9 15" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" className="rounded" title="Stay signed in on this device." />
              Remember me
            </label>
            <Link href="/" className="text-sm text-primary font-semibold">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full mt-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            Begin Now
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
          Don’t have an account?{" "}
          <button type="button" onClick={openLogin} className="text-secondary font-semibold">
            Create one
          </button>
        </div>

        <FooterPager
          hidePrevious
          nextHref="/selfie-prep"
          nextLabel="Be A Part of AI Analysis"
        />
      </div>
    </div>
  );
}
