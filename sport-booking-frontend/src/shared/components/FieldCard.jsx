import React from 'react';
import { Star, Heart, Share2, Clock } from 'lucide-react';
import { formatTime } from '../utils/formatDate';

const FieldCard = ({ field }) => {
  // Màu nút theo trạng thái (Vàng cam như ảnh mẫu)
  const getStatusColor = (status) => {
    if (status === 'INACTIVE') return 'bg-gray-400 cursor-not-allowed';
    if (status === 'MAINTENANCE') return 'bg-red-500 cursor-not-allowed';
    return 'bg-[#f3a638] hover:bg-[#e6952d]'; 
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col group transition-all hover:shadow-lg">
      {/* 1. Phần Ảnh & Badge đè lên ảnh */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={field.imageUrl || "https://images.unsplash.com/photo-1595030044556-acfaa60edc0f?q=80&w=500"} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={field.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

        {/* Badges bên trái: Rating, Đơn ngày, Sự kiện */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm w-fit">
            <Star size={10} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-black text-gray-700">5.0</span>
          </div>
          <div className="flex gap-1">
            <span className="bg-[#00a651] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">Đơn ngày</span>
            <span className="bg-[#bf5af2] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">Sự kiện</span>
          </div>
        </div>

        {/* Buttons bên phải: Tim & Share */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button className="bg-white/80 p-1.5 rounded-full hover:bg-white transition-colors shadow-md">
            <Heart size={16} className="text-gray-600" />
          </button>
          <button className="bg-white/80 p-1.5 rounded-full hover:bg-white transition-colors shadow-md">
            <Share2 size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* 2. Phần Thông tin bên dưới */}
      <div className="p-3 flex gap-3 relative">
        {/* Logo sân tròn */}
        <div className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-slate-50 flex-shrink-0 -mt-8 z-10 flex items-center justify-center overflow-hidden">
           <span className="text-[10px] font-black text-indigo-400 uppercase">{field.name?.charAt(0)}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-black text-gray-800 text-[14px] uppercase truncate tracking-tight leading-tight">
            {field.name}
          </h3>
          <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
            <span className="text-[#f3a638] font-black shrink-0">(631.3km)</span>
            <span className="truncate">{field.address}</span>
          </p>
          <div className="flex items-center gap-1 text-gray-400 mt-1.5">
            <Clock size={12} />
            <span className="text-[11px] font-bold">
              {formatTime(field.openTime)} - {formatTime(field.closeTime)}
            </span>
          </div>
        </div>

        {/* Nút Đặt lịch */}
        <div className="flex items-center">
          <button 
            disabled={field.status !== 'ACTIVE'}
            className={`${getStatusColor(field.status)} text-white text-[11px] font-black px-3.5 py-2 rounded-lg shadow-sm transition-all active:scale-95 whitespace-nowrap`}
          >
            ĐẶT LỊCH
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldCard;