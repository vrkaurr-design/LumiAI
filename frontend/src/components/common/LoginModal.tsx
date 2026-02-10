"use client";
import Link from "next/link";
import { useUI } from "@/context/UIContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginModal() {
  const { loginOpen, closeLogin } = useUI();
  const [showPwd, setShowPwd] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  if (!loginOpen) return null;
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let next = "/selfie-prep";
    try {
      sessionStorage.setItem("auth:loggedIn", "1");
      const desired = sessionStorage.getItem("auth:next");
      if (desired) {
        next = desired;
        sessionStorage.removeItem("auth:next");
      }
    } catch {}
    closeLogin();
    router.push(next);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeLogin} />
      <div className="relative w-full max-w-md mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-black/60 backdrop-blur-xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-extrabold text-dark dark:text-white">{isLogin ? "Sign In" : "Sign Up"}</h2>
          <button onClick={closeLogin} className="rounded-md px-2 py-1 bg-white/70 dark:bg-white/10 text-dark dark:text-white hover:bg-white/90 dark:hover:bg-white/20">
            ✕
          </button>
        </div>
        <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">
          {isLogin ? "Sign in to continue your AI analysis." : "Create your account to begin AI analysis."}
        </p>
        {isLogin ? (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">Email</label>
              <input type="email" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">Password</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-secondary text-dark dark:text-white" placeholder="••••••••" />
                <button type="button" aria-label={showPwd ? "Hide password" : "Show password"} onClick={() => setShowPwd((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-white/60 dark:bg-white/10 text-dark dark:text-white hover:bg-white/80 dark:hover:bg-white/20 transition-colors">
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full mt-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-md">Continue</button>
            <div className="text-center text-sm mt-2">
              <button type="button" onClick={() => setIsLogin(false)} className="text-primary font-semibold">
                Create an account
              </button>
            </div>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">Full Name</label>
              <input type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">Phone Number</label>
              <input type="tel" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white" placeholder="+1 555 000 1234" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">Gmail</label>
              <input type="email" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white" placeholder="you@gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">Password</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-secondary text-dark dark:text-white" placeholder="••••••••" />
                <button type="button" aria-label={showPwd ? "Hide password" : "Show password"} onClick={() => setShowPwd((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-white/60 dark:bg-white/10 text-dark dark:text-white hover:bg-white/80 dark:hover:bg-white/20 transition-colors">
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full mt-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-md">Continue</button>
            <div className="text-center text-sm mt-2">
              <button type="button" onClick={() => { closeLogin(); router.push("/access"); }} className="text-primary font-semibold">
                Already a user? Log in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
