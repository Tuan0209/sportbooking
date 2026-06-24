import { useEffect, useState } from 'react';

/** Lấy vị trí GPS của người dùng (có cache trong session). */
export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem('user_location');
    if (cached) {
      try { setUserLocation(JSON.parse(cached)); } catch { /* bỏ qua */ }
      setIsLocating(false);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setIsLocating(false);
          sessionStorage.setItem('user_location', JSON.stringify(loc));
        },
        () => setIsLocating(false),
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  return { userLocation, isLocating };
};
