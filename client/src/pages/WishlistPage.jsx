import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { wishlistAPI } from '../services/api';
import { setWishlist, toggleWishlistItem } from '../store/wishlistSlice';
import { useCart } from '../hooks/useCart';
import { Spinner, EmptyState } from '../components/ui';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await wishlistAPI.get();
        setProducts(data.products || []);
        dispatch(setWishlist((data.products || []).map((p) => p._id)));
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.toggle(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      dispatch(toggleWishlistItem(productId));
    } catch (e) { toast.error(e.message); }
  };

  const handleMoveToCart = async (productId) => {
    await addToCart(productId);
    await handleRemove(productId);
  };

  if (loading) return <div className="min-h-screen pt-24 flex justify-center"><Spinner /></div>;

  return (
    <div className="min-h-screen pt-20">
      <div className="section-container py-10">
        <h1 className="font-display text-3xl font-bold text-brand-primary mb-2 flex items-center gap-2">
          <FiHeart className="text-brand-danger" /> Wishlist
        </h1>
        <p className="text-brand-secondary mb-8">{products.length} saved items</p>

        {products.length === 0 ? (
          <EmptyState
            icon="💝"
            title="Your wishlist is empty"
            description="Save products you love for later"
            action={<Link to="/products" className="btn-gold">Explore Products</Link>}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product, i) => {
              const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card overflow-hidden group"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Link to={`/products/${product._id}`}>
                      <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </Link>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-brand-bg/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-brand-danger/20 transition-colors"
                    >
                      <FiTrash2 size={13} className="text-brand-danger" />
                    </button>
                  </div>
                  <div className="p-3 space-y-2">
                    <Link to={`/products/${product._id}`}>
                      <h3 className="text-sm font-semibold text-brand-primary line-clamp-2 hover:text-brand-gold transition-colors">{product.title}</h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-gold">₹{displayPrice}</span>
                      <button
                        onClick={() => handleMoveToCart(product._id)}
                        disabled={product.stock === 0}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-bg transition-all active:scale-95"
                      >
                        <FiShoppingCart size={11} /> Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
