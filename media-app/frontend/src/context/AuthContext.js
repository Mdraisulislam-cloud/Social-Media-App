import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateUserProfilePicture = (profilePicture) => {
    setUser(prev => ({ ...prev, profilePicture }));
    const user = JSON.parse(localStorage.getItem('user'));
    user.profilePicture = profilePicture;
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = (token, userData) => {
    login(token, userData);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, updateUserProfilePicture }}>
      {children}
    </AuthContext.Provider>
  );
};
