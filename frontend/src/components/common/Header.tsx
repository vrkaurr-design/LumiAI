import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useUI } from "@/context/UIContext";

export default function Header() {
  const { openLogin } = useUI();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/quiz", label: "Virtual Try-On" },
    { href: "/take-selfie", label: "AI Skin Analysis" },
    { href: "/style-advisor", label: "Gen AI" },
    { href: "/shop", label: "Shop" },
    { href: "/feedback", label: "Reviews" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/10 dark:bg-black/10 backdrop-blur-md border-b border-white/20 dark:border-white/10 transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-glow-soft float-up">
          Perfect Corp
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`font-semibold transition-colors underline-slide ${
                isActive(l.href)
                  ? "text-primary border-b-2 border-primary pb-0.5"
                  : "text-gray-900 dark:text-gray-200 hover:text-primary"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={openLogin}
            aria-label="Open authentication"
            title="Sign in or create your account"
            className="hidden sm:inline px-4 py-2 rounded-full text-sm font-semibold bg-white/20 dark:bg-white/10 text-dark dark:text-white backdrop-blur shine-sweep"
          >
            Sign In
          </button>
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Open menu"
            className="md:hidden p-2 rounded-md bg-white/20 dark:bg-white/10 text-dark dark:text-white backdrop-blur shine-sweep"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/20 dark:border-white/10 bg-white/40 dark:bg-dark/60 backdrop-blur-md">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded-md font-semibold ${
                  isActive(l.href)
                    ? "bg-primary text-white"
                    : "bg-white/70 dark:bg-white/10 text-dark dark:text-white hover:bg-white/85 dark:hover:bg-white/20"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => { setOpen(false); openLogin(); }}
              className="px-3 py-2 rounded-md bg-gradient-to-r from-secondary to-primary text-white font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
