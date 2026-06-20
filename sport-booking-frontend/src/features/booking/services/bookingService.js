import axiosClient from '../../../shared/services/axiosClient';

export const bookingService = {
  createBooking: (data) => axiosClient.post('/bookings', data),
};
