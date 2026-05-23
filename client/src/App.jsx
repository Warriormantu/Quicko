import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import store from './store';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './store/authSlice';
import { useCart } from './hooks/useCart';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ProtectedRoute, AdminRoute } from './components/layout/RouteGuards';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import CategoryPage from './pages/CategoryPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

// Cart initializer (fetch cart on auth)
const CartInitializer = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { fetchCart } = useCart();
  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);
  return null;
};

// Admin pages don't need the main layout
const ADMIN_PATHS = ['/admin'];
const useIsAdminPath = () => useLocation().pathname.startsWith('/admin');

const AppContent = () => {
  const isAdmin = useIsAdminPath();
  return (
    <>
      <ScrollToTop />
      <CartInitializer />
      {!isAdmin && <Navbar />}
      <main className={!isAdmin ? 'min-h-screen' : ''}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />

          {/* Protected */}
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <Router>
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1A2235',
                color: '#F9FAFB',
                border: '1px solid #1F2D45',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
              },
              success: { iconTheme: { primary: '#10B981', secondary: '#F9FAFB' } },
              error: { iconTheme: { primary: '#F43F5E', secondary: '#F9FAFB' } },
            }}
          />
        </Router>
      </Provider>
    </HelmetProvider>
  );
}
