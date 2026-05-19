import { useState, useCallback } from 'react';
import { auth as authApi } from '../lib/api';
import { getUser, setToken, removeToken, isAuthenticated } from '../lib/auth';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = getUser();

  const login = useCallback(async (employeeId: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(employeeId, password);
      setToken(response.token);
      return response.user;
    } catch (err) {
      setError('Invalid credentials');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      removeToken();
    }
  }, []);

  return {
    user,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    loading,
    error,
  };
}