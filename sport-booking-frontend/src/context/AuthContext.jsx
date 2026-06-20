import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { userService } from '../features/user/services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const res = await userService.getMe();

      if (res.data.code === 0) {
        setUser(res.data.result);
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    loadProfile().finally(() => {
      setLoading(false);
    });
  }, []);

  const loginContext = async (token) => {
    localStorage.setItem('token', token);

    const role = jwtDecode(token).role;

    await loadProfile();

    return role;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginContext,
        logout,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};