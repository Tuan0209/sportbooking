import axiosClient from '../../../shared/services/axiosClient';

export const membershipService = {
  plans: () => axiosClient.get('/membership/plans'),
  my: () => axiosClient.get('/membership/my'),
  buy: (planId) => axiosClient.post('/membership/buy', { planId }),

  // Admin
  adminList: () => axiosClient.get('/admin/membership-plans'),
  adminCreate: (data) => axiosClient.post('/admin/membership-plans', data),
  adminUpdate: (id, data) => axiosClient.put(`/admin/membership-plans/${id}`, data),
  adminDelete: (id) => axiosClient.delete(`/admin/membership-plans/${id}`),
};
