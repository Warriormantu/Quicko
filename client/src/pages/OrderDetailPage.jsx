import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import { Spinner, Badge } from '../components/ui';

const STATUS_STEPS = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
const STATUS_COLORS = {
  Placed: 'secondary', Confirmed: 'gold', Preparing: 'gold',
  'Out for Delivery': 'gold', Delivered: 'success', Cancelled: 'danger',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!order || order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') return;

    const calculateTimeLeft = () => {
      const createdTime = new Date(order.createdAt).getTime();
      const endTime = createdTime + 15 * 60 * 1000; // 15 minutes window
      const now = Date.now();
      const difference = endTime - now;
      return difference > 0 ? Math.floor(difference / 1000) : 0;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [order]);

  const getCountdownText = () => {
    if (timeLeft <= 0) return 'Arriving any moment...';
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await orderAPI.getOne(id);
        setOrder(data.order);
      } catch { navigate('/orders'); }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-24 flex justify-center"><Spinner /></div>;
  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen pt-20">
      <div className="section-container py-10 max-w-3xl">
        <button onClick={() => navigate('/orders')} className="btn-ghost mb-6">
          <FiArrowLeft size={16} /> Back to Orders
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-primary">Order #{id.slice(-8).toUpperCase()}</h1>
            <p className="text-brand-secondary text-sm">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
          </div>
          <Badge variant={STATUS_COLORS[order.orderStatus] || 'secondary'}>{order.orderStatus}</Badge>
        </div>

        {/* Timeline */}
        {order.orderStatus !== 'Cancelled' && (
          <div className="glass-card p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
              <h2 className="font-semibold text-brand-primary">Order Timeline</h2>
              {order.orderStatus !== 'Delivered' && (
                <div className="bg-brand-gold/10 border border-brand-gold/20 px-3 py-1.5 rounded-xl text-brand-gold text-xs font-bold font-mono flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
                  ⏱️ Est. Delivery: {getCountdownText()}
                </div>
              )}
            </div>
            <div className="flex items-center">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    i <= currentStep ? 'bg-brand-gold text-brand-bg' : 'bg-brand-border text-brand-muted'
                  }`}>
                    {i < currentStep ? <FiCheckCircle size={14} /> : <span className="text-xs">{i + 1}</span>}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-1 rounded-full transition-all ${i < currentStep ? 'bg-brand-gold' : 'bg-brand-border'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {STATUS_STEPS.map((s) => (
                <span key={s} className="text-xs text-brand-muted text-center" style={{ width: `${100 / STATUS_STEPS.length}%` }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-semibold text-brand-primary mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.orderItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4">
                <img src={item.image} alt={item.title} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-brand-primary">{item.title}</p>
                  <p className="text-sm text-brand-muted">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-brand-gold">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Address + Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-brand-primary mb-3">Delivery Address</h3>
            <div className="text-sm text-brand-secondary space-y-1">
              <p className="font-medium text-brand-primary">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold text-brand-primary mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-brand-secondary"><span>Method</span><span>{order.paymentMethod}</span></div>
              <div className="flex justify-between text-brand-secondary"><span>Status</span>
                <Badge variant={order.paymentStatus === 'Paid' ? 'success' : 'secondary'}>{order.paymentStatus}</Badge>
              </div>
              <hr className="border-brand-border" />
              <div className="flex justify-between text-brand-secondary"><span>Subtotal</span><span>₹{order.itemsPrice.toFixed(0)}</span></div>
              <div className="flex justify-between text-brand-secondary"><span>Delivery</span><span className={order.deliveryFee === 0 ? 'text-brand-success' : ''}>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-brand-success"><span>Discount</span><span>-₹{order.discount}</span></div>}
              <hr className="border-brand-border" />
              <div className="flex justify-between font-bold text-brand-primary"><span>Total</span><span className="text-brand-gold">₹{order.totalPrice.toFixed(0)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
