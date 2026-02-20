import { useAuthStore } from '@/store';
import api from './api';

/**
 * Validate if current token is still valid
 */
export const validateToken = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.success;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Check auth and logout if invalid
 */
export const checkAuthStatus = async () => {
  const token = useAuthStore.getState().token;

  if (token) {
    const isValid = await validateToken();
    if (!isValid) {
      useAuthStore.getState().logout();
    }
  }
};
