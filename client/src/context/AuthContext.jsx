import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'member' | 'admin' | null
  const [loading, setLoading] = useState(true);

  // Check existing session on load
  const checkAuth = async () => {
    const savedRole = localStorage.getItem('shivaji_role');
    const token = localStorage.getItem('shivaji_token');

    if (!savedRole && !token) {
      setLoading(false);
      return;
    }

    try {
      if (savedRole === 'admin') {
        const res = await api.get('/api/admin/me');
        if (res.data.success) {
          setUser(res.data.user);
          setRole('admin');
        }
      } else if (savedRole === 'member') {
        const res = await api.get('/api/member/me');
        if (res.data.success) {
          setUser(res.data.member);
          setRole('member');
        }
      }
    } catch (err) {
      console.warn('Session verification failed:', err.response?.data?.message || err.message);
      // Clear expired credentials
      localStorage.removeItem('shivaji_token');
      localStorage.removeItem('shivaji_role');
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (selectedRole, credentials) => {
    const endpoint = selectedRole === 'admin' ? '/api/admin/login' : '/api/member/login';
    const res = await api.post(endpoint, credentials);

    if (res.data.success) {
      setUser(res.data.user);
      setRole(res.data.role || selectedRole);
      if (res.data.token) {
        localStorage.setItem('shivaji_token', res.data.token);
      }
      localStorage.setItem('shivaji_role', res.data.role || selectedRole);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await api.post('/api/register', formData);
    if (res.data.success) {
      setUser(res.data.user);
      setRole('member');
      if (res.data.token) {
        localStorage.setItem('shivaji_token', res.data.token);
      }
      localStorage.setItem('shivaji_role', 'member');
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      if (role === 'admin') {
        await api.post('/api/admin/logout');
      } else {
        await api.post('/api/member/logout');
      }
    } catch (e) {
      // ignore network logout errors
    } finally {
      localStorage.removeItem('shivaji_token');
      localStorage.removeItem('shivaji_role');
      setUser(null);
      setRole(null);
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
