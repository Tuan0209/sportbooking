import axiosClient from '../../../shared/services/axiosClient';

export const walletService = {
  getWallet: () => axiosClient.get('/wallet'),
  topUp: (amount) => axiosClient.post('/wallet/topup', { amount }),
};
