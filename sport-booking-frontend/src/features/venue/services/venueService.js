import axiosClient from '../../../shared/services/axiosClient';

export const venueService = {
  // Venue CRUD
  getAllVenues: () => axiosClient.get('/venues'),
  getVenueById: (id) => axiosClient.get(`/venues/${id}`),
  createVenue: (data) => axiosClient.post('/venues', data),
  updateVenue: (id, data) => axiosClient.put(`/venues/${id}`, data),
  deleteVenue: (id) => axiosClient.delete(`/venues/${id}`),

  // Venue Images
  getImages: (venueId) => axiosClient.get(`/venue-images/${venueId}`),
  
  uploadCover: (venueId, file, isUpdate = false) => {
    const formData = new FormData();
    formData.append('file', file);
    return isUpdate 
      ? axiosClient.put(`/venue-images/${venueId}/cover`, formData)
      : axiosClient.post(`/venue-images/${venueId}/cover`, formData);
  },

  uploadThumbnail: (venueId, file, isUpdate = false) => {
    const formData = new FormData();
    formData.append('file', file);
    return isUpdate 
      ? axiosClient.put(`/venue-images/${venueId}/thumbnail`, formData)
      : axiosClient.post(`/venue-images/${venueId}/thumbnail`, formData);
  },

  uploadGallery: (venueId, files) => {
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('files', f));
    return axiosClient.post(`/venue-images/${venueId}/gallery`, formData);
  },

  deleteImage: (imageId) => axiosClient.delete(`/venue-images/image/${imageId}`),
  deleteAllImages: (venueId) => axiosClient.delete(`/venue-images/${venueId}/all`),
};