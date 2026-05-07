// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import Login from '../features/auth/pages/Login';
// import Register from '../features/auth/pages/Register';
// import AdminLayout from '../layouts/AdminLayout'; // Import layout mới
// import ManageUsers from '../features/user/pages/admin/ManageUsers'; // Trang quản lý người dùng cho admin
// import ManageAreas from '../features/field/pages/admin/ManageAreas'; // Trang quản lý khu vực cho admin
// import ManageFields from '../features/field/pages/admin/ManageFields'; // Trang quản lý sân chi tiết cho admin
// import ManageFieldTypes from '../features/field/pages/admin/ManageFieldTypes'; // Trang quản lý loại sân cho admin
// import UserBooking from '../features/field/pages/UserBooking'; // Trang đặt sân cho người dùng
// const AppRoutes = () => {
//   const { user, loading } = useContext(AuthContext);

//   if (loading) return <div>Loading...</div>; // Nên có loading indicator

//   return (
//     <Routes>
//       {/* 1. Trang điều hướng gốc (/) */}
//       <Route 
//         path="/" 
//         element={
//           user ? (
//             user.role === 'ADMIN' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />
//           ) : (
//             <Navigate to="/login" />
//           )
//         } 
//       />

//       {/* 2. Public Routes */}
//       <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
//       <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

//       {/* 3. Admin Routes */}
//       {user?.role === 'ADMIN' && (
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route path="dashboard" element={<div>Thống kê Admin</div>} />
//           <Route path="users" element={<ManageUsers />} />
//           <Route path="bookings" element={<div>Quản lý lịch đặt</div>} />
//            <Route path="areas" element={<ManageAreas />} />   {/* Thêm Route này */}
//          <Route path="fields" element={<ManageFields />} /> {/* Thêm Route này */}
//          <Route path="field-types" element={<ManageFieldTypes />} /> {/* Thêm Route này */}
//         </Route>
//       )}

//       {/* 4. User Routes */}
//       {user?.role === 'USER' && (
//        <Route path="/dashboard" element={<UserBooking />} />
//       )}


//       {/* 5. Catch All - Tránh dùng Navigate trực tiếp nếu không chắc chắn */}
//       <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
//     </Routes>
//   );
// };

// export default AppRoutes;
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Layouts
import AdminLayout from '../layouts/AdminLayout';

// Auth Features
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';

// User/Customer Features (Thay thế UserBooking cũ)
import UserHome from '../features/field/pages/user/UserHome';
import UserVenueHome from '../features/venue/pages/user/UserVenueHome';
// Admin Features
import ManageUsers from '../features/user/pages/admin/ManageUsers';
import ManageFields from '../features/field/pages/admin/ManageFields';
import ManageFieldTypes from '../features/field/pages/admin/ManageFieldTypes';
import ManageAreas from '../features/field/pages/admin/ManageAreas';
import ManageVenues from '../features/venue/pages/admin/ManageVenues';
import VenueDetail from '../features/venue/pages/admin/VenueDetail';  
// 1. Route bảo vệ: Chỉ dành cho khách chưa đăng nhập (Login/Register)
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />;
  }
  return children;
};

// 2. Route bảo vệ: Bắt buộc đăng nhập & check quyền Role
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
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* --- ADMIN ROUTES (Sử dụng AdminLayout) --- */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute roleRequired="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<div className="p-8">Thống kê tổng quan Admin</div>} />
        <Route path="venues" element={<ManageVenues />} />
        <Route path="venues/:venueId" element={<VenueDetail />} /> {/* Route mới */}
        <Route path="fields" element={<ManageFields />} /> {/* Giữ lại làm trang tra cứu tổng hợp */}
        <Route path="users" element={<ManageUsers />} />
        <Route path="fields" element={<ManageFields />} />
        <Route path="field-types" element={<ManageFieldTypes />} />
        <Route path="areas" element={<ManageAreas />} />
        {/* Điều hướng mặc định của admin về dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* --- USER ROUTES (Khách hàng - Giao diện như app mobile bạn muốn) --- */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute roleRequired="USER">
             <UserVenueHome />
          </ProtectedRoute>
        } 
      />

      {/* --- DEFAULT REDIRECT --- */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div className="p-20 text-center font-bold">404 - Không tìm thấy trang</div>} />
    </Routes>
  );
};

export default AppRoutes;