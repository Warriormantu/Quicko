const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Fruits & Vegetables',
        'Dairy & Eggs',
        'Snacks',
        'Beverages',
        'Bakery',
        'Personal Care',
        'Instant Foods',
      ],
    },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'pc' },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    tags: [String],
    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    deliveryTime: { type: String, default: '10-15 mins' },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text', tags: 'text' });

productSchema.methods.calculateRatings = function () {
  if (this.reviews.length === 0) {
    this.avgRating = 0;
    this.numReviews = 0;
  } else {
    const total = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.avgRating = Math.round((total / this.reviews.length) * 10) / 10;
    this.numReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
