import axiosClient from '../../../shared/services/axiosClient';

export const walletService = {
  // Lấy thông tin ví
  getWallet: () => axiosClient.get('/wallet'),

  // Tạo link thanh toán PayOS
  createTopup: (amount) =>
    axiosClient.post('/wallet/topup/create', { amount }),

  // Xác nhận sau khi PayOS redirect về
  confirmTopup: (amount) =>
    axiosClient.get(`/wallet/topup/success?amount=${amount}`),
};