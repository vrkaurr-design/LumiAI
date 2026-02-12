 "use client";
 import { useState } from "react";
 import { useRouter } from "next/navigation";
 import Reveal from "@/components/common/Reveal";
 
 export default function Signup() {
   const [showPwd, setShowPwd] = useState(false);
   const router = useRouter();
   const onSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     try {
       sessionStorage.setItem("auth:loggedIn", "1");
     } catch {}
     router.push("/selfie-prep");
   };
   return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
       <Reveal className="w-full max-w-md mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-black/45 backdrop-blur-xl shadow-2xl p-6 relative z-10" variant="fade">
         <h2 className="text-2xl font-extrabold text-center mb-4 text-dark dark:text-white">Sign Up</h2>
         <p className="text-sm mb-4 text-center text-gray-700 dark:text-gray-300">Create your account to start.</p>
         <form className="space-y-4" onSubmit={onSubmit}>
           <div>
             <label className="block text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">Name</label>
             <input type="text" required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white" placeholder="Your name" />
           </div>
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
           <button type="submit" className="w-full mt-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-md">Create Account</button>
         </form>
         <div className="mt-4 text-center text-sm">
           <a href="/login" className="text-primary font-semibold">Already have an account? Sign in</a>
         </div>
       </Reveal>
     </div>
   );
 }
