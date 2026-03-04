import axiosClient from '../../../shared/services/axiosClient';

export const authService = {
  login: (data) => axiosClient.post('/auth/login', data),
  register: (data) => axiosClient.post('/auth/register', data),
};