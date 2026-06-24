import axiosClient from '../../../shared/services/axiosClient';

export const reviewService = {
  create: (data) => axiosClient.post('/reviews', data),
  byVenue: (venueId) => axiosClient.get(`/reviews/venue/${venueId}`),
};
