import axiosClient from "../../../shared/services/axiosClient";

export const userService = {
   getMe: () => axiosClient.get('/users/me'),
  // Lấy tất cả user
  getAllUsers: () => axiosClient.get('/admin/users'),

  // Lấy 1 user theo ID
  getUserById: (id) => axiosClient.get(`/admin/users/${id}`),

  // Tạo mới user
  createUser: (data) => axiosClient.post('/admin/users', data),

  // Cập nhật user
  updateUser: (id, data) => axiosClient.put(`/admin/users/${id}`, data),

  // Xóa user
  deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),

  // Upload Avatar (Sử dụng FormData)
  // src/features/user/services/userService.js
uploadAvatar: (id, { file, imageUrl }) => {
  const formData = new FormData();
  // Backend của bạn check hasFile == hasUrl (XOR logic)
  if (file) {
    formData.append('file', file);
  } else if (imageUrl) {
    formData.append('imageUrl', imageUrl);
  }

  return axiosClient.put(`/admin/users/${id}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
},
};