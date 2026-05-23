import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { AiFillStar, AiFillHeart } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../store/authSlice';
import { selectIsWishlisted } from '../../store/wishlistSlice';
import { useCart } from '../../hooks/useCart';
import { wishlistAPI } from '../../services/api';
import { useDispatch } from 'react-redux';
import { toggleWishlistItem } from '../../store/wishlistSlice';
import toast from 'react-hot-toast';

const formatPrice = (p) => `₹${Number(p).toFixed(0)}`;
const getDiscount = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

export default function ProductCard({ product, index = 0 }) {
  const [adding, setAdding] = useState(false);
  const [toggling, setToggling] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isWishlisted = useSelector(selectIsWishlisted(product._id));
  const { addToCart } = useCart();

  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400';
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discountPct = getDiscount(product.price, product.discountPrice);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return; }
    if (isOutOfStock) return;
    setAdding(true);
    await addToCart(product._id);
    setAdding(false);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to save to wishlist'); return; }
    setToggling(true);
    try {
      await wishlistAPI.toggle(product._id);
      dispatch(toggleWishlistItem(product._id));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setToggling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/products/${product._id}`} className="block group">
        <div className="glass-card overflow-hidden transition-all duration-300 group-hover:border-brand-gold/30 group-hover:shadow-gold group-hover:-translate-y-1">
          {/* Image */}
          <div className="relative h-44 overflow-hidden bg-brand-surface">
            <img
              src={image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discountPct > 0 && (
                <span className="badge bg-brand-danger text-white text-xs font-bold">-{discountPct}%</span>
              )}
              {product.trending && (
                <span className="badge bg-brand-gold text-brand-bg text-xs font-bold">🔥 Trending</span>
              )}
              {isOutOfStock && (
                <span className="badge bg-brand-muted text-brand-secondary">Out of Stock</span>
              )}
            </div>
            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              disabled={toggling}
              className="absolute top-2 right-2 w-8 h-8 bg-brand-bg/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:bg-brand-danger/20 hover:scale-110"
            >
              {isWishlisted ? (
                <AiFillHeart className="text-brand-danger" size={16} />
              ) : (
                <FiHeart className="text-brand-muted" size={14} />
              )}
            </button>
            {/* Quick delivery */}
            <div className="absolute bottom-2 left-2">
              <span className="text-xs bg-brand-bg/80 backdrop-blur-sm text-brand-gold px-2 py-0.5 rounded-full">
                ⚡ {product.deliveryTime}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="text-xs text-brand-gold mb-1">{product.category}</p>
            <h3 className="text-sm font-semibold text-brand-primary line-clamp-2 mb-1 group-hover:text-brand-gold transition-colors">
              {product.title}
            </h3>
            <p className="text-xs text-brand-muted mb-2">{product.unit}</p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <AiFillStar className="text-brand-gold" size={12} />
              <span className="text-xs text-brand-secondary">{product.avgRating?.toFixed(1)} ({product.numReviews})</span>
            </div>

            {/* Price + Add to Cart */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base font-bold text-brand-primary">{formatPrice(displayPrice)}</span>
                {product.discountPrice > 0 && (
                  <span className="text-xs text-brand-muted line-through ml-1">{formatPrice(product.price)}</span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding || isOutOfStock}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isOutOfStock
                    ? 'bg-brand-border text-brand-muted cursor-not-allowed'
                    : 'bg-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-bg active:scale-95'
                }`}
              >
                {adding ? (
                  <div className="w-3 h-3 border border-brand-gold border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiShoppingCart size={12} />
                )}
                {isOutOfStock ? 'Sold Out' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
