import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiX, FiShoppingBag, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { closeCart, selectCartIsOpen } from '../../store/cartSlice';
import { useCart } from '../../hooks/useCart';
import { Spinner } from '../ui';

const CartItem = ({ item, onUpdate, onRemove }) => {
  const { product, quantity, price } = item;
  if (!product) return null;

  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=100';

  return (
    <div className="flex gap-3 p-3 glass-card mb-2">
      <img
        src={image}
        alt={product.title}
        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-brand-primary truncate">{product.title}</p>
        <p className="text-xs text-brand-muted mt-0.5">{product.unit}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdate(product._id, quantity - 1)}
              className="w-6 h-6 rounded-full bg-brand-border flex items-center justify-center hover:bg-brand-gold/20 transition-colors"
            >
              <FiMinus size={10} />
            </button>
            <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
            <button
              onClick={() => onUpdate(product._id, quantity + 1)}
              className="w-6 h-6 rounded-full bg-brand-border flex items-center justify-center hover:bg-brand-gold/20 transition-colors"
              disabled={quantity >= product.stock}
            >
              <FiPlus size={10} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-brand-gold">₹{(price * quantity).toFixed(0)}</span>
            <button
              onClick={() => onRemove(product._id)}
              className="text-brand-muted hover:text-brand-danger transition-colors"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector(selectCartIsOpen);
  const { items, totalPrice, discount, finalPrice, deliveryFee, updateQuantity, removeItem, loading } = useCart();

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => dispatch(closeCart())}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-brand-surface border-l border-brand-border/50 z-50 flex flex-col shadow-glass"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-brand-border/50">
              <div className="flex items-center gap-2">
                <FiShoppingBag className="text-brand-gold" size={20} />
                <h2 className="font-display font-bold text-lg text-brand-primary">Your Cart</h2>
                <span className="badge-gold ml-1">{items.length}</span>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="text-brand-muted hover:text-brand-primary transition-colors p-1"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Spinner />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="text-5xl opacity-20">🛒</div>
                  <p className="font-semibold text-brand-secondary">Your cart is empty</p>
                  <p className="text-sm text-brand-muted">Add items to get started</p>
                  <button
                    onClick={() => { navigate('/products'); dispatch(closeCart()); }}
                    className="btn-gold text-sm"
                  >
                    Shop Now
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <CartItem
                    key={item.product?._id || item._id}
                    item={item}
                    onUpdate={updateQuantity}
                    onRemove={removeItem}
                  />
                ))
              )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
              <div className="border-t border-brand-border/50 p-5 space-y-3">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-brand-secondary">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-brand-secondary">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-brand-success' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-brand-success">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(0)}</span>
                    </div>
                  )}
                  <hr className="border-brand-border/50 my-2" />
                  <div className="flex justify-between font-bold text-base text-brand-primary">
                    <span>Total</span>
                    <span className="text-brand-gold">₹{(finalPrice + deliveryFee).toFixed(0)}</span>
                  </div>
                </div>

                {totalPrice < 500 && (
                  <p className="text-xs text-brand-muted text-center">
                    Add ₹{(500 - totalPrice).toFixed(0)} more for free delivery
                  </p>
                )}

                <button onClick={handleCheckout} className="btn-gold w-full justify-center text-base">
                  Proceed to Checkout
                </button>
                <Link
                  to="/cart"
                  onClick={() => dispatch(closeCart())}
                  className="block text-center text-sm text-brand-secondary hover:text-brand-gold transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
