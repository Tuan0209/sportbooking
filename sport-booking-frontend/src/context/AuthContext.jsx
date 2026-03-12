import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setUser(jwtDecode(token)); // Giải mã token để lấy thông tin người dùng và lưu vào state
      } catch {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const loginContext = (token) => { 
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser(decoded);  
    return decoded.role;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginContext, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};