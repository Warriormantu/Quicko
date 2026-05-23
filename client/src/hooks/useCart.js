import { useSelector, useDispatch } from 'react-redux';
import { setCart, clearCart as clearCartState, openCart, setDiscount } from '../store/cartSlice';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice, discount, couponCode, isOpen, loading } = useSelector((s) => s.cart);

  const fetchCart = async () => {
    try {
      const data = await cartAPI.get();
      dispatch(setCart(data.cart));
    } catch {}
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const data = await cartAPI.add(productId, quantity);
      dispatch(setCart(data.cart));
      dispatch(openCart());
      toast.success('Added to cart! 🛒');
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const data = await cartAPI.update(productId, quantity);
      dispatch(setCart(data.cart));
    } catch (err) {
      toast.error(err.message || 'Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      const data = await cartAPI.remove(productId);
      dispatch(setCart(data.cart));
      toast.success('Removed from cart');
    } catch (err) {
      toast.error(err.message || 'Failed to remove item');
    }
  };

  const clearCartItems = async () => {
    try {
      await cartAPI.clear();
      dispatch(clearCartState());
    } catch {}
  };

  const applyCoupon = async (code) => {
    const data = await cartAPI.applyCoupon(code);
    dispatch(setDiscount({ discount: data.discount, couponCode: code }));
    toast.success(data.message);
    return data;
  };

  const finalPrice = Math.max(0, totalPrice - discount);
  const deliveryFee = totalPrice > 500 ? 0 : 29;

  return {
    items, totalItems, totalPrice, discount, couponCode, isOpen, loading,
    finalPrice, deliveryFee,
    fetchCart, addToCart, updateQuantity, removeItem, clearCartItems, applyCoupon,
  };
};
