import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ id, label, icon: Icon, type = 'text', placeholder, field, extra }) => (
    <div>
      <label className="text-sm text-brand-secondary mb-2 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
        <input
          id={id}
          type={type}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className="input-field pl-11 pr-11"
          placeholder={placeholder}
          required={field !== 'phone'}
        />
        {extra}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-bg" />
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={logo} alt="Quicko Logo" className="w-10 h-10 object-contain rounded-xl" />
            <span className="font-display font-bold text-2xl text-gold-gradient">Quicko</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-brand-primary mb-2">Create Account</h1>
          <p className="text-brand-secondary">Join the premium delivery experience</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field id="name" label="Full Name" icon={FiUser} placeholder="Your full name" field="name" />
            <Field id="reg-email" label="Email" icon={FiMail} type="email" placeholder="you@example.com" field="email" />
            <Field id="phone" label="Phone (Optional)" icon={FiPhone} type="tel" placeholder="+91 98765 43210" field="phone" />

            <div>
              <label className="text-sm text-brand-secondary mb-2 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-11 pr-11"
                  placeholder="Min 6 characters"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted">
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-brand-secondary mb-2 block">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                <input
                  id="confirm-password"
                  type="password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="input-field pl-11"
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3.5 text-base mt-2">
              {loading ? <Spinner size="sm" color="white" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-brand-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-gold hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
