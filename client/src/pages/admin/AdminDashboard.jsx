import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import AdminLayout from '../../components/layout/AdminLayout';
import { userAPI } from '../../services/api';
import { Spinner, Badge } from '../../components/ui';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="glass-card p-5">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
    <p className="text-2xl font-display font-black text-brand-primary">{value}</p>
    <p className="text-sm text-brand-secondary mt-1">{label}</p>
    {sub && <p className="text-xs text-brand-muted mt-0.5">{sub}</p>}
  </div>
);

const STATUS_COLORS = {
  Placed: 'secondary', Confirmed: 'gold', Preparing: 'warning',
  'Out for Delivery': 'warning', Delivered: 'success', Cancelled: 'danger',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await userAPI.getDashboard();
        setStats(data);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </AdminLayout>
  );

  const chartData = stats?.monthlyRevenue?.map((d) => ({
    name: MONTHS[(d._id.month - 1)],
    revenue: Math.round(d.revenue),
    orders: d.orders,
  })) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FiDollarSign} label="Total Revenue" value={`₹${((stats?.stats?.totalRevenue || 0) / 1000).toFixed(1)}K`} color="bg-brand-gold/30" />
          <StatCard icon={FiShoppingBag} label="Total Orders" value={stats?.stats?.totalOrders || 0} color="bg-blue-500/30" />
          <StatCard icon={FiUsers} label="Total Users" value={stats?.stats?.totalUsers || 0} color="bg-emerald-500/30" />
          <StatCard icon={FiPackage} label="Total Products" value={stats?.stats?.totalProducts || 0} color="bg-purple-500/30" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="font-display font-bold text-brand-primary mb-4">Revenue (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2D45" />
                <XAxis dataKey="name" stroke="#4B5563" tick={{ fontSize: 12 }} />
                <YAxis stroke="#4B5563" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1A2235', border: '1px solid #1F2D45', borderRadius: '12px', color: '#F9FAFB' }} />
                <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-display font-bold text-brand-primary mb-4">Orders per Month</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2D45" />
                <XAxis dataKey="name" stroke="#4B5563" tick={{ fontSize: 12 }} />
                <YAxis stroke="#4B5563" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1A2235', border: '1px solid #1F2D45', borderRadius: '12px', color: '#F9FAFB' }} />
                <Bar dataKey="orders" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="glass-card p-5">
            <h3 className="font-display font-bold text-brand-primary mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {stats?.recentOrders?.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 rounded-xl bg-brand-border/20">
                  <div>
                    <p className="text-sm font-medium text-brand-primary">#{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-brand-muted">{order.user?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_COLORS[order.orderStatus] || 'secondary'}>{order.orderStatus}</Badge>
                    <span className="text-sm font-bold text-brand-gold">₹{order.totalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock */}
          <div className="glass-card p-5">
            <h3 className="font-display font-bold text-brand-primary mb-4 flex items-center gap-2">
              <FiAlertTriangle className="text-brand-warning" /> Low Stock Alerts
            </h3>
            <div className="space-y-3">
              {stats?.lowStockProducts?.length === 0 ? (
                <p className="text-brand-muted text-sm">All products have sufficient stock ✅</p>
              ) : (
                stats?.lowStockProducts?.map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-brand-warning/10">
                    <p className="text-sm text-brand-primary">{p.title}</p>
                    <span className={`badge ${p.stock === 0 ? 'badge-danger' : 'bg-brand-warning/20 text-brand-warning'}`}>
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
