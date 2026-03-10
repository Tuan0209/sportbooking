import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import AdminLayout from '../layouts/AdminLayout'; // Import layout mới

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // Nên có loading indicator

  return (
    <Routes>
      {/* 1. Trang điều hướng gốc (/) */}
      <Route 
        path="/" 
        element={
          user ? (
            user.role === 'ADMIN' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        } 
      />

      {/* 2. Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

      {/* 3. Admin Routes */}
      {user?.role === 'ADMIN' && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<div>Thống kê Admin</div>} />
          <Route path="users" element={<div>Quản lý người dùng</div>} />
          <Route path="fields" element={<div>Quản lý sân bóng</div>} />
          <Route path="bookings" element={<div>Quản lý lịch đặt</div>} />
        </Route>
      )}

      {/* 4. User Routes */}
      {user?.role === 'USER' && (
        <Route path="/user" element={<AdminLayout />}>
          <Route path="dashboard" element={<div>Chào mừng bạn đến với AlooBo!</div>} />
          <Route path="fields" element={<div>Danh sách sân bóng</div>} />
          <Route path="profile" element={<div>Trang cá nhân</div>} />
        </Route>
      )}

      {/* 5. Catch All - Tránh dùng Navigate trực tiếp nếu không chắc chắn */}
      <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;