import axiosClient from '../../../shared/services/axiosClient';

export const favoriteService = {
  toggle: (venueId) => axiosClient.post(`/favorites/${venueId}/toggle`),
  myFavorites: () => axiosClient.get('/favorites'),
  myFavoriteIds: () => axiosClient.get('/favorites/ids'),
};
