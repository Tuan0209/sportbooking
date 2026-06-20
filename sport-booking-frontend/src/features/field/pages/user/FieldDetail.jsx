// import React, { useState } from 'react';
// import { ChevronLeft, Heart, Share2, Star, MapPin, Clock, ShieldCheck, Phone } from 'lucide-react';
// import { formatPrice, formatTime } from '../../../../shared/utils/formatDate';
// import { useNavigate } from 'react-router-dom';
// const FieldDetail = ({ field, onBack, onBooking }) => {
//   const [activeTab, setActiveTab] = useState('info');
//   const fieldImages = field.images || []; 
//   const navigate = useNavigate();
//   const coverImg = fieldImages.find(img => img.type === 'cover')?.imageUrl;
//   const thumbImg = fieldImages.find(img => img.type === 'thumbnail')?.imageUrl;
//   const galleryImages = fieldImages.filter(img => img.type === 'gallery');

//   return (
//     <div className="min-h-screen bg-white pb-24 animate-in slide-in-from-right duration-300">
//       {/* 1. Header & Image Area */}
//       <div className="relative h-72 bg-slate-200">
//         <img 
//           src={coverImg || "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800"} // Dùng coverImg ở đây
//           className="w-full h-full object-cover"
//           alt={field.name}
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"></div>
//         {/* Logo sân tròn */}
// <div className="absolute -bottom-6 left-6 w-20 h-20 rounded-full border-4 border-white shadow-lg bg-white overflow-hidden z-10">
//    {thumbImg ? (
//      <img src={thumbImg} className="w-full h-full object-cover" />
//    ) : (
//      <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-500 font-bold text-xl">
//         {field.name?.charAt(0)}
//      </div>
//    )}
// </div>
//         {/* Nút quay lại & Tiện ích */}
//         <div className="absolute top-4 left-4 right-4 flex justify-between">
//           <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
//             <ChevronLeft size={24} />
//           </button>
//           <div className="flex gap-2">
//              <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white"><Heart size={20}/></button>
//              <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white"><Share2 size={20}/></button>
//           </div>
//         </div>

//         {/* Rating Badge */}
//         <div className="absolute bottom-4 left-4">
//            <div className="bg-[#f3a638] text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg text-sm font-bold">
//               <Star size={14} fill="currentColor"/> 5.0 (24 đánh giá)
//            </div>
//         </div>
//       </div>

//       {/* 2. Thông tin cơ bản */}
//       <div className="p-5 space-y-4">
//         <div>
//            <div className="flex items-center gap-2 text-[#00a651] font-bold text-xs mb-1 uppercase tracking-widest">
//               <ShieldCheck size={14}/> Sân đã xác thực
//            </div>
//            <h1 className="text-2xl font-black text-gray-800 uppercase leading-tight">{field.name}</h1>
//            <div className="flex items-start gap-1 text-gray-500 mt-2 text-sm">
//               <MapPin size={18} className="text-[#00a651] shrink-0 mt-0.5"/>
//               <span>{field.address}</span>
//            </div>
//         </div>

//         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
//            <div className="flex flex-col">
//               <span className="text-[10px] text-gray-400 font-bold uppercase">Giá thuê từ</span>
//               <span className="text-xl font-black text-[#00a651]">{formatPrice(field.pricePerHour)}<small className="text-xs font-medium">/giờ</small></span>
//            </div>
//            <div className="text-right">
//               <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Giờ mở cửa</span>
//               <div className="flex items-center gap-1 text-gray-700 font-bold text-sm">
//                  <Clock size={14} className="text-indigo-500"/>
//                  {formatTime(field.openTime)} - {formatTime(field.closeTime)}
//               </div>
//            </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
//            {['Thông tin', 'Tiện ích', 'Đánh giá'].map((tab, idx) => (
//              <button 
//                 key={tab}
//                 onClick={() => setActiveTab(['info', 'amenity', 'review'][idx])}
//                 className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-all ${
//                   (activeTab === 'info' && idx === 0) || (activeTab === 'amenity' && idx === 1) || (activeTab === 'review' && idx === 2)
//                   ? 'text-[#00a651] border-b-2 border-[#00a651]'
//                   : 'text-gray-400'
//                 }`}
//              >
//                {tab}
//              </button>
//            ))}
//         </div>

//         <div className="py-2 text-gray-600 text-sm leading-relaxed">
//            {activeTab === 'info' && (
//              <p>Sân được thiết kế tiêu chuẩn quốc tế, mặt sân cực tốt giúp giảm chấn thương. Hệ thống đèn LED công suất lớn hỗ trợ thi đấu ban đêm cực tốt...</p>
//            )}
//            {activeTab === 'images' && (
//       <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-300">
//          {galleryImages.map((img) => (
//            <div key={img.id} className="h-32 rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:scale-[1.02] transition-transform">
//               <img src={img.image_url} className="w-full h-full object-cover" alt="gallery" />
//            </div>
//          ))}
//          {galleryImages.length === 0 && (
//             <p className="col-span-2 text-center py-10 text-slate-400 italic">Chưa có hình ảnh thực tế từ sân</p>
//          )}
//       </div>
//    )}
//         </div>
//       </div>

//       {/* 3. Nút đặt lịch cố định ở dưới */}
//       <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
//          <button className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2">
//             <Phone size={18}/> GỌI ĐIỆN
//          </button>
//          <button 
//            onClick={() => navigation('/booking/ + ${veuneID}')}

//            className="flex-[2] bg-[#f3a638] text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-orange-100 active:scale-95 transition-transform"
//          >
//             ĐẶT LỊCH NGAY
//          </button>
//       </div>
//     </div>
//   );
// };

// export default FieldDetail;