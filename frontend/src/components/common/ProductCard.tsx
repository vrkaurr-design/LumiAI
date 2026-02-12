import Reveal from "@/components/common/Reveal";
import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
type Product = {
  id: string;
  name: string;
  category: "makeup" | "skincare";
  type: string;
  shade?: "warm" | "cool" | "neutral";
  skinType?: "dry" | "oily" | "combination";
  price: number;
  currency?: "₹" | "$" | "€";
  detail: string;
  badge?: "new" | "bestseller";
  stock?: number;
  ratingAvg?: number;
  ratingCount?: number;
};
export default function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const addToCart = useAppStore((s) => s.addToCart);
  const router = useRouter();
  const chip = useMemo(() => {
    if (product.category === "makeup" && product.shade) return product.shade;
    if (product.category === "skincare" && product.skinType) return product.skinType;
    return product.type;
  }, [product]);
  const bgSvg = useMemo(() => {
    const base = product.category === "makeup" ? "#FBE8F2" : "#E8F7F3";
    const accent = product.category === "makeup" ? "#F4C6DE" : "#BFE9DB";
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='${base}'/><stop offset='100%' stop-color='${accent}'/></linearGradient></defs><rect x='0' y='0' width='64' height='64' rx='12' fill='url(#g)'/><g opacity='0.25'><circle cx='20' cy='20' r='6' fill='#333'/><rect x='28' y='14' width='18' height='10' rx='3' fill='#333'/></g></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }, [product.category]);
  return (
    <Reveal className="rounded-2xl border bg-white/80 dark:bg-white/10 dark:text-white backdrop-blur-xl p-6 shadow-xl card-pop tilt-hover overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-2xl min-h-[220px]" delay={delay}>
      <div className="flex items-start gap-4">
        <img src={bgSvg} alt={product.type} className="w-16 h-16 rounded-xl border border-white/30 dark:border-white/10 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-bold text-lg">{product.name}</div>
            {product.badge && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${product.badge === "bestseller" ? "bg-secondary/30 text-secondary" : "bg-primary/30 text-primary"}`}>
                {product.badge}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">{product.detail}</div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-base font-semibold">{product.currency ?? "₹"}{product.price}</div>
            <div className="px-2 py-1 rounded-md bg-white/70 dark:bg-white/10 text-xs font-semibold capitalize">{chip}</div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex text-[13px]" aria-label="Average rating">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className={i < Math.round(product.ratingAvg ?? 0) ? "text-yellow-500" : "text-gray-300"}>★</span>
                ))}
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300">({product.ratingCount ?? 0})</div>
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300">{typeof product.stock === "number" ? `In stock: ${product.stock}` : ""}</div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link href={`/shop#${product.id}`} className="px-3 py-1.5 rounded-md bg-dark dark:bg-white text-white dark:text-dark text-sm font-semibold shine-sweep">
              View
            </Link>
            <button
              type="button"
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  currency: product.currency ?? "₹",
                  detail: product.detail,
                  type: product.type,
                  shade: product.shade,
                  skinType: product.skinType,
                });
                router.push("/cart");
              }}
              className="px-3 py-1.5 rounded-md bg-gradient-to-r from-secondary to-primary text-white text-sm font-semibold shine-sweep"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
