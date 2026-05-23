import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage, FiSettings, FiMapPin } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import { selectCurrentUser, selectIsAuthenticated, selectIsAdmin } from '../../store/authSlice';
import { selectCartTotalItems, openCart } from '../../store/cartSlice';
import { useAuth } from '../../hooks/useAuth';
import { useScrollPosition } from '../../hooks/useUtils';
import CartDrawer from '../features/CartDrawer';
import logo from '../../assets/logo.png';

const CATEGORIES = ['Fruits & Vegetables', 'Dairy & Eggs', 'Snacks', 'Beverages', 'Bakery', 'Personal Care', 'Instant Foods'];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const cartCount = useSelector(selectCartTotalItems);
  const scrollY = useScrollPosition();
  const { logoutUser } = useAuth();

  const isScrolled = scrollY > 20;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-brand-bg/95 backdrop-blur-md shadow-glass border-b border-brand-border/30' : 'bg-transparent'}`}>
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src={logo} alt="Quicko Logo" className="w-8 h-8 object-contain rounded-lg" />
              <span className="font-display font-bold text-xl text-gold-gradient tracking-wide">Quicko</span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/" className="btn-ghost text-sm">Home</Link>
              <Link to="/products" className="btn-ghost text-sm">Shop</Link>
              <div className="relative group">
                <button className="btn-ghost text-sm">Categories</button>
                <div className="absolute top-full left-0 mt-2 w-56 glass-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 space-y-1">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      to={`/category/${encodeURIComponent(cat)}`}
                      className="block px-3 py-2 text-sm text-brand-secondary hover:text-brand-gold hover:bg-brand-border/30 rounded-lg transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <AnimatePresence>
                {showSearch ? (
                  <motion.form
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '220px' }}
                    exit={{ opacity: 0, width: 0 }}
                    onSubmit={handleSearch}
                    className="hidden md:flex"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="input-field py-2 text-sm"
                      onBlur={() => !searchQuery && setShowSearch(false)}
                    />
                  </motion.form>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="hidden md:flex btn-ghost p-2"
                    aria-label="Search"
                  >
                    <FiSearch size={18} />
                  </button>
                )}
              </AnimatePresence>

              {/* Mobile Search */}
              <button
                onClick={() => navigate('/search')}
                className="md:hidden btn-ghost p-2"
                aria-label="Search"
              >
                <FiSearch size={18} />
              </button>

              {/* Wishlist */}
              {isAuthenticated && (
                <Link to="/wishlist" className="btn-ghost p-2" aria-label="Wishlist">
                  <FiHeart size={18} />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => dispatch(openCart())}
                className="btn-ghost p-2 relative"
                aria-label="Cart"
              >
                <FiShoppingCart size={18} />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold text-brand-bg text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 btn-ghost p-2"
                    aria-label="User menu"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-brand-gold/30" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center">
                        <span className="text-brand-gold text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-52 glass-card p-2 space-y-1"
                        onMouseLeave={() => setShowUserMenu(false)}
                      >
                        <div className="px-3 py-2 border-b border-brand-border mb-2">
                          <p className="text-sm font-semibold text-brand-primary">{user?.name}</p>
                          <p className="text-xs text-brand-muted">{user?.email}</p>
                        </div>
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors">
                            <MdDashboard size={16} /> Admin Dashboard
                          </Link>
                        )}
                        <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-brand-secondary hover:text-brand-primary hover:bg-brand-border/30 rounded-lg transition-colors">
                          <FiUser size={16} /> My Profile
                        </Link>
                        <Link to="/orders" className="flex items-center gap-2 px-3 py-2 text-sm text-brand-secondary hover:text-brand-primary hover:bg-brand-border/30 rounded-lg transition-colors">
                          <FiPackage size={16} /> My Orders
                        </Link>
                        <Link to="/wishlist" className="flex items-center gap-2 px-3 py-2 text-sm text-brand-secondary hover:text-brand-primary hover:bg-brand-border/30 rounded-lg transition-colors">
                          <FiHeart size={16} /> Wishlist
                        </Link>
                        <hr className="border-brand-border my-1" />
                        <button
                          onClick={logoutUser}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brand-danger hover:bg-brand-danger/10 rounded-lg transition-colors"
                        >
                          <FiLogOut size={16} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="btn-gold py-2 px-4 text-sm hidden sm:inline-flex">
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden btn-ghost p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-brand-surface/95 backdrop-blur-md border-t border-brand-border/30 overflow-hidden"
            >
              <div className="section-container py-4 space-y-2">
                <form onSubmit={handleSearch} className="mb-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="input-field"
                  />
                </form>
                <Link to="/" className="block py-2 text-brand-secondary hover:text-brand-primary">Home</Link>
                <Link to="/products" className="block py-2 text-brand-secondary hover:text-brand-primary">All Products</Link>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    to={`/category/${encodeURIComponent(cat)}`}
                    className="block py-2 pl-4 text-sm text-brand-muted hover:text-brand-gold"
                  >
                    {cat}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Link to="/login" className="btn-gold w-full justify-center mt-3">Sign In</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
