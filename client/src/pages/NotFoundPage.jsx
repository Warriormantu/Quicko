import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="font-display text-[120px] font-black text-gold-gradient leading-none">404</div>
        <h1 className="font-display text-3xl font-bold text-brand-primary">Page Not Found</h1>
        <p className="text-brand-secondary max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-gold inline-flex">
          <FiArrowLeft size={16} /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
