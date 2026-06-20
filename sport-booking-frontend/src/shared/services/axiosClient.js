import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8080/api',
  // headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header nếu có
  return config;
});

export default axiosClient;