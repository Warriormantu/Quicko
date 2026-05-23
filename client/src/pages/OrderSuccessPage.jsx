import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

export default function OrderSuccessPage() {
  const { id } = useParams();

  useEffect(() => {
    // Scroll to top for confetti effect
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="section-container py-16 text-center max-w-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="w-24 h-24 bg-brand-success/20 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <FiCheckCircle className="text-brand-success" size={48} />
        </motion.div>

        {/* Animated rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1,2,3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-brand-success/20"
              initial={{ width: 96, height: 96, opacity: 0.8 }}
              animate={{ width: 96 + i * 60, height: 96 + i * 60, opacity: 0 }}
              transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-display text-4xl font-black text-brand-primary mb-3">
            Order Placed! 🎉
          </h1>
          <p className="text-brand-secondary text-lg mb-2">
            Your luxury delivery is on its way.
          </p>
          <p className="text-brand-gold font-semibold text-xl mb-8">
            ⚡ Arriving in 10-15 minutes
          </p>

          {id && (
            <div className="glass-card p-4 mb-8 inline-block">
              <p className="text-xs text-brand-muted mb-1">Order ID</p>
              <p className="text-sm font-mono text-brand-gold">#{id.slice(-8).toUpperCase()}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/orders/${id}`} className="btn-gold">
              <FiPackage size={16} /> Track Order
            </Link>
            <Link to="/products" className="btn-outline-gold">
              Continue Shopping <FiArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
