import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowRight, FiStar, FiTruck, FiShield, FiClock } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import { productAPI } from '../services/api';
import ProductCard from '../components/features/ProductCard';
import { ProductCardSkeleton } from '../components/ui';

// ─── CATEGORY DATA ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Fruits & Vegetables', emoji: '🥑', color: 'from-emerald-500/20 to-emerald-700/10', border: 'border-emerald-500/20' },
  { name: 'Dairy & Eggs', emoji: '🥛', color: 'from-blue-400/20 to-blue-600/10', border: 'border-blue-400/20' },
  { name: 'Snacks', emoji: '🍿', color: 'from-amber-400/20 to-amber-600/10', border: 'border-amber-400/20' },
  { name: 'Beverages', emoji: '☕', color: 'from-orange-400/20 to-orange-600/10', border: 'border-orange-400/20' },
  { name: 'Bakery', emoji: '🥐', color: 'from-rose-400/20 to-rose-600/10', border: 'border-rose-400/20' },
  { name: 'Personal Care', emoji: '💆', color: 'from-purple-400/20 to-purple-600/10', border: 'border-purple-400/20' },
  { name: 'Instant Foods', emoji: '🍜', color: 'from-red-400/20 to-red-600/10', border: 'border-red-400/20' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Product Designer', text: 'VELORA completely transformed how I grocery shop. The delivery is insanely fast and everything arrives perfectly fresh.', rating: 5, avatar: 'PS' },
  { name: 'Arjun Mehta', role: 'Software Engineer', text: 'Best grocery delivery app I\'ve ever used. The quality is exceptional, and the UI is absolutely stunning.', rating: 5, avatar: 'AM' },
  { name: 'Kavya Reddy', role: 'Entrepreneur', text: 'I love the luxury feel of VELORA. It\'s not just groceries — it\'s an experience. 10 out of 10!', rating: 5, avatar: 'KR' },
];

const FEATURES = [
  { icon: FiTruck, title: '10-Min Delivery', desc: 'Lightning fast delivery from our dark stores near you.' },
  { icon: FiShield, title: 'Quality Assured', desc: 'Every product is hand-picked and quality-checked.' },
  { icon: FiClock, title: '24/7 Service', desc: 'Order any time. Day or night, we deliver.' },
];

