import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { orderAPI } from '../../services/api';
import { Modal, Spinner, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Placed: 'secondary', Confirmed: 'gold', Preparing: 'warning',
  'Out for Delivery': 'warning', Delivered: 'success', Cancelled: 'danger',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await orderAPI.getAll({ page, limit: 15, status: statusFilter });
        setOrders(data.orders || []);
        setTotal(data.total || 0);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, [page, statusFilter]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !updatingStatus) return;
    setSaving(true);
    try {
      const data = await orderAPI.updateStatus(selectedOrder._id, { orderStatus: updatingStatus, note });
      setOrders((prev) => prev.map((o) => o._id === selectedOrder._id ? { ...o, orderStatus: updatingStatus } : o));
      setSelectedOrder(null);
      toast.success('Order status updated!');
    } catch (e) { toast.error(e.message); }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-primary">Orders</h2>
            <p className="text-brand-secondary text-sm">{total} total orders</p>
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field py-2 text-sm w-auto">
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-brand-border/50">
                <tr className="text-brand-muted text-xs uppercase">
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Customer</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-brand-border/10 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-brand-secondary">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-brand-primary">{order.user?.name || 'N/A'}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-brand-secondary text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3 text-right font-bold text-brand-gold">₹{order.totalPrice}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={STATUS_COLORS[order.orderStatus] || 'secondary'}>{order.orderStatus}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => { setSelectedOrder(order); setUpdatingStatus(order.orderStatus); setNote(''); }}
                        className="text-brand-gold text-xs hover:underline"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Update Order Status" size="sm">
          {selectedOrder && (
            <div className="space-y-4">
              <p className="text-sm text-brand-secondary">Order #{selectedOrder._id.slice(-8).toUpperCase()}</p>
              <div>
                <label className="text-xs text-brand-secondary mb-1 block">New Status</label>
                <select value={updatingStatus} onChange={(e) => setUpdatingStatus(e.target.value)} className="input-field py-2 text-sm">
                  {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-brand-secondary mb-1 block">Note (optional)</label>
                <input value={note} onChange={(e) => setNote(e.target.value)} className="input-field py-2 text-sm" placeholder="Internal note..." />
              </div>
              <button onClick={handleStatusUpdate} disabled={saving} className="btn-gold w-full justify-center">
                {saving ? <Spinner size="sm" color="white" /> : 'Update Status'}
              </button>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
