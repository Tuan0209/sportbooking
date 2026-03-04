import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';

// 1. Route dành cho những trang CHỈ truy cập khi CHƯA đăng nhập (Login, Register)
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // Đợi kiểm tra token xong

  if (user) {
    // Nếu đã login rồi thì tự động điều hướng về dashboard theo role
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

// 2. Route dành cho những trang BẮT BUỘC phải đăng nhập
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) {
    // Chưa login thì trả về trang login
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Sai quyền (ví dụ User đòi vào trang Admin) thì đẩy về trang chủ của họ
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Bao bọc Login và Register bằng PublicRoute */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />

      {/* Các route bảo vệ cho User */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <div className="p-10 text-2xl font-bold text-green-700">
              Chào mừng khách hàng quay trở lại!
            </div>
          </ProtectedRoute>
        } 
      />

      {/* Các route bảo vệ cho Admin */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute role="ADMIN">
            <div className="p-10 text-2xl font-bold text-red-700">
              Khu vực quản trị hệ thống
            </div>
          </ProtectedRoute>
        } 
      />

      {/* Điều hướng mặc định */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div className="p-10 text-center text-xl">404 - Trang không tồn tại</div>} />
    </Routes>
  );
};

export default AppRoutes;