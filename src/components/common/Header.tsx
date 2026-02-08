import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/75 dark:bg-dark/75 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-glow-soft">
          Perfect Corp
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/try-on" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors font-medium text-glow-soft">
            Try-On
          </Link>
          <Link href="/skin-analysis" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors font-medium text-glow-soft">
            Skin Analysis
          </Link>
          <Link href="/recommendations" className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors font-medium text-glow-soft">
            Shop
          </Link>
        </nav>

        <button className="px-4 py-2 bg-dark dark:bg-white text-white dark:text-dark rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
          Get Started
        </button>
      </div>
    </header>
  );
}
