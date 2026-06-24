import axiosClient from '../../../shared/services/axiosClient';

export const serviceService = {
  list: () => axiosClient.get('/services'),

  // Admin
  adminList: () => axiosClient.get('/admin/services'),
  adminCreate: (data) => axiosClient.post('/admin/services', data),
  adminUpdate: (id, data) => axiosClient.put(`/admin/services/${id}`, data),
  adminDelete: (id) => axiosClient.delete(`/admin/services/${id}`),
};
