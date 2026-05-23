import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiShoppingBag, FiPlus, FiMinus, FiTag } from 'react-icons/fi';
import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { EmptyState, Spinner } from '../components/ui';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, totalPrice, discount, finalPrice, deliveryFee, updateQuantity, removeItem, applyCoupon } = useCart();
  const [coupon, setCoupon] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleCoupon = async (e) => {
    e.preventDefault();
    setApplyingCoupon(true);
    try { await applyCoupon(coupon); setCoupon(''); }
    catch (e) { toast.error(e.message || 'Invalid coupon'); }
    setApplyingCoupon(false);
  };

  if (items.length === 0) return (
    <div className="min-h-screen pt-24 section-container">
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        description="Start shopping and add items to your cart"
        action={<button onClick={() => navigate('/products')} className="btn-gold">Shop Now</button>}
      />
    </div>
  );

  return (
    <div className="min-h-screen pt-20">
      <div className="section-container py-10">
        <h1 className="font-display text-3xl font-bold text-brand-primary mb-8">My Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const p = item.product;
              if (!p) return null;
              return (
                <motion.div
                  key={p._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-4 flex gap-4 items-center"
                >
                  <img src={p.images?.[0]} alt={p.title} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-brand-gold mb-1">{p.category}</p>
                    <h3 className="font-semibold text-brand-primary truncate">{p.title}</h3>
                    <p className="text-xs text-brand-muted">{p.unit}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 glass-card px-3 py-1.5">
                        <button onClick={() => updateQuantity(p._id, item.quantity - 1)} className="text-brand-muted hover:text-brand-primary">
                          <FiMinus size={12} />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(p._id, item.quantity + 1)} disabled={item.quantity >= p.stock} className="text-brand-muted hover:text-brand-primary">
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-brand-gold">₹{(item.price * item.quantity).toFixed(0)}</span>
                        <button onClick={() => removeItem(p._id)} className="text-brand-muted hover:text-brand-danger transition-colors">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-brand-primary mb-3 flex items-center gap-2"><FiTag size={16} /> Promo Code</h3>
              <form onSubmit={handleCoupon} className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="QUICKO10"
                  className="input-field py-2 text-sm flex-1"
                />
                <button type="submit" disabled={applyingCoupon || !coupon} className="btn-gold py-2 px-4 text-sm">
                  {applyingCoupon ? <Spinner size="sm" color="white" /> : 'Apply'}
                </button>
              </form>
              <p className="text-xs text-brand-muted mt-2">Try: QUICKO10, FLAT50, PREMIUM20</p>
            </div>

            {/* Order Summary */}
            <div className="glass-card p-5 space-y-3">
              <h3 className="font-semibold text-brand-primary mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-brand-secondary">
                  <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span>₹{totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-brand-secondary">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-brand-success' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-brand-success">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(0)}</span>
                  </div>
                )}
              </div>
              <hr className="border-brand-border/50" />
              <div className="flex justify-between font-bold text-lg">
                <span className="text-brand-primary">Total</span>
                <span className="text-brand-gold">₹{(finalPrice + deliveryFee).toFixed(0)}</span>
              </div>
              {totalPrice < 500 && (
                <p className="text-xs text-brand-muted text-center">
                  Add ₹{(500 - totalPrice).toFixed(0)} more for free delivery
                </p>
              )}
              <button onClick={() => navigate('/checkout')} className="btn-gold w-full justify-center py-3.5 text-base">
                Proceed to Checkout
              </button>
              <button onClick={() => navigate('/products')} className="btn-ghost w-full justify-center text-sm">
                <FiShoppingBag size={14} /> Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
