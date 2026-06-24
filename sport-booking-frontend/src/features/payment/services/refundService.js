import axiosClient from '../../../shared/services/axiosClient';

export const refundService = {
  // Người dùng
  myBookings: () => axiosClient.get('/bookings/my'),
  createRefund: (data) => axiosClient.post('/refunds', data),

  // Admin
  adminList: () => axiosClient.get('/admin/refunds'),
  adminApprove: (id, body = {}) => axiosClient.post(`/admin/refunds/${id}/approve`, body),
  adminReject: (id) => axiosClient.post(`/admin/refunds/${id}/reject`),
};
