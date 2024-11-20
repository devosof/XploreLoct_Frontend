import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../services/api';
import useStore from '../store/useStore';

export default function useAuth() {
  const navigate = useNavigate();
  const { setUser, setAccessToken, user, logout: storeLogout } = useStore();

  const hasRole = useCallback((roleToCheck) => {
    return user?.role?.includes(roleToCheck) || false;
  }, [user]);

  const login = useCallback(
    async (credentials) => {
      try {
        const { data } = await auth.login(credentials);
        setUser(data.data.user);
        setAccessToken(data.data.accessToken);
        toast.success('Successfully logged in!');
        navigate('/');
      } catch (error) {
        toast.error('Failed to login. Please check your credentials.');
        throw error;
      }
    },
    [navigate, setUser, setAccessToken]
  );

  const register = useCallback(
    async (userData) => {
      try {
        const { data } = await auth.register(userData);
        setUser(data.user);
        setAccessToken(data.accessToken);
        toast.success('Successfully registered!');
        navigate('/');
      } catch (error) {
        toast.error('Failed to register. Please try again.');
        throw error;
      }
    },
    [navigate, setUser, setAccessToken]
  );

  const logout = useCallback(async () => {
    try {
      await auth.logout();
      storeLogout();
      toast.success('Successfully logged out!');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout.');
      throw error;
    }
  }, [navigate, storeLogout]);

  return {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isOrganizer: hasRole('organizer'),
    isSpeaker: hasRole('speaker'),
    isAdmin: hasRole('admin'),
    hasRole
  };
}