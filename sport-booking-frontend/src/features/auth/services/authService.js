import axiosClient from '../../../shared/services/axiosClient';

export const authService = {
  login: (data) => axiosClient.post('/auth/login', data),
  register: (data) => axiosClient.post('/auth/register', data),
  forgotPassword: (data) => axiosClient.post('/auth/forgot-password', data),
  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),
  refresh: (refreshToken) => axiosClient.post('/auth/refresh', { refreshToken }),
};