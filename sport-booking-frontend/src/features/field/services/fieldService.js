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
  // --- QUẢN LÝ KHUNG GIÁ (PRICE SLOTS) ---
  getPriceSlots: (fieldId) => axiosClient.get(`/fields/${fieldId}/price-slots`),
  
  createPriceSlot: (data) => axiosClient.post('/price-slots', data),
  
  updatePriceSlot: (id, data) => axiosClient.put(`/price-slots/${id}`, data),
  
  deletePriceSlot: (id) => axiosClient.delete(`/price-slots/${id}`),
  // --- QUẢN LÝ ẢNH SÂN ---
  getImages: (fieldId) => axiosClient.get(`/field-images/${fieldId}`),

  uploadCover: (fieldId, file, isUpdate = false) => {
    const data = new FormData();
    data.append('file', file);
    return isUpdate 
      ? axiosClient.put(`/field-images/${fieldId}/cover`, data)
      : axiosClient.post(`/field-images/${fieldId}/cover`, data);
  },

  uploadThumbnail: (fieldId, file, isUpdate = false) => {
    const data = new FormData();
    data.append('file', file);
    return isUpdate 
      ? axiosClient.put(`/field-images/${fieldId}/thumbnail`, data)
      : axiosClient.post(`/field-images/${fieldId}/thumbnail`, data);
  },

  uploadGallery: (fieldId, files) => {
    const data = new FormData();
    // Gửi nhiều file (Multipart)
    Array.from(files).forEach(file => data.append('files', file));
    return axiosClient.post(`/field-images/${fieldId}/gallery`, data);
  },

  deleteImage: (imageId) => axiosClient.delete(`/field-images/image/${imageId}`),

  deleteAllImages: (fieldId) => axiosClient.delete(`/field-images/${fieldId}/all`),
};