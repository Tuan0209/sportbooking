import axiosClient from '../../../shared/services/axiosClient';

export const fieldService = {
  // 1. Quản lý Khu vực (Areas)
  getAllAreas: () => axiosClient.get('/areas'),
  createArea: (data) => axiosClient.post('/areas', data),
  updateArea: (id, data) => axiosClient.put(`/areas/${id}`, data),
  deleteArea: (id) => axiosClient.delete(`/areas/${id}`),

  // 2. QUẢN LÝ LOẠI SÂN (Ví dụ: Sân Gôn, Bóng đá) - URI: /api/field-types
  getAllFieldTypes: () => axiosClient.get('/field-types'),
  createFieldType: (data) => axiosClient.post('/field-types', data),
  updateFieldType: (id, data) => axiosClient.put(`/field-types/${id}`, data),
  deleteFieldType: (id) => axiosClient.delete(`/field-types/${id}`),

  // 3. QUẢN LÝ SÂN CHI TIẾT (Ví dụ: Sân Gôn Mini 1) - URI: /api/fields
  getAllFields: () => axiosClient.get('/fields'),
  createField: (data) => axiosClient.post('/fields', data),
  updateField: (id, data) => axiosClient.put(`/fields/${id}`, data),
  deleteField: (id) => axiosClient.delete(`/fields/${id}`),
};