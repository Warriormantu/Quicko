const Wishlist = require('../models/Wishlist');

const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'title images price discountPrice stock avgRating category');
    if (!wishlist) return res.json({ success: true, products: [] });
    res.json({ success: true, products: wishlist.products });
  } catch (error) {
    next(error);
  }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
      return res.json({ success: true, added: true, message: 'Added to wishlist.' });
    }

    const index = wishlist.products.indexOf(productId);
    if (index === -1) {
      wishlist.products.push(productId);
      await wishlist.save();
      return res.json({ success: true, added: true, message: 'Added to wishlist.' });
    } else {
      wishlist.products.splice(index, 1);
      await wishlist.save();
      return res.json({ success: true, added: false, message: 'Removed from wishlist.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, toggleWishlist };
