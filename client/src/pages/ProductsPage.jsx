import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/features/ProductCard';
import { ProductCardSkeleton, EmptyState } from '../components/ui';
import { useDebounce } from '../hooks/useUtils';

const CATEGORIES = ['Fruits & Vegetables', 'Dairy & Eggs', 'Snacks', 'Beverages', 'Bakery', 'Personal Care', 'Instant Foods'];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-avgRating', label: 'Top Rated' },
  { value: '-sold', label: 'Best Selling' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '-createdAt',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    trending: searchParams.get('trending') || '',
    featured: searchParams.get('featured') || '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const data = await productAPI.getAll(params);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {}
    setLoading(false);
  }, [filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', sort: '-createdAt', minPrice: '', maxPrice: '', trending: '', featured: '' });
    setPage(1);
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.trending;

  return (
    <div className="min-h-screen pt-20">
      <div className="section-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-primary">
              {filters.category || 'All Products'}
            </h1>
            <p className="text-brand-secondary text-sm mt-1">{total} products found</p>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-ghost text-sm text-brand-danger">
                <FiX size={14} /> Clear
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline-gold text-sm py-2 md:hidden"
            >
              <FiFilter size={14} /> Filters
            </button>
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="input-field py-2 pr-8 text-sm w-auto"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="glass-card p-5 space-y-6 sticky top-24">
              <div>
                <h3 className="font-semibold text-brand-primary mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.category ? 'bg-brand-gold text-brand-bg' : 'text-brand-secondary hover:text-brand-primary hover:bg-brand-border/30'}`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateFilter('category', cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === cat ? 'bg-brand-gold text-brand-bg' : 'text-brand-secondary hover:text-brand-primary hover:bg-brand-border/30'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-brand-primary mb-3">Price Range</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    placeholder="Min"
                    className="input-field py-2 text-sm w-1/2"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="input-field py-2 text-sm w-1/2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.trending === 'true'}
                    onChange={(e) => updateFilter('trending', e.target.checked ? 'true' : '')}
                    className="accent-brand-gold"
                  />
                  <span className="text-sm text-brand-secondary">🔥 Trending Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.featured === 'true'}
                    onChange={(e) => updateFilter('featured', e.target.checked ? 'true' : '')}
                    className="accent-brand-gold"
                  />
                  <span className="text-sm text-brand-secondary">⭐ Featured Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon="📦"
                title="No products found"
                description="Try adjusting your filters or search for something else"
                action={<button onClick={clearFilters} className="btn-gold">Clear Filters</button>}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === p ? 'bg-brand-gold text-brand-bg' : 'glass-card text-brand-secondary hover:text-brand-gold'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
