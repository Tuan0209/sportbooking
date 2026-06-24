import axiosClient from '../../../shared/services/axiosClient';

export const bookingService = {
  createBooking: (data) => axiosClient.post('/bookings', data),

  // Các khung giờ đã đặt của 1 cơ sở trong 1 ngày (để tô màu lịch)
  getBookedSlots: (venueId, date) =>
    axiosClient.get('/bookings/booked', { params: { venueId, date } }),

  // Đặt vé tháng
  createMonthly: (data) => axiosClient.post('/bookings/monthly', data),
};
