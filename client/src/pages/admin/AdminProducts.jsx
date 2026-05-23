import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { productAPI } from '../../services/api';
import { Modal, Spinner, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

const CATEGORIES = ['Fruits & Vegetables', 'Dairy & Eggs', 'Snacks', 'Beverages', 'Bakery', 'Personal Care', 'Instant Foods'];
const EMPTY_FORM = { title: '', description: '', category: 'Snacks', price: '', discountPrice: '', stock: '', unit: 'pc', images: '', featured: false, trending: false, deliveryTime: '10-15 mins' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productAPI.getAll({ search, page, limit: 15 });
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [search, page]);

  const openCreate = () => { setEditProduct(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ title: p.title, description: p.description, category: p.category, price: p.price, discountPrice: p.discountPrice || '', stock: p.stock, unit: p.unit, images: p.images?.join(', ') || '', featured: p.featured, trending: p.trending, deliveryTime: p.deliveryTime });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice) || 0,
        stock: Number(form.stock),
        images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      if (editProduct) {
        const data = await productAPI.update(editProduct._id, payload);
        setProducts((prev) => prev.map((p) => p._id === editProduct._id ? data.product : p));
        toast.success('Product updated!');
      } else {
        const data = await productAPI.create(payload);
        setProducts((prev) => [data.product, ...prev]);
        toast.success('Product created!');
      }
      setModalOpen(false);
    } catch (e) { toast.error(e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch (e) { toast.error(e.message); }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-primary">Products</h2>
            <p className="text-brand-secondary text-sm">{total} total products</p>
          </div>
          <button onClick={openCreate} className="btn-gold">
            <FiPlus size={16} /> Add Product
          </button>
        </div>

        <div className="relative max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..." className="input-field pl-9 py-2 text-sm" />
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-brand-border/50">
                <tr className="text-brand-muted text-xs uppercase">
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right hidden sm:table-cell">Stock</th>
                  <th className="px-4 py-3 text-center hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-brand-border/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt={p.title} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                        <span className="font-medium text-brand-primary line-clamp-1">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-brand-secondary">{p.category}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-brand-gold font-semibold">₹{p.discountPrice || p.price}</div>
                      {p.discountPrice > 0 && <div className="text-xs text-brand-muted line-through">₹{p.price}</div>}
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      <span className={p.stock === 0 ? 'text-brand-danger' : p.stock < 10 ? 'text-brand-warning' : 'text-brand-secondary'}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <div className="flex justify-center gap-1 flex-wrap">
                        {p.featured && <Badge variant="gold">Featured</Badge>}
                        {p.trending && <Badge variant="danger">Trending</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="text-brand-muted hover:text-brand-gold transition-colors"><FiEdit2 size={14} /></button>
                        <button onClick={() => handleDelete(p._id)} className="text-brand-muted hover:text-brand-danger transition-colors"><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Product Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editProduct ? 'Edit Product' : 'Add Product'} size="lg">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-brand-secondary mb-1 block">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field py-2 text-sm" required />
              </div>
              <div>
                <label className="text-xs text-brand-secondary mb-1 block">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field py-2 text-sm">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-brand-secondary mb-1 block">Unit</label>
                <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input-field py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-brand-secondary mb-1 block">Price (₹) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field py-2 text-sm" required />
              </div>
              <div>
                <label className="text-xs text-brand-secondary mb-1 block">Discount Price (₹)</label>
                <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-brand-secondary mb-1 block">Stock *</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field py-2 text-sm" required />
              </div>
              <div>
                <label className="text-xs text-brand-secondary mb-1 block">Delivery Time</label>
                <input value={form.deliveryTime} onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })} className="input-field py-2 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-brand-secondary mb-1 block">Image URLs (comma-separated)</label>
                <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="input-field py-2 text-sm" placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-brand-secondary mb-1 block">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field py-2 text-sm h-20 resize-none" required />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-brand-secondary">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-brand-gold" />
                  Featured
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-brand-secondary">
                  <input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} className="accent-brand-gold" />
                  Trending
                </label>
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-gold w-full justify-center">
              {saving ? <Spinner size="sm" color="white" /> : editProduct ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
