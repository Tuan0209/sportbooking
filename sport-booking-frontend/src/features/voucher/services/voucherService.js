import axiosClient from '../../../shared/services/axiosClient';

export const voucherService = {
  apply: (code, amount) => axiosClient.post('/vouchers/apply', { code, amount }),

  // Admin
  adminList: () => axiosClient.get('/admin/vouchers'),
  adminCreate: (data) => axiosClient.post('/admin/vouchers', data),
  adminUpdate: (id, data) => axiosClient.put(`/admin/vouchers/${id}`, data),
  adminDelete: (id) => axiosClient.delete(`/admin/vouchers/${id}`),
};
