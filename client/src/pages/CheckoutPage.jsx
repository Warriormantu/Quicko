import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiMapPin, FiCreditCard, FiPackage } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { orderAPI } from '../services/api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';
import { Spinner } from '../components/ui';
import toast from 'react-hot-toast';

const STEPS = ['Address', 'Payment', 'Review'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { items, totalPrice, discount, finalPrice, deliveryFee } = useCart();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const handleAddressNext = (e) => {
    e.preventDefault();
    if (!address.addressLine1 || !address.city || !address.state || !address.pincode) {
      return toast.error('Please fill all required fields');
    }
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const data = await orderAPI.create({ shippingAddress: address, paymentMethod });
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    }
    setLoading(false);
  };

  const total = (finalPrice + deliveryFee).toFixed(0);

  return (
    <div className="min-h-screen pt-20 bg-brand-bg">
      <div className="section-container py-10 max-w-4xl">
        <h1 className="font-display text-3xl font-bold text-brand-primary mb-8">Checkout</h1>

        {/* Stepper */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < step ? 'bg-brand-success text-white' : i === step ? 'bg-brand-gold text-brand-bg' : 'bg-brand-border text-brand-muted'
              }`}>
                {i < step ? <FiCheck size={16} /> : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${i === step ? 'text-brand-gold' : 'text-brand-muted'}`}>{s}</span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-all ${i < step ? 'bg-brand-success' : 'bg-brand-border'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 0: Address */}
              {step === 0 && (
                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="glass-card p-6">
                    <h2 className="font-display text-xl font-bold text-brand-primary mb-5 flex items-center gap-2">
                      <FiMapPin className="text-brand-gold" /> Delivery Address
                    </h2>
                    <form onSubmit={handleAddressNext} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-brand-secondary mb-1 block">Full Name *</label>
                          <input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className="input-field" required />
                        </div>
                        <div>
                          <label className="text-xs text-brand-secondary mb-1 block">Phone *</label>
                          <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="input-field" required />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-brand-secondary mb-1 block">Address Line 1 *</label>
                        <input value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })} className="input-field" placeholder="House/Flat No, Building, Street" required />
                      </div>
                      <div>
                        <label className="text-xs text-brand-secondary mb-1 block">Address Line 2</label>
                        <input value={address.addressLine2} onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })} className="input-field" placeholder="Landmark, Area (optional)" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-brand-secondary mb-1 block">City *</label>
                          <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="input-field" required />
                        </div>
                        <div>
                          <label className="text-xs text-brand-secondary mb-1 block">State *</label>
                          <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="input-field" required />
                        </div>
                        <div>
                          <label className="text-xs text-brand-secondary mb-1 block">Pincode *</label>
                          <input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="input-field" required />
                        </div>
                      </div>
                      <button type="submit" className="btn-gold w-full justify-center py-3.5">Continue to Payment</button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Payment */}
              {step === 1 && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="glass-card p-6">
                    <h2 className="font-display text-xl font-bold text-brand-primary mb-5 flex items-center gap-2">
                      <FiCreditCard className="text-brand-gold" /> Payment Method
                    </h2>
                    <div className="space-y-3 mb-6">
                      {[
                        { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: '💵' },
                        { value: 'Online', label: 'Pay Online', desc: 'UPI, Cards, Net Banking (simulated)', icon: '💳' },
                      ].map((pm) => (
                        <label key={pm.value} className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === pm.value ? 'border-brand-gold bg-brand-gold/10' : 'border-brand-border glass-card hover:border-brand-gold/30'}`}>
                          <input type="radio" name="payment" value={pm.value} checked={paymentMethod === pm.value} onChange={() => setPaymentMethod(pm.value)} className="accent-brand-gold" />
                          <span className="text-2xl">{pm.icon}</span>
                          <div>
                            <p className="font-semibold text-brand-primary">{pm.label}</p>
                            <p className="text-xs text-brand-muted">{pm.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(0)} className="btn-ghost flex-1 justify-center">Back</button>
                      <button onClick={() => setStep(2)} className="btn-gold flex-1 justify-center">Review Order</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="glass-card p-6">
                    <h2 className="font-display text-xl font-bold text-brand-primary mb-5 flex items-center gap-2">
                      <FiPackage className="text-brand-gold" /> Review Your Order
                    </h2>
                    <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.product?._id} className="flex items-center gap-3">
                          <img src={item.product?.images?.[0]} alt={item.product?.title} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-brand-primary">{item.product?.title}</p>
                            <p className="text-xs text-brand-muted">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-bold text-brand-gold">₹{(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-brand-border pt-4 mb-4 text-sm space-y-1">
                      <div className="flex justify-between text-brand-secondary">
                        <span>📍 {address.addressLine1}, {address.city}</span>
                      </div>
                      <div className="flex justify-between text-brand-secondary">
                        <span>💳 {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="btn-ghost flex-1 justify-center">Back</button>
                      <button onClick={handlePlaceOrder} disabled={loading} className="btn-gold flex-1 justify-center py-3.5">
                        {loading ? <Spinner size="sm" color="white" /> : 'Place Order'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="glass-card p-5 space-y-3 h-fit sticky top-24">
            <h3 className="font-semibold text-brand-primary">Order Summary</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-brand-secondary">
                <span>Subtotal</span><span>₹{totalPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-brand-secondary">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'text-brand-success' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand-success">
                  <span>Discount</span><span>-₹{discount.toFixed(0)}</span>
                </div>
              )}
              <hr className="border-brand-border" />
              <div className="flex justify-between font-bold text-base">
                <span className="text-brand-primary">Total</span>
                <span className="text-brand-gold">₹{total}</span>
              </div>
            </div>
            <p className="text-xs text-brand-muted text-center">⚡ Estimated delivery: 10-15 mins</p>
          </div>
        </div>
      </div>
    </div>
  );
}
