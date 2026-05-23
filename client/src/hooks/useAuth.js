import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectToken, selectIsAuthenticated, selectIsAdmin, setCredentials, logout } from '../store/authSlice';
import { clearCart } from '../store/cartSlice';
import { setWishlist } from '../store/wishlistSlice';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  const loginUser = async (credentials) => {
    const data = await authAPI.login(credentials);
    dispatch(setCredentials({ user: data.user, token: data.token }));
    toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! ✨`);
    return data;
  };

  const registerUser = async (userData) => {
    const data = await authAPI.register(userData);
    dispatch(setCredentials({ user: data.user, token: data.token }));
    toast.success(`Welcome to Quicko, ${data.user.name.split(' ')[0]}! 🎉`);
    return data;
  };

  const logoutUser = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(setWishlist([]));
    toast.success('Logged out successfully.');
    navigate('/');
  };

  return { user, token, isAuthenticated, isAdmin, loginUser, registerUser, logoutUser };
};
