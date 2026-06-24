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
import MonthlyBooking from '../features/booking/pages/MonthlyBooking';
import Explore from '../features/venue/pages/user/Explore';
import Trending from '../features/venue/pages/user/Trending';
import PaymentPage from '../features/payment/pages/PaymentPage';
import ManagePayments from '../features/payment/pages/admin/ManagePayments';
import ManageRefunds from '../features/payment/pages/admin/ManageRefunds';
import MyBookings from '../features/booking/pages/MyBookings';
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
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="venues" element={<ManageVenues />} />
        <Route path="venues/:venueId" element={<VenueDetail />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="fields" element={<ManageFields />} />
        <Route path="field-types" element={<ManageFieldTypes />} />
        <Route path="areas" element={<ManageAreas />} />
        <Route path="payments" element={<ManagePayments />} />
        <Route path="refunds" element={<ManageRefunds />} />
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* --- USER ROUTES: TẤT CẢ TRANG TRONG NÀY SẼ CÓ BOTTOM NAV --- */}
      <Route element={<ProtectedRoute roleRequired="USER"><UserLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<UserVenueHome />} />
        
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/map" element={<ComingSoon title="Bản đồ" desc="Sắp ra mắt — xem sân trên bản đồ." />} />
        <Route path="/trending" element={<Trending />} />
      </Route>
      <Route path="/booking/:venueId" element={<UserFieldBooking />} />
      <Route path="/monthly/:venueId" element={<MonthlyBooking />} />
      <Route path="/booking-confirm" element={<BookingConfirm />} />
      <Route path="/payment/:bookingId" element={<PaymentPage />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AdminDashboard = () => (
  <div className="animate-fade-up">
    <div className="stadium pitch-lines rounded-[28px] p-8 relative overflow-hidden mb-6">
      <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full border border-white/10" />
      <span className="inline-block text-lime text-[11px] font-bold uppercase tracking-widest bg-white/10 rounded-full px-3 py-1 mb-3">Bảng điều khiển</span>
      <h1 className="font-display text-white text-3xl font-extrabold">Tổng quan hệ thống</h1>
      <p className="text-white/70 text-sm mt-2">Theo dõi cơ sở, sân và lượt đặt trong một màn hình.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[
        { label: 'Cơ sở', value: '—' },
        { label: 'Sân hoạt động', value: '—' },
        { label: 'Lượt đặt hôm nay', value: '—' },
        { label: 'Người dùng', value: '—' },
      ].map((s) => (
        <div key={s.label} className="bg-white border border-line rounded-2xl p-5 shadow-card">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">{s.label}</p>
          <p className="font-display text-3xl font-extrabold text-ink mt-2">{s.value}</p>
        </div>
      ))}
    </div>
  </div>
);

const ComingSoon = ({ title, desc }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 animate-fade-up">
    <div className="w-16 h-16 rounded-2xl stadium flex items-center justify-center mb-4">
      <span className="font-display font-extrabold text-lime text-2xl italic">S</span>
    </div>
    <h1 className="font-display text-2xl font-extrabold text-ink">{title}</h1>
    <p className="text-muted text-sm mt-2 max-w-xs">{desc}</p>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-chalk flex flex-col items-center justify-center text-center px-6">
    <p className="font-display text-7xl font-extrabold text-pitch">404</p>
    <p className="font-display text-xl font-bold text-ink mt-3">Không tìm thấy trang</p>
    <p className="text-muted text-sm mt-1">Trang bạn tìm có thể đã được di chuyển hoặc không tồn tại.</p>
  </div>
);

export default AppRoutes;