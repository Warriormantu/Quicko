import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/features/ProductCard';
import { ProductCardSkeleton, EmptyState } from '../components/ui';
import { useDebounce } from '../hooks/useUtils';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setProducts([]); setTotal(0); return; }
    const search = async () => {
      setLoading(true);
      try {
        const data = await productAPI.getAll({ search: debouncedQuery, limit: 24 });
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch {}
      setLoading(false);
    };
    search();
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen pt-20">
      <div className="section-container py-10">
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={20} />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="input-field pl-12 py-4 text-lg"
            />
          </div>
          {debouncedQuery && !loading && (
            <p className="text-brand-secondary text-sm mt-3">{total} results for "{debouncedQuery}"</p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        ) : debouncedQuery ? (
          <EmptyState icon="🔍" title="No results found" description={`We couldn't find products matching "${debouncedQuery}"`} />
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-30">🔍</div>
            <p className="text-brand-secondary">Start typing to search for products</p>
          </div>
        )}
      </div>
    </div>
  );
}
