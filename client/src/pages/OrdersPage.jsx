import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiArrowRight, FiClock } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import { Spinner, EmptyState, Badge } from '../components/ui';

const STATUS_COLORS = {
  Placed: 'secondary', Confirmed: 'info', Preparing: 'warning',
  'Out for Delivery': 'warning', Delivered: 'success', Cancelled: 'danger',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getMine();
        setOrders(data.orders || []);
      } catch {}
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="min-h-screen pt-24 flex justify-center"><Spinner /></div>;

  return (
    <div className="min-h-screen pt-20">
      <div className="section-container py-10">
        <h1 className="font-display text-3xl font-bold text-brand-primary mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No orders yet"
            description="Your luxury deliveries will appear here"
            action={<Link to="/products" className="btn-gold">Start Shopping</Link>}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card-hover p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-brand-muted mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-brand-secondary">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={STATUS_COLORS[order.orderStatus] || 'secondary'}>{order.orderStatus}</Badge>
                    <span className="font-bold text-brand-gold">₹{order.totalPrice.toFixed(0)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex -space-x-2">
                    {order.orderItems.slice(0, 3).map((item) => (
                      <img key={item._id} src={item.image} alt={item.title} className="w-10 h-10 rounded-xl object-cover border-2 border-brand-surface" />
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="w-10 h-10 rounded-xl bg-brand-border flex items-center justify-center text-xs font-bold text-brand-secondary border-2 border-brand-surface">
                        +{order.orderItems.length - 3}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-brand-primary">{order.orderItems[0]?.title} {order.orderItems.length > 1 ? `+${order.orderItems.length - 1} more` : ''}</p>
                    <p className="text-xs text-brand-muted">{order.orderItems.reduce((a, i) => a + i.quantity, 0)} items · {order.paymentMethod}</p>
                  </div>
                </div>

                <Link to={`/orders/${order._id}`} className="btn-ghost text-sm">
                  View Details <FiArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
