import React from 'react';
import { Star, Heart, Share2, Clock } from 'lucide-react';
import { formatTime } from '../utils/formatDate';

const FieldCard = ({ field, onDetail }) => {
  // 1. Tìm ảnh Cover và Thumbnail từ danh sách images (nếu API trả về kèm theo)
  // Nếu API không trả về mảng images, bạn có thể dùng field.coverUrl hoặc field.thumbnailUrl tùy Backend gán
  const coverImg = field.images?.find(img => img.type === 'cover')?.imageUrl || field.coverUrl;
  const thumbImg = field.images?.find(img => img.type === 'thumbnail')?.imageUrl || field.thumbnailUrl;

  const getStatusColor = (status) => {
    if (status === 'ACTIVE') return 'bg-green-500 hover:bg-green-600';
    if (status === 'INACTIVE') return 'bg-yellow-400 hover:bg-yellow-500';
    if (status === 'MAINTENANCE') return 'bg-yellow-400 hover:bg-yellow-500';
    return 'bg-gray-400';

  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col group transition-all hover:shadow-lg cursor-pointer"
      onClick={() => onDetail(field)}
    >
      {/* PHẦN ẢNH BÌA (COVER) */}
      <div className="relative h-48 overflow-hidden bg-slate-200">
        {coverImg ? (
          <img 
            src={coverImg} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={field.name}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-300 font-bold">
            NO COVER IMAGE
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

        {/* Badges */}
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
      </div>

      {/* PHẦN THÔNG TIN & AVATAR (THUMBNAIL) */}
      <div className="p-3 flex gap-3 relative">
        {/* Logo sân tròn (Thumbnail/Avatar) */}
        <div className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-white flex-shrink-0 -mt-8 z-10 flex items-center justify-center overflow-hidden">
           {thumbImg ? (
             <img src={thumbImg} className="w-full h-full object-cover" alt="logo" />
           ) : (
             <span className="text-[14px] font-black text-indigo-400 uppercase">{field.name?.charAt(0)}</span>
           )}
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

        <div className="flex items-center">
          <button 
            disabled={field.status !== 'ACTIVE'}
            className={`${getStatusColor(field.status)} text-white text-[11px] font-black px-3.5 py-2 rounded-lg shadow-sm transition-all active:scale-95 whitespace-nowrap`}
          >
            {field.status === 'ACTIVE' ? 'ĐẶT LỊCH' : 'ĐẶT LỊCH'}        
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldCard;