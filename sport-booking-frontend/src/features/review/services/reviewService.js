import axiosClient from '../../../shared/services/axiosClient';

export const reviewService = {
  create: (data) => axiosClient.post('/reviews', data),
  byVenue: (venueId) => axiosClient.get(`/reviews/venue/${venueId}`),

  // Admin
  adminList: () => axiosClient.get('/admin/reviews'),
  adminDelete: (id) => axiosClient.delete(`/admin/reviews/${id}`),
};
