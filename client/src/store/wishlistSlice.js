import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
    toggleWishlistItem: (state, action) => {
      const productId = action.payload;
      const index = state.items.findIndex((id) => id === productId || id?._id === productId);
      if (index === -1) {
        state.items.push(productId);
      } else {
        state.items.splice(index, 1);
      }
    },
    setWishlistLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setWishlist, toggleWishlistItem, setWishlistLoading } = wishlistSlice.actions;
export default wishlistSlice.reducer;
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.items.some((id) => (id?._id || id) === productId);
