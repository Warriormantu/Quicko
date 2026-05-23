import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';

export const StarRating = ({ rating = 0, size = 'sm', showValue = true, count = 0 }) => {
  const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((star) => (
          <span key={star} className={sizes[size]}>
            {star <= Math.round(rating) ? (
              <AiFillStar className="text-brand-gold" />
            ) : (
              <FiStar className="text-brand-muted" />
            )}
          </span>
        ))}
      </div>
      {showValue && (
        <span className="text-xs text-brand-secondary ml-1">
          {rating.toFixed(1)} {count > 0 && `(${count})`}
        </span>
      )}
    </div>
  );
};

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton rounded-lg ${className}`} />
      ))}
    </div>
  );
};

export const ProductCardSkeleton = () => (
  <div className="glass-card p-0 overflow-hidden">
    <div className="skeleton h-48 w-full rounded-none" />
    <div className="p-4 space-y-2">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-4 w-1/3 mt-2" />
      <div className="skeleton h-10 w-full mt-3 rounded-xl" />
    </div>
  </div>
);

export const Spinner = ({ size = 'md', color = 'gold' }) => {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-3' };
  const colors = {
    gold: 'border-brand-gold border-t-transparent',
    white: 'border-white border-t-transparent',
  };
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`} />
  );
};

export const Badge = ({ children, variant = 'gold', className = '' }) => {
  const variants = {
    gold: 'badge-gold',
    success: 'badge-success',
    danger: 'badge-danger',
    secondary: 'badge bg-brand-surface text-brand-secondary',
  };
  return <span className={`badge ${variants[variant]} ${className}`}>{children}</span>;
};

export const GlassCard = ({ children, className = '', hover = false, onClick }) => (
  <div
    className={`${hover ? 'glass-card-hover' : 'glass-card'} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full ${sizes[size]} glass-card p-6 z-10 max-h-[90vh] overflow-y-auto`}
      >
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-brand-primary">{title}</h2>
            <button
              onClick={onClose}
              className="text-brand-muted hover:text-brand-primary transition-colors p-1"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </motion.div>
    </div>
  );
};

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
    <div className="text-6xl opacity-30">{icon}</div>
    <h3 className="text-xl font-display font-semibold text-brand-primary">{title}</h3>
    <p className="text-brand-secondary max-w-sm">{description}</p>
    {action}
  </div>
);

export const formatPrice = (price) => `₹${Number(price).toFixed(0)}`;
export const getDiscount = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};
