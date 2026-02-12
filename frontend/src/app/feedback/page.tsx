 "use client";
 import { useState } from "react";
 import Reveal from "@/components/common/Reveal";
 
 export default function Feedback() {
   const [submitted, setSubmitted] = useState(false);
   const [rating, setRating] = useState<number>(5);
   const [showInstagram, setShowInstagram] = useState(false);
 
   const company = {
     name: "Perfect Corp",
     location: "Mumbai, India",
     email: "support@perfectcorp.example",
     phone: "+91 90000 00000",
     instagram: "https://instagram.com/perfectcorp",
   };
 
   const onSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     setSubmitted(true);
   };
 
   return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
       <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-secondary/35 via-primary/25 to-pink-200/10 mix-blend-soft-light" />
      <Reveal className="w-full max-w-2xl mx-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-black/45 backdrop-blur-xl shadow-2xl p-6 relative z-10">
        <Reveal as="h1" className="text-3xl font-extrabold text-center mb-2 text-primary text-pop-bright" variant="fade">
          We Value Your Review
        </Reveal>
        <Reveal className="text-center text-sm text-gray-700 dark:text-gray-300 mb-6" delay={60}>
          Thank you for supporting our AI beauty experience. Share your feedback to help us improve.
        </Reveal>
 
         {!submitted ? (
           <form className="space-y-4" onSubmit={onSubmit}>
             <div>
               <label className="block text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">Rating</label>
               <div className="flex items-center gap-2">
                 {[1, 2, 3, 4, 5].map((n) => (
                   <button
                     key={n}
                     type="button"
                     onClick={() => setRating(n)}
                     className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-colors ${
                       n <= rating ? "bg-yellow-400 text-dark" : "bg-white/70 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                     }`}
                     aria-label={`${n} star${n > 1 ? "s" : ""}`}
                   >
                     ★
                   </button>
                 ))}
               </div>
             </div>
 
             <div>
               <label className="block text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">Your Review</label>
               <textarea rows={4} required className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-dark dark:text-white" placeholder="What did you like? What can we improve?" />
             </div>
 
            <Reveal as="div" delay={80}>
              <button type="submit" className="w-full mt-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-primary text-white font-semibold shadow-md shine-sweep">
                Submit Review
              </button>
            </Reveal>
           </form>
         ) : (
          <Reveal className="rounded-xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-fuchsia-900/30 dark:to-pink-900/30 border border-purple-100 dark:border-fuchsia-800 text-center" delay={40}>
             <div className="text-lg font-bold text-dark dark:text-white mb-1">Thanks for your support!</div>
             <div className="text-sm text-gray-700 dark:text-gray-300">We appreciate your time and feedback.</div>
          </Reveal>
         )}
 
        <Reveal className="mt-8 rounded-2xl border border-white/20 dark:border-white/10 bg-white/75 dark:bg-black/40 p-5" delay={60}>
           <div className="text-xl font-bold mb-2 text-dark dark:text-white">Company Details</div>
           <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
             <div>Perfect Corp</div>
             <div>Mumbai, India</div>
             <div>Email: <a href={`mailto:${company.email}`} className="underline">{company.email}</a></div>
             <div>Phone: <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`} className="underline">{company.phone}</a></div>
           </div>
 
           <div className="mt-4 text-center">
            <button
               type="button"
               onClick={() => setShowInstagram(true)}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-secondary to-primary text-white font-semibold shadow-md shine-sweep"
             >
               Follow us on Instagram
             </button>
             {showInstagram && (
               <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                 Connect here:{" "}
                 <a href={company.instagram} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                   {company.instagram}
                 </a>
               </div>
             )}
           </div>
        </Reveal>
      </Reveal>
     </div>
   );
 }
