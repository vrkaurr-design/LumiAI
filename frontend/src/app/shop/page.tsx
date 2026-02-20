'use client';
import { useState, useEffect, useCallback } from 'react';
import { productsService } from '@/services/products.service';
import ProductCard from '@/components/common/ProductCard';
import ProductSkeleton from '@/components/common/ProductSkeleton';

type ShopProduct = {
  id: string;
  name: string;
  category: 'makeup' | 'skincare';
  type: string;
  shade?: 'warm' | 'cool' | 'neutral';
  skinType?: 'dry' | 'oily' | 'combination' | 'sensitive';
  price: number;
  currency?: '₹' | '$' | '€';
  detail: string;
  badge?: 'new' | 'bestseller';
  stock?: number;
  ratingAvg?: number;
  ratingCount?: number;
};

export default function ShopPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    search: '',
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productsService.getProducts(filters);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
      // Fallback mock catalog so that page is usable even if backend is down
      setProducts([
        {
          id: '1',
          name: 'Luminous Foundation',
          category: 'makeup' as const,
          type: 'Foundation',
          shade: 'neutral',
          price: 1299,
          currency: '₹',
          detail: 'Medium coverage with natural finish',
          badge: 'new',
          stock: 24,
          ratingAvg: 4.5,
          ratingCount: 87,
        },
        {
          id: '2',
          name: 'HydraGlow Serum',
          category: 'skincare' as const,
          type: 'Serum',
          skinType: 'oily',
          price: 899,
          currency: '₹',
          detail: 'Oil-control hydrating serum',
          badge: 'bestseller',
          stock: 41,
          ratingAvg: 4.7,
          ratingCount: 132,
        },
        {
          id: '3',
          name: 'Velvet Matte Lipstick',
          category: 'makeup' as const,
          type: 'Lipstick',
          shade: 'warm',
          price: 599,
          currency: '₹',
          detail: 'Long-lasting matte finish',
          stock: 63,
          ratingAvg: 4.3,
          ratingCount: 58,
        },
        {
          id: '4',
          name: 'CalmCleanse Gentle Foam',
          category: 'skincare' as const,
          type: 'Cleanser',
          skinType: 'dry',
          price: 449,
          currency: '₹',
          detail: 'Soft-foam hydrating cleanser',
          stock: 88,
          ratingAvg: 4.6,
          ratingCount: 96,
        },
        {
          id: '5',
          name: 'Radiant Glow Primer',
          category: 'makeup' as const,
          type: 'Primer',
          shade: 'neutral',
          price: 799,
          currency: '₹',
          detail: 'Prep and illuminate skin',
          badge: 'new',
          stock: 35,
          ratingAvg: 4.4,
          ratingCount: 71,
        },
        {
          id: '6',
          name: 'Brightening Vitamin C Cream',
          category: 'skincare' as const,
          type: 'Moisturizer',
          skinType: 'combination',
          price: 999,
          currency: '₹',
          detail: 'Brighten and hydrate',
          stock: 52,
          ratingAvg: 4.8,
          ratingCount: 104,
        },
        {
          id: '7',
          name: 'Bold Impact Mascara',
          category: 'makeup' as const,
          type: 'Mascara',
          shade: 'cool',
          price: 449,
          currency: '₹',
          detail: 'Volume and lift',
          stock: 67,
          ratingAvg: 4.2,
          ratingCount: 49,
        },
        {
          id: '8',
          name: 'Soothing Aloe Gel',
          category: 'skincare' as const,
          type: 'Gel',
          skinType: 'sensitive',
          price: 349,
          currency: '₹',
          detail: 'Calm and refresh',
          stock: 91,
          ratingAvg: 4.5,
          ratingCount: 83,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-6 text-dark dark:text-white">Shop</h1>
        <div className="flex flex-wrap gap-4 items-center">
          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2">
            <option value="">All Categories</option>
            <option value="MAKEUP">Makeup</option>
            <option value="SKINCARE">Skincare</option>
          </select>

          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-0"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)
          : products.map((product: ShopProduct) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}
