'use client';
import { useState, useEffect, useCallback } from 'react';
import { productsService } from '@/services/products.service';
import ProductCard from '@/components/common/ProductCard';
import ProductSkeleton from '@/components/common/ProductSkeleton';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    search: '',
  });

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productsService.getProducts(filters);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  return (
    <div>
      <div className="filters">
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="MAKEUP">Makeup</option>
          <option value="SKINCARE">Skincare</option>
        </select>

        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="product-grid">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)
          : products.map((product: any) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}
