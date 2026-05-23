import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDashboard, MdInventory, MdPeople, MdShoppingBag } from 'react-icons/md';
import { FiMenu, FiX, FiLogOut, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';

const navItems = [
  { to: '/admin', icon: MdDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: MdInventory, label: 'Products' },
  { to: '/admin/orders', icon: MdShoppingBag, label: 'Orders' },
  { to: '/admin/users', icon: MdPeople, label: 'Users' },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'w-64' : 'w-64'} flex flex-col h-full`}>
      {/* Logo */}
      <div className="p-6 border-b border-brand-border/50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Quicko Logo" className="w-8 h-8 object-contain rounded-lg" />
          <div>
            <span className="font-display font-bold text-lg text-gold-gradient">Quicko</span>
            <p className="text-xs text-brand-muted">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-gold text-brand-bg shadow-gold'
                  : 'text-brand-secondary hover:text-brand-primary hover:bg-brand-border/30'
              }`
            }
            onClick={() => mobile && setSidebarOpen(false)}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-brand-border/50 space-y-2">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-brand-secondary hover:text-brand-primary hover:bg-brand-border/30 transition-all"
        >
          <FiArrowLeft size={16} />
          Back to Store
        </button>
        <button
          onClick={logoutUser}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-brand-danger hover:bg-brand-danger/10 transition-all"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex bg-brand-surface border-r border-brand-border/50 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full bg-brand-surface border-r border-brand-border/50 z-50 lg:hidden"
            >
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-brand-surface/80 backdrop-blur-sm border-b border-brand-border/50 px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-brand-secondary hover:text-brand-primary"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={20} />
          </button>
          <h1 className="font-display font-semibold text-brand-primary">Admin Dashboard</h1>
          <div className="ml-auto flex items-center gap-2 text-sm text-brand-muted">
            <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
            Live
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
