import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Profile from '../features/user/pages/Profile';
import AdminLayout from '../layouts/AdminLayout';
import UserLayout from '../layouts/UserLayout'; // Import Layout người dùng mới

import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import UserVenueHome from '../features/venue/pages/user/UserVenueHome';
import ManageUsers from '../features/user/pages/admin/ManageUsers';
import ManageFields from '../features/field/pages/admin/ManageFields';
import ManageFieldTypes from '../features/field/pages/admin/ManageFieldTypes';
import ManageAreas from '../features/field/pages/admin/ManageAreas';
import ManageVenues from '../features/venue/pages/admin/ManageVenues';
import VenueDetail from '../features/venue/pages/admin/VenueDetail';  
import UserFieldBooking from '../features/booking/pages/UserFieldBooking';
import BookingConfirm from '../features/booking/pages/BookingConfirm';
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />;
  }
  return children;
};

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* --- ADMIN ROUTES --- */}
      <Route path="/admin" element={<ProtectedRoute roleRequired="ADMIN"><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<div className="p-8">Thống kê tổng quan Admin</div>} />
        <Route path="venues" element={<ManageVenues />} />
        <Route path="venues/:venueId" element={<VenueDetail />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="fields" element={<ManageFields />} />
        <Route path="field-types" element={<ManageFieldTypes />} />
        <Route path="areas" element={<ManageAreas />} />
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* --- USER ROUTES: TẤT CẢ TRANG TRONG NÀY SẼ CÓ BOTTOM NAV --- */}
      <Route element={<ProtectedRoute roleRequired="USER"><UserLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<UserVenueHome />} />
        
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<div className="p-10">Trang Khám Phá</div>} />
        <Route path="/map" element={<div className="p-10">Trang Bản Đồ</div>} />
        <Route path="/trending" element={<div className="p-10">Trang Nổi Bật</div>} />
      </Route>
      <Route path="/booking/:venueId" element={<UserFieldBooking />} />
      <Route path="/booking-confirm" element={<BookingConfirm />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div className="p-20 text-center font-bold">404 - Không tìm thấy trang</div>} />
    </Routes>
  );
};

export default AppRoutes;