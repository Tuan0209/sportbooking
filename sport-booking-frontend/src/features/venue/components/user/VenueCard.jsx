import React, { useState } from 'react';
import { Star, Heart, Share2, Clock, MapPin } from 'lucide-react';
import { formatTime } from '../../../../shared/utils/formatDate';
import { formatDistance } from '../../../../shared/utils/distance';

const VenueCard = ({ venue, distance, onBooking }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group flex flex-col border border-gray-100/50">
      {/* 1. Phần Ảnh Bìa (Cover) */}
      <div className="relative h-56 overflow-hidden bg-slate-200">
        {venue.coverUrl ? (
          <img 
            src={venue.coverUrl} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={venue.name}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400/20 via-blue-400/20 to-purple-400/20 flex items-center justify-center text-4xl">
            ⚽
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm w-fit">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[12px] font-black text-gray-800">
              {venue.rating > 0 ? `${venue.rating} (${venue.totalReviews})` : 'Mới'}
            </span>
          </div>
          {venue.status === 'ACTIVE' && (
            <div className="bg-[#00a651]/95 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm w-fit">
              Đang mở cửa
            </div>
          )}
        </div>

        {/* Actions Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
          >
            <Heart size={20} className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all">
            <Share2 size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* 2. Phần Thông Tin */}
      <div className="p-5 flex flex-col relative flex-1">
        {/* Thumbnail Overlap */}
        <div className="flex gap-4 items-start">
          <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-xl bg-white -mt-12 z-10 overflow-hidden shrink-0 flex items-center justify-center">
            {venue.thumbnailUrl ? (
              <img src={venue.thumbnailUrl} className="w-full h-full object-cover" alt="logo" />
            ) : (
              <span className="text-xl font-black text-indigo-300 uppercase">{venue.name?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-gray-900 text-lg leading-tight truncate uppercase tracking-tight">
              {venue.name}
            </h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              {venue.areaName}
            </p>
          </div>
        </div>

        {/* Rows */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#f3a638]" />
            <span className="text-[13px] font-black text-[#f3a638] shrink-0">
              {formatDistance(distance)}
            </span>
            <span className="text-[13px] text-gray-500 font-medium truncate italic">
              {venue.address}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Clock size={16} className="text-[#00a651]" />
            <span className="text-[13px] font-bold">
              {formatTime(venue.openTime)} - {formatTime(venue.closeTime)}
            </span>
          </div>
        </div>

        {/* Booking Button */}
        <div className="mt-6">
          <button 
            onClick={() => onBooking(venue.id)}
            className="w-full py-4 bg-gradient-to-r from-[#f3a638] to-[#f7b733] hover:from-[#e6952d] hover:to-[#f3a638] text-white font-black text-[13px] uppercase tracking-[0.1em] rounded-[1.2rem] shadow-lg shadow-orange-100 transition-all active:scale-[0.98]"
          >
            Đặt Lịch Ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;