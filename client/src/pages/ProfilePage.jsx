import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiPhone, FiMail, FiMapPin, FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';
import { updateUser } from '../store/authSlice';
import { userAPI } from '../services/api';
import { Spinner } from '../components/ui';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: 'Home', fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '', isDefault: false });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await userAPI.updateProfile(form);
      dispatch(updateUser(data.user));
      toast.success('Profile updated!');
    } catch (e) { toast.error(e.message); }
    setSaving(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const data = await userAPI.addAddress(newAddr);
      setAddresses(data.addresses);
      setShowAddAddress(false);
      setNewAddr({ label: 'Home', fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '', isDefault: false });
      toast.success('Address added!');
    } catch (e) { toast.error(e.message); }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const data = await userAPI.deleteAddress(addressId);
      setAddresses(data.addresses);
      toast.success('Address removed');
    } catch (e) { toast.error(e.message); }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="section-container py-10 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-brand-primary mb-8">My Profile</h1>

        {/* Avatar */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gold-gradient flex items-center justify-center">
              <span className="font-display font-black text-3xl text-brand-bg">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-brand-primary">{user?.name}</h2>
              <p className="text-brand-secondary text-sm">{user?.email}</p>
              <span className="badge-gold mt-1 inline-block capitalize">{user?.role}</span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-brand-secondary mb-1 block">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-10 py-2.5" />
                </div>
              </div>
              <div>
                <label className="text-sm text-brand-secondary mb-1 block">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-10 py-2.5" />
                </div>
              </div>
            </div>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
              <input value={user?.email} readOnly className="input-field pl-10 py-2.5 opacity-60 cursor-not-allowed" />
            </div>
            <button type="submit" disabled={saving} className="btn-gold">
              {saving ? <Spinner size="sm" color="white" /> : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Addresses */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-brand-primary flex items-center gap-2"><FiMapPin className="text-brand-gold" /> Addresses</h2>
            <button onClick={() => setShowAddAddress(!showAddAddress)} className="btn-outline-gold text-sm py-2 px-4">
              <FiPlus size={14} /> Add New
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="glass-card p-4 mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={newAddr.fullName} onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })} placeholder="Full Name" className="input-field py-2 text-sm" required />
                <input value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} placeholder="Phone" className="input-field py-2 text-sm" />
              </div>
              <input value={newAddr.addressLine1} onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })} placeholder="Address Line 1" className="input-field py-2 text-sm" required />
              <div className="grid grid-cols-3 gap-3">
                <input value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} placeholder="City" className="input-field py-2 text-sm" required />
                <input value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} placeholder="State" className="input-field py-2 text-sm" required />
                <input value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} placeholder="Pincode" className="input-field py-2 text-sm" required />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-gold text-sm py-2">Save Address</button>
                <button type="button" onClick={() => setShowAddAddress(false)} className="btn-ghost text-sm">Cancel</button>
              </div>
            </form>
          )}

          {addresses.length === 0 ? (
            <p className="text-brand-muted text-sm">No saved addresses yet.</p>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr._id} className="flex items-start justify-between p-4 rounded-xl border border-brand-border/50 hover:border-brand-gold/20 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-gold text-xs">{addr.label}</span>
                      {addr.isDefault && <span className="badge-success text-xs">Default</span>}
                    </div>
                    <p className="text-sm font-medium text-brand-primary">{addr.fullName}</p>
                    <p className="text-xs text-brand-secondary">{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-xs text-brand-muted">{addr.phone}</p>
                  </div>
                  <button onClick={() => handleDeleteAddress(addr._id)} className="text-brand-muted hover:text-brand-danger transition-colors ml-4">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
