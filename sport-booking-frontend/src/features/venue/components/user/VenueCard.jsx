import React, { useState } from 'react';
import { Star, Heart, Share2, Clock, MapPin, Loader2 } from 'lucide-react';
import { formatTime } from '../../../../shared/utils/formatDate';
import { formatDistance } from '../../../../shared/utils/distance';

const VenueCard = ({ venue, distance, onBooking, isLocating }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // 1. Logic cho Badge Trạng thái (Góc trái ảnh)
  const renderStatusBadge = () => {
    switch (venue.status) {
      case 'ACTIVE':
        return <div className="bg-[#00a651] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">Đang mở cửa</div>;
      case 'INACTIVE':
        return <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">Tạm ngưng</div>;
      case 'MAINTENANCE':
        return <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">Đang bảo trì</div>;
      default:
        return null;
    }
  };

  // 2. Logic cho Nút Đặt lịch (Dưới cùng)
  const isAvailable = venue.status === 'ACTIVE';

  return (
    <div className={`bg-white rounded-[2rem] shadow-lg overflow-hidden flex flex-col border border-gray-100 transition-all duration-300 ${!isAvailable ? 'opacity-90' : 'hover:shadow-2xl'}`}>
      <div className="relative h-52 overflow-hidden bg-slate-200">
        <img 
          src={venue.coverUrl || "https://images.unsplash.com/photo-1595030044556-acfaa60edc0f?q=80&w=500"} 
          className={`w-full h-full object-cover transition-all duration-700 ${isAvailable ? 'group-hover:scale-110' : 'grayscale-[0.5]'}`}
          alt={venue.name}
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm w-fit">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[11px] font-black">5.0</span>
          </div>
          {renderStatusBadge()}
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button onClick={() => setIsFavorite(!isFavorite)} className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90">
            <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex gap-4 items-start">
          <div className="w-14 h-14 rounded-2xl border-4 border-white shadow-lg bg-white -mt-10 z-10 overflow-hidden shrink-0 flex items-center justify-center">
            {venue.thumbnailUrl ? <img src={venue.thumbnailUrl} className="w-full h-full object-cover" alt="logo" /> : <span className="text-lg font-black text-indigo-300">{venue.name?.charAt(0)}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-gray-900 text-[15px] leading-tight truncate uppercase tracking-tight">{venue.name}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{venue.areaName}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#f3a638]" />
            {/* HIỂN THỊ KHOẢNG CÁCH THÔNG MINH */}
            <span className="text-[12px] font-black text-[#f3a638] shrink-0 min-w-[45px]">
              {isLocating ? (
                <span className="flex items-center gap-1 animate-pulse text-[10px]">
                  <Loader2 size={10} className="animate-spin" /> tính...
                </span>
              ) : (
                formatDistance(distance)
              )}
            </span>
            <span className="text-[12px] text-gray-500 font-medium truncate italic">{venue.address}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock size={14} />
            <span className="text-[12px] font-bold">{formatTime(venue.openTime)} - {formatTime(venue.closeTime)}</span>
          </div>
        </div>

        <div className="mt-5">
          <button 
            disabled={!isAvailable}
            onClick={() => onBooking(venue.id)}
            className={`w-full py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
              isAvailable 
              ? 'bg-gradient-to-r from-[#f3a638] to-[#f7b733] text-white shadow-orange-100 hover:brightness-105' 
              : 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'
            }`}
          >
            {isAvailable ? 'Đặt Lịch Ngay' : 'Hiện chưa thể đặt'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;