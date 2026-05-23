import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiArrowLeft, FiStar, FiPackage, FiTruck, FiShield } from 'react-icons/fi';
import { AiFillHeart, AiFillStar } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { productAPI, wishlistAPI } from '../services/api';
import { useCart } from '../hooks/useCart';
import { toggleWishlistItem, selectIsWishlisted } from '../store/wishlistSlice';
import { selectIsAuthenticated } from '../store/authSlice';
import ProductCard from '../components/features/ProductCard';
import { Spinner, Skeleton, Badge, StarRating } from '../components/ui';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [adding, setAdding] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isWishlisted = useSelector(selectIsWishlisted(id));
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pd, rel] = await Promise.all([
          productAPI.getOne(id),
          productAPI.getRelated(id),
        ]);
        setProduct(pd.product);
        setRelated(rel.products || []);
      } catch { navigate('/products'); }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return toast.error('Please login to add to cart');
    setAdding(true);
    await addToCart(product._id, quantity);
    setAdding(false);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return toast.error('Please login');
    try {
      await wishlistAPI.toggle(product._id);
      dispatch(toggleWishlistItem(product._id));
    } catch (e) { toast.error(e.message); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to review');
    setSubmittingReview(true);
    try {
      const data = await productAPI.addReview(id, review);
      setProduct(data.product);
      setReview({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (e) { toast.error(e.message); }
    setSubmittingReview(false);
  };

  if (loading) return (
    <div className="min-h-screen pt-24 section-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="skeleton h-96 rounded-3xl" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-5 w-1/2" />
          <div className="skeleton h-10 w-1/3" />
          <div className="skeleton h-24" />
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discountPct = product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div className="min-h-screen pt-20">
      <div className="section-container py-8">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6">
          <FiArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl overflow-hidden h-96 bg-brand-surface"
            >
              <img
                src={product.images?.[activeImg] || product.images?.[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-brand-gold' : 'border-brand-border'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.trending && <Badge variant="gold">🔥 Trending</Badge>}
                {discountPct > 0 && <Badge variant="danger">-{discountPct}%</Badge>}
              </div>
              <h1 className="font-display text-3xl font-bold text-brand-primary mb-2">{product.title}</h1>
              <StarRating rating={product.avgRating} count={product.numReviews} size="md" />
            </div>

            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-black text-brand-gold">₹{displayPrice}</span>
              {product.discountPrice > 0 && (
                <span className="text-xl text-brand-muted line-through">₹{product.price}</span>
              )}
              <span className="text-brand-secondary text-sm">/ {product.unit}</span>
            </div>

            <p className="text-brand-secondary leading-relaxed">{product.description}</p>

            {/* Meta */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: FiTruck, label: product.deliveryTime },
                { icon: FiPackage, label: product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock' },
                { icon: FiShield, label: 'Quality Assured' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="glass-card p-3 text-center">
                  <Icon className="mx-auto text-brand-gold mb-1" size={16} />
                  <p className="text-xs text-brand-secondary">{label}</p>
                </div>
              ))}
            </div>

            {/* Quantity + Actions */}
            {product.stock > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 glass-card px-4 py-2">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="text-brand-muted hover:text-brand-primary">−</button>
                  <span className="w-6 text-center font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="text-brand-muted hover:text-brand-primary">+</button>
                </div>
                <button onClick={handleAddToCart} disabled={adding} className="btn-gold flex-1 justify-center py-3">
                  {adding ? <Spinner size="sm" color="white" /> : <><FiShoppingCart /> Add to Cart</>}
                </button>
                <button onClick={handleWishlist} className={`p-3 glass-card rounded-xl transition-colors ${isWishlisted ? 'text-brand-danger' : 'text-brand-muted hover:text-brand-danger'}`}>
                  {isWishlisted ? <AiFillHeart size={20} /> : <FiHeart size={20} />}
                </button>
              </div>
            ) : (
              <div className="p-4 glass-card text-center text-brand-muted">This product is currently out of stock</div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-primary mb-6">Customer Reviews</h2>
            {product.reviews?.length === 0 ? (
              <p className="text-brand-muted">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {product.reviews?.map((r) => (
                  <div key={r._id} className="glass-card p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center">
                        <span className="text-brand-gold text-xs font-bold">{r.name?.[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-primary">{r.name}</p>
                        <StarRating rating={r.rating} size="sm" showValue={false} />
                      </div>
                    </div>
                    <p className="text-sm text-brand-secondary">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div>
              <h2 className="font-display text-2xl font-bold text-brand-primary mb-6">Write a Review</h2>
              <form onSubmit={handleReviewSubmit} className="glass-card p-5 space-y-4">
                <div>
                  <label className="text-sm text-brand-secondary mb-2 block">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} type="button" onClick={() => setReview((r) => ({ ...r, rating: s }))}>
                        {s <= review.rating ? <AiFillStar className="text-brand-gold" size={24} /> : <FiStar className="text-brand-muted" size={24} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-brand-secondary mb-2 block">Comment</label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))}
                    className="input-field h-28 resize-none"
                    placeholder="Share your experience..."
                    required
                  />
                </div>
                <button type="submit" disabled={submittingReview} className="btn-gold w-full justify-center">
                  {submittingReview ? <Spinner size="sm" color="white" /> : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-brand-primary mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {related.slice(0, 4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
