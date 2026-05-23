const Cart = require('../models/Cart');
const Product = require('../models/Product');

const COUPONS = {
  QUICKO10: { discount: 10, type: 'percent' },
  FLAT50: { discount: 50, type: 'flat' },
  PREMIUM20: { discount: 20, type: 'percent' },
};

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title images price discountPrice stock');
    if (!cart) return res.json({ success: true, cart: { items: [], totalPrice: 0, totalItems: 0 } });
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Insufficient stock.' });

    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [{ product: productId, quantity, price }] });
    } else {
      const existingItem = cart.items.find((i) => i.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price });
      }
      await cart.save();
    }

    const populated = await Cart.findById(cart._id).populate('items.product', 'title images price discountPrice stock');
    res.json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/:productId
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const item = cart.items.find((i) => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart.' });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product', 'title images price discountPrice stock');
    res.json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product', 'title images price discountPrice stock');
    res.json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], couponCode: '', discount: 0 });
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply coupon
// @route   POST /api/cart/coupon
const applyCoupon = async (req, res, next) => {
  try {
    const { couponCode } = req.body;
    const coupon = COUPONS[couponCode?.toUpperCase()];
    if (!coupon) return res.status(400).json({ success: false, message: 'Invalid coupon code.' });

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = coupon.type === 'percent' ? (subtotal * coupon.discount) / 100 : coupon.discount;

    cart.couponCode = couponCode.toUpperCase();
    cart.discount = Math.min(discount, subtotal);
    await cart.save();

    res.json({ success: true, message: `Coupon applied! You save ₹${cart.discount.toFixed(2)}`, discount: cart.discount });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyCoupon };
