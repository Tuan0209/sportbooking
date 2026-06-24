import React, { useState } from 'react';
import { Star, Heart, Clock, MapPin, Loader2 } from 'lucide-react';
import { formatTime } from '../../../../shared/utils/formatDate';
import { formatDistance } from '../../../../shared/utils/distance';
import { useNavigate } from 'react-router-dom';

const VenueCard = ({ venue, distance, onBooking, isLocating }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const rating = venue.rating || 0;
  const navigate = useNavigate();

  // Badge trạng thái (góc trái ảnh)
  const renderStatusBadge = () => {
    switch (venue.status) {
      case 'ACTIVE':
        return <div className="bg-pitch text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm">Đang mở cửa</div>;
      case 'INACTIVE':
        return <div className="bg-amber text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm">Tạm ngưng</div>;
      case 'MAINTENANCE':
        return <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm">Đang bảo trì</div>;
      default:
        return null;
    }
  };

  const isAvailable = venue.status === 'ACTIVE';

  return (
    <div className={`group bg-white rounded-4xl shadow-card overflow-hidden flex flex-col border border-line transition-all duration-300 ${!isAvailable ? 'opacity-90' : 'hover:shadow-card-hover hover:-translate-y-1'}`}>
      <div className="relative h-52 overflow-hidden bg-ink-soft">
        <img
          src={venue.coverUrl || "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=800&auto=format&fit=crop"}
          className={`w-full h-full object-cover transition-all duration-700 ${isAvailable ? 'group-hover:scale-110' : 'grayscale-[0.5]'}`}
          alt={venue.name}
        />
        {/* Lớp phủ tối nhẹ chân ảnh */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/40 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm w-fit">
            <Star size={12} className={`${rating > 0 ? 'text-amber fill-amber' : 'text-gray-300'}`} />
            <span className="text-[11px] font-bold text-ink">{rating > 0 ? rating.toFixed(1) : 'Mới'}</span>
          </div>
          {renderStatusBadge()}
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90"
            aria-label="Yêu thích"
          >
            <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-muted'} />
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex gap-4 items-start">
          <div className="w-14 h-14 rounded-2xl border-4 border-white shadow-card bg-white -mt-10 z-10 overflow-hidden shrink-0 flex items-center justify-center">
            {venue.thumbnailUrl
              ? <img src={venue.thumbnailUrl} className="w-full h-full object-cover" alt="logo" />
              : <span className="text-lg font-display font-extrabold text-pitch">{venue.name?.charAt(0)}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-ink text-[15px] leading-tight truncate">{venue.name}</h3>
            <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mt-0.5">{venue.areaName}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-pitch shrink-0" />
            <span className="text-[12px] font-bold text-pitch shrink-0 min-w-[45px]">
              {isLocating ? (
                <span className="flex items-center gap-1 animate-pulse text-[10px]">
                  <Loader2 size={10} className="animate-spin" /> tính...
                </span>
              ) : (
                formatDistance(distance)
              )}
            </span>
            <span className="text-[12px] text-muted font-medium truncate">{venue.address}</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <Clock size={14} />
            <span className="text-[12px] font-medium">{formatTime(venue.openTime)} - {formatTime(venue.closeTime)}</span>
          </div>
        </div>

        <div className="mt-5">
          <button
            disabled={!isAvailable}
            onClick={() => navigate(`/booking/${venue.id}`)}
            className={`w-full py-3.5 rounded-2xl text-[12px] font-bold uppercase tracking-widest transition-all active:scale-95 ${
              isAvailable
                ? 'bg-pitch text-white shadow-glow hover:bg-pitch-deep'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isAvailable ? 'Đặt lịch ngay' : 'Hiện chưa thể đặt'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
