export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price || 0) + 'đ';
};

export const formatTime = (timeString) => {
  if (!timeString) return '--:--';
  return timeString.length >= 5 ? timeString.slice(0, 5) : timeString;
};