import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  discount: 0,
  couponCode: '',
  isOpen: false,
  loading: false,
};

const calculateTotals = (items, discount = 0) => {
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  return { totalItems, totalPrice, finalPrice: Math.max(0, totalPrice - discount) };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      const cart = action.payload;
      state.items = cart.items || [];
      state.couponCode = cart.couponCode || '';
      state.discount = cart.discount || 0;
      const { totalItems, totalPrice } = calculateTotals(state.items, state.discount);
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.discount = 0;
      state.couponCode = '';
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    setDiscount: (state, action) => {
      state.discount = action.payload.discount;
      state.couponCode = action.payload.couponCode;
    },
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setCart, clearCart, toggleCart, openCart, closeCart, setDiscount, setCartLoading } = cartSlice.actions;
export default cartSlice.reducer;
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectCartDiscount = (state) => state.cart.discount;
