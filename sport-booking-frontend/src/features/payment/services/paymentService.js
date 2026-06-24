import axiosClient from '../../../shared/services/axiosClient';

export const paymentService = {
  // Người dùng
  getByBooking: (bookingId) => axiosClient.get(`/payments/booking/${bookingId}`),
  uploadProof: (paymentId, file) => {
    const form = new FormData();
    form.append('file', file);
    return axiosClient.post(`/payments/${paymentId}/proof`, form);
  },

  // Admin
  adminList: () => axiosClient.get('/admin/payments'),
  adminApprove: (id) => axiosClient.post(`/admin/payments/${id}/approve`),
  adminReject: (id) => axiosClient.post(`/admin/payments/${id}/reject`),
};