// ─── ANIMATIONS ──────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const [search, setSearch] = useState('');
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, f] = await Promise.all([
          productAPI.getAll({ trending: true, limit: 8 }),
          productAPI.getAll({ featured: true, limit: 4 }),
        ]);
        setTrending(t.products || []);
        setFeatured(f.products || []);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="min-h-screen">
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/3 rounded-full blur-3xl" />
        </div>

        <div className="section-container relative z-10 pt-24 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              Premium Grocery Delivery — 10 Minutes
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6"
            >
              <span className="text-brand-primary">Groceries Delivered</span>
              <br />
              <span className="text-gold-gradient">Faster Than Ever.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-brand-secondary text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Premium groceries, gourmet snacks, and everyday essentials — delivered in minutes, not hours.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSearch}
              className="flex gap-2 max-w-lg mx-auto"
            >
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for avocados, Greek yogurt..."
                  className="input-field pl-11 py-4 text-base"
                />
              </div>
              <button type="submit" className="btn-gold px-6 py-4 text-base whitespace-nowrap">
                Search
              </button>
            </motion.form>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-2 mt-6"
            >
              {['Mangoes 🥭', 'Cold Brew ☕', 'Sourdough 🍞', 'Ramen 🍜'].map((q) => (
                <button
                  key={q}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(q.split(' ')[0])}`)}
                  className="px-3 py-1.5 rounded-full border border-brand-border/50 text-sm text-brand-muted hover:text-brand-gold hover:border-brand-gold/30 transition-all"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mt-16"
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card px-5 py-4 flex items-center gap-3 max-w-xs">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="text-brand-gold" size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-primary">{title}</p>
                  <p className="text-xs text-brand-muted">{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-brand-muted text-xs animate-bounce">
          <div className="w-0.5 h-8 bg-gradient-to-b from-brand-gold to-transparent rounded-full" />
        </div>
      </section>

      {/* ─── CATEGORIES ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand-surface/50">
        <div className="section-container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-3">Browse</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-primary">Shop by Category</h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <Link
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  className={`block p-4 rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.color} text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-gold group`}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{cat.emoji}</div>
                  <p className="text-xs font-medium text-brand-secondary group-hover:text-brand-primary transition-colors leading-tight">
                    {cat.name}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OFFER BANNERS ────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden relative p-8 min-h-[200px] flex flex-col justify-end"
              style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
            >
              <div className="absolute top-4 right-4 text-7xl opacity-30">🥑</div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent" />
              <div className="relative">
                <span className="badge-gold mb-3 inline-block">Limited Offer</span>
                <h3 className="font-display text-2xl font-bold text-white mb-2">Fresh Produce</h3>
                <p className="text-brand-secondary text-sm mb-4">Up to 30% off on all fruits & vegetables today only</p>
                <Link to="/category/Fruits%20%26%20Vegetables" className="btn-gold text-sm py-2 px-4">
                  Shop Now <FiArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="rounded-3xl overflow-hidden relative p-8 min-h-[200px] flex flex-col justify-end"
              style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #2d1600 50%, #4a2500 100%)' }}
            >
              <div className="absolute top-4 right-4 text-7xl opacity-30">☕</div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent" />
              <div className="relative">
                <span className="badge bg-amber-500/20 text-amber-400 mb-3 inline-block">New Arrivals</span>
                <h3 className="font-display text-2xl font-bold text-white mb-2">Premium Beverages</h3>
                <p className="text-brand-secondary text-sm mb-4">Artisan coffees, exotic teas & wellness drinks</p>
                <Link to="/category/Beverages" className="btn-outline-gold text-sm py-2 px-4">
                  Explore <FiArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Coupon Strip */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-6 rounded-2xl border border-brand-gold/30 bg-brand-gold/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎁</span>
              <div>
                <p className="font-semibold text-brand-primary">First Order Offer</p>
                <p className="text-sm text-brand-secondary">Use code <code className="text-brand-gold font-bold">QUICKO10</code> for 10% off your first order</p>
              </div>
            </div>
            <Link to="/products" className="btn-gold whitespace-nowrap">
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── TRENDING PRODUCTS ────────────────────────────────────────────── */}
      <section className="py-16 bg-brand-surface/30">
        <div className="section-container">
          <div className="flex items-center justify-between mb-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-2">🔥 Hot Right Now</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-primary">Trending Products</h2>
            </motion.div>
            <Link to="/products?trending=true" className="btn-outline-gold text-sm hidden sm:flex">
              View All <FiArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {trending.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/products" className="btn-gold">
              Browse All Products <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-primary">Loved by Thousands</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass-card-hover p-6"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <AiFillStar key={j} className="text-brand-gold" size={16} />
                  ))}
                </div>
                <p className="text-brand-secondary text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
                    <span className="text-brand-bg font-bold text-sm">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-brand-primary text-sm">{t.name}</p>
                    <p className="text-xs text-brand-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── APP DOWNLOAD CTA ─────────────────────────────────────────────── */}
      <section className="py-16 bg-brand-surface/50">
        <div className="section-container">
          <div className="rounded-3xl overflow-hidden relative p-10 sm:p-16 text-center"
            style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.15) 0%, transparent 70%), linear-gradient(135deg, #111827 0%, #0B1020 100%)' }}
          >
            <div className="absolute inset-0 border border-brand-gold/20 rounded-3xl pointer-events-none" />
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-4">Coming Soon</p>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-brand-primary mb-4">
                Quicko on Mobile
              </h2>
              <p className="text-brand-secondary text-lg max-w-xl mx-auto mb-8">
                The premium grocery experience, now in your pocket. iOS & Android apps coming soon.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-gold py-3 px-8 text-base">
                  🍎 App Store
                </button>
                <button className="btn-outline-gold py-3 px-8 text-base">
                  🤖 Google Play
                </button>
              </div>
              <div className="mt-10 text-7xl animate-float">📱</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
