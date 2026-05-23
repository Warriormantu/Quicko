import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import logo from '../../assets/logo.png';

const footerLinks = {
  Shop: [
    { label: 'All Products', to: '/products' },
    { label: 'Fruits & Vegetables', to: '/category/Fruits%20%26%20Vegetables' },
    { label: 'Dairy & Eggs', to: '/category/Dairy%20%26%20Eggs' },
    { label: 'Snacks', to: '/category/Snacks' },
    { label: 'Beverages', to: '/category/Beverages' },
  ],
  Account: [
    { label: 'My Profile', to: '/profile' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'Login', to: '/login' },
    { label: 'Register', to: '/register' },
  ],
  Company: [
    { label: 'About Us', to: '#' },
    { label: 'Careers', to: '#' },
    { label: 'Blog', to: '#' },
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border/50 mt-20">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Quicko Logo" className="w-8 h-8 object-contain rounded-lg" />
              <span className="font-display font-bold text-xl text-gold-gradient">Quicko</span>
            </div>
            <p className="text-brand-secondary text-sm leading-relaxed mb-6 max-w-xs">
              Groceries Delivered Faster Than Ever. Premium groceries and essentials delivered to your door in minutes.
            </p>
            <div className="space-y-2 text-sm text-brand-secondary">
              <div className="flex items-center gap-2">
                <FiMail size={14} className="text-brand-gold" />
                <span>support@quicko.com</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone size={14} className="text-brand-gold" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin size={14} className="text-brand-gold" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 glass-card flex items-center justify-center text-brand-muted hover:text-brand-gold hover:border-brand-gold/30 transition-all duration-200 rounded-xl"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-brand-primary mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-brand-secondary hover:text-brand-gold transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="gold-divider my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-brand-muted">
          <p>© 2026 Quicko. All rights reserved. Groceries Delivered Faster Than Ever.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
