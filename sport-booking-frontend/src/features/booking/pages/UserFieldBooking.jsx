// // // // import React, { useState, useEffect, useMemo } from 'react';
// // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // import { ChevronLeft, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
// // // // import { fieldService } from '../../field/services/fieldService';
// // // // import { formatTime, formatPrice } from '../../../shared/utils/formatDate';

// // // // const UserFieldBooking = () => {
// // // //   const { venueId } = useParams();
// // // //   const navigate = useNavigate();
// // // //   const [venue, setVenue] = useState(null);
// // // //   const [fields, setFields] = useState([]);
// // // //   const [fieldSlots, setFieldSlots] = useState({}); 
// // // //   const [selectedSlots, setSelectedSlots] = useState({}); 
// // // //   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
// // // //   const [loading, setLoading] = useState(true);

// // // //   // 1. Logic tính toán lưới giờ (Cải tiến để không bị trắng trang)
// // // //   const timeLabels = useMemo(() => {
// // // //     // Nếu chưa có fields, mặc định hiện lưới 1 tiếng từ 6h-24h để tránh trắng trang
// // // //     const interval = (fields.length > 0 && fields[0].slotInterval) ? fields[0].slotInterval : 60;
// // // //     const times = [];
// // // //     let current = 6 * 60; // Bắt đầu từ 06:00
// // // //     const end = 24 * 60;  // Kết thúc lúc 24:00

// // // //     while (current < end) {
// // // //       const h = Math.floor(current / 60);
// // // //       const m = current % 60;
// // // //       times.push(`${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`);
// // // //       current += interval;
// // // //     }
// // // //     return times;
// // // //   }, [fields]);

// // // //   useEffect(() => {
// // // //     fetchData();
// // // //   }, [venueId, selectedDate]);

// // // //   const fetchData = async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       // Dựa vào JSON bạn gửi, API là /api/venues/{id} trả về venue kèm mảng fields
// // // //       const res = await fieldService.getFieldsByVenue(venueId);
// // // //       console.log("Dữ liệu nhận được:", res.data); // Kiểm tra F12 xem có ra data không

// // // //       if (res.data.code === 0 && res.data.result) {
// // // //         setVenue(res.data.result);
// // // //         setFields(res.data.result.fields || []);
        
// // // //         // Bạn cần gọi thêm API lấy slots cho từng sân nếu backend tách riêng
// // // //         // Tạm thời nếu chưa có API slots, lưới sẽ hiện các ô trống
// // // //       }
// // // //     } catch (e) {
// // // //       console.error("Lỗi khi fetch data:", e);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const toggleSlot = (fieldId, time) => {
// // // //     const key = `${fieldId}-${time}`;
// // // //     setSelectedSlots(prev => {
// // // //       const isExist = prev[key];
// // // //       // Logic: Chỉ cho phép chọn trên cùng 1 sân
// // // //       const currentKeys = Object.keys(prev).filter(k => prev[k]);
// // // //       if (currentKeys.length > 0 && !currentKeys[0].startsWith(fieldId)) {
// // // //         return { [key]: true };
// // // //       }
// // // //       return { ...prev, [key]: !isExist };
// // // //     });
// // // //   };

// // // //   const hasSelection = Object.values(selectedSlots).some(v => v === true);

// // // //   // Hàm tính giá dựa trên PriceSlots (JSON bạn gửi)
// // // //   const getPriceForSlot = (field, time) => {
// // // //     const dayOfWeek = new Date(selectedDate).getDay();
// // // //     const activePriceSlot = field.priceSlots?.find(ps => {
// // // //       const isDayMatch = ps.dayOfWeek === null || ps.dayOfWeek === dayOfWeek;
// // // //       const isTimeMatch = time >= ps.startTime.slice(0, 5) && time < ps.endTime.slice(0, 5);
// // // //       return isDayMatch && isTimeMatch;
// // // //     });
// // // //     return activePriceSlot ? activePriceSlot.price : field.pricePerHour;
// // // //   };

// // // //   return (
// // // //     <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden">
      
// // // //       {/* 1. HEADER (Xanh lá đậm chuẩn AlooBo) */}
// // // //       <div className="bg-[#006a31] text-white z-50">
// // // //         <div className="px-4 py-4 flex items-center justify-between">
// // // //           <button onClick={() => navigate(-1)}><ChevronLeft size={28} /></button>
// // // //           <h1 className="text-lg font-bold">Đặt lịch ngày trực quan</h1>
// // // //           <div className="relative">
// // // //             <label className="bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold cursor-pointer">
// // // //               {new Date(selectedDate).toLocaleDateString('vi-VN')}
// // // //               <CalendarIcon size={16} />
// // // //               <input type="date" className="absolute inset-0 opacity-0" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
// // // //             </label>
// // // //           </div>
// // // //         </div>

// // // //         <div className="px-4 pb-4 flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-90">
// // // //           <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-white rounded-sm border border-slate-200"></div> Trống</div>
// // // //           <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-[#ff6b6b] rounded-sm"></div> Đã đặt</div>
// // // //           <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-[#888] rounded-sm"></div> Khoá</div>
// // // //           <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-[#bf5af2] rounded-sm"></div> Sự kiện</div>
// // // //         </div>
// // // //       </div>

// // // //       {/* 2. LƯU Ý */}
// // // //       <div className="bg-[#fff9db] py-2 px-4 text-center border-b border-[#ffe066]">
// // // //          <p className="text-[11px] text-[#856404]">
// // // //            <span className="font-bold text-red-600 uppercase">Lưu ý:</span> Nếu cần đặt lịch cố định vui lòng liên hệ: <span className="font-black text-slate-800">0789.368.370</span>
// // // //          </p>
// // // //       </div>

// // // //       {/* 3. TIMELINE GRID */}
// // // //       <div className="flex-1 overflow-auto relative custom-scrollbar bg-white">
// // // //         {loading ? (
// // // //           <div className="flex flex-col items-center justify-center py-20 gap-3">
// // // //              <Loader2 className="animate-spin text-[#006a31]" size={32} />
// // // //              <span className="text-xs font-bold text-slate-400">ĐANG TẢI DỮ LIỆU...</span>
// // // //           </div>
// // // //         ) : (
// // // //           <div className="inline-block min-w-full">
// // // //             {/* Header giờ (Sticky) */}
// // // //             <div className="flex sticky top-0 z-40 bg-[#f1f3f5] border-b border-slate-300">
// // // //               <div className="w-20 shrink-0 bg-[#f1f3f5] border-r border-slate-300"></div>
// // // //               {timeLabels.map(time => (
// // // //                 <div key={time} className="w-16 shrink-0 text-center py-2 text-[10px] font-black text-slate-500 border-r border-slate-200 bg-white min-w-[64px]">
// // // //                   {time}
// // // //                 </div>
// // // //               ))}
// // // //             </div>

// // // //             {/* Danh sách Sân */}
// // // //             {fields.length > 0 ? fields.map(field => (
// // // //               <div key={field.id} className="flex border-b border-slate-100 h-16 group">
// // // //                 <div className="w-20 shrink-0 bg-white sticky left-0 z-30 border-r border-slate-300 flex flex-col items-center justify-center px-1 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
// // // //                   <span className="text-[11px] font-black text-slate-700 text-center leading-tight uppercase">{field.name}</span>
// // // //                   <span className="text-[8px] text-indigo-500 font-bold mt-1 uppercase italic">{field.fieldTypeName}</span>
// // // //                 </div>

// // // //                 <div className="flex">
// // // //                   {timeLabels.map(time => {
// // // //                     const isSelected = selectedSlots[`${field.id}-${time}`];
// // // //                     // Kiểm tra giờ mở/đóng cửa
// // // //                     const isOpen = time >= field.openTime.slice(0, 5) && time < field.closeTime.slice(0, 5);
// // // //                     const isAvailable = field.status === 'ACTIVE';

// // // //                     return (
// // // //                       <div 
// // // //                         key={time}
// // // //                         onClick={() => isOpen && isAvailable && toggleSlot(field.id, time)}
// // // //                         className={`
// // // //                           w-16 shrink-0 border-r border-slate-100 transition-all flex flex-col items-center justify-center relative min-w-[64px]
// // // //                           ${(!isOpen || !isAvailable) ? 'bg-slate-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'}
// // // //                           ${isSelected ? 'bg-[#006a31]' : 'bg-white'}
// // // //                         `}
// // // //                       >
// // // //                         {/* Hiện giá tiền nhỏ trong ô */}
// // // //                         {isOpen && isAvailable && !isSelected && (
// // // //                           <span className="text-[8px] font-bold text-slate-300">{Math.floor(getPriceForSlot(field, time)/1000)}k</span>
// // // //                         )}

// // // //                         {isSelected && (
// // // //                           <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse"></div>
// // // //                         )}
                        
// // // //                         {!isOpen && <div className="w-full h-[1px] bg-slate-200 rotate-45 opacity-50"></div>}
// // // //                       </div>
// // // //                     );
// // // //                   })}
// // // //                 </div>
// // // //               </div>
// // // //             )) : (
// // // //               <div className="p-10 text-center text-slate-400 font-bold">Không tìm thấy sân bóng nào tại cơ sở này.</div>
// // // //             )}
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* 4. FOOTER NÚT BẤM */}
// // // //       <div className="p-4 bg-white border-t border-slate-100 z-50 shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
// // // //         <button 
// // // //           disabled={!hasSelection}
// // // //           className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all ${
// // // //             hasSelection ? 'bg-[#eab308] text-white shadow-lg active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
// // // //           }`}
// // // //         >
// // // //           {hasSelection ? 'Tiếp theo' : 'Vui lòng chọn khung giờ'}
// // // //         </button>
// // // //       </div>

// // // //     </div>
// // // //   );
// // // // };

// // // // export default UserFieldBooking;
// // // import React, { useState, useEffect, useMemo } from 'react';
// // // import { useParams, useNavigate } from 'react-router-dom';
// // // import { ChevronLeft, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
// // // import { fieldService } from '../../field/services/fieldService';
// // // import { formatPrice } from '../../../shared/utils/formatDate';

// // // const UserFieldBooking = () => {
// // //   const { venueId } = useParams();
// // //   const navigate = useNavigate();
// // //   const [venue, setVenue] = useState(null);
// // //   const [fields, setFields] = useState([]);
// // //   const [selectedSlots, setSelectedSlots] = useState({}); // { "fieldId-startTime": true }
// // //   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
// // //   const [loading, setLoading] = useState(true);

// // //   // 1. Tạo trục thời gian chuẩn (mỗi nấc 30 phút để làm thước đo cho các loại sân)
// // //   const timeSteps = useMemo(() => {
// // //     const steps = [];
// // //     let start = 6 * 60; // 06:00
// // //     let end = 24 * 60;  // 24:00
// // //     while (start < end) {
// // //       const h = Math.floor(start / 60);
// // //       const m = start % 60;
// // //       steps.push(`${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`);
// // //       start += 30; // Bước nhảy nhỏ nhất là 30p
// // //     }
// // //     return steps;
// // //   }, []);

// // //   useEffect(() => { fetchData(); }, [venueId]);

// // //   const fetchData = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const res = await fieldService.getFieldsByVenue(venueId);
// // //       if (res.data.code === 0) {
// // //         setVenue(res.data.result);
// // //         setFields(res.data.result.fields || []);
// // //       }
// // //     } catch (e) { console.error(e); }
// // //     finally { setLoading(false); }
// // //   };

// // //   // 2. Logic tính giá tiền cho một thời điểm cụ thể
// // //   const getPriceForTime = (field, time) => {
// // //     const dayOfWeek = new Date(selectedDate).getDay();
// // //     const activeSlot = field.priceSlots?.find(ps => {
// // //       const isDayMatch = ps.dayOfWeek === null || ps.dayOfWeek === dayOfWeek;
// // //       const isTimeMatch = time >= ps.startTime.slice(0, 5) && time < ps.endTime.slice(0, 5);
// // //       return isDayMatch && isTimeMatch;
// // //     });
// // //     return activeSlot ? activeSlot.price : field.pricePerHour;
// // //   };

// // //   // 3. Hàm render các ô của từng sân dựa trên slotInterval riêng
// // //   const renderFieldRow = (field) => {
// // //     const interval = field.slotInterval || 60;
// // //     const colSpan = interval / 30; // 30p = 1 ô, 60p = 2 ô, 90p = 3 ô
    
// // //     const fieldSlots = [];
// // //     let current = 6 * 60;
// // //     const end = 24 * 60;

// // //     while (current < end) {
// // //       const h = Math.floor(current / 60);
// // //       const m = current % 60;
// // //       const timeStr = `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
      
// // //       const isSelected = selectedSlots[`${field.id}-${timeStr}`];
// // //       const price = getPriceForTime(field, timeStr);
// // //       const isOpen = timeStr >= field.openTime.slice(0, 5) && timeStr < field.closeTime.slice(0, 5);
// // //       const isInactive = field.status !== 'ACTIVE';

// // //       fieldSlots.push(
// // //         <div 
// // //           key={timeStr}
// // //           onClick={() => isOpen && !isInactive && setSelectedSlots(prev => ({
// // //             ...prev, 
// // //             [`${field.id}-${timeStr}`]: !isSelected 
// // //           }))}
// // //           style={{ gridColumn: `span ${colSpan}` }}
// // //           className={`
// // //             h-14 border-r border-slate-200 transition-all flex items-center justify-center relative px-1
// // //             ${(!isOpen || isInactive) ? 'bg-slate-100/50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'}
// // //             ${isSelected ? 'bg-[#006a31] border-[#004d24]' : 'bg-white'}
// // //           `}
// // //         >
// // //           {/* CHỈ HIỆN GIÁ KHI ĐƯỢC CHỌN (Giống ảnh mẫu) */}
// // //           {isSelected && (
// // //             <div className="flex flex-col items-center animate-in zoom-in duration-200">
// // //                <span className="text-[9px] text-white/80 font-bold uppercase leading-none mb-1">Giá</span>
// // //                <span className="text-[11px] text-white font-black leading-none">{Math.floor(price/1000)}k</span>
// // //                <div className="w-1 h-1 bg-white rounded-full mt-1.5 shadow-[0_0_8px_white]"></div>
// // //             </div>
// // //           )}
          
// // //           {!isOpen && <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.02)_5px,rgba(0,0,0,0.02)_10px)]"></div>}
// // //         </div>
// // //       );
// // //       current += interval;
// // //     }
// // //     return fieldSlots;
// // //   };

// // //   const hasSelection = Object.values(selectedSlots).some(v => v === true);

// // //   return (
// // //     <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden">
      
// // //       {/* 1. HEADER (Xanh lá chuẩn AlooBo) */}
// // //       <div className="bg-[#006a31] text-white shadow-lg z-50">
// // //         <div className="px-4 py-4 flex items-center justify-between">
// // //           <button onClick={() => navigate(-1)}><ChevronLeft size={28} /></button>
// // //           <h1 className="text-lg font-bold">Đặt lịch ngày trực quan</h1>
// // //           <div className="relative">
// // //             <label className="bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold">
// // //               {new Date(selectedDate).toLocaleDateString('vi-VN')}
// // //               <CalendarIcon size={16} />
// // //               <input type="date" className="absolute inset-0 opacity-0" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
// // //             </label>
// // //           </div>
// // //         </div>

// // //         <div className="px-4 pb-4 flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-90">
// // //           <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-white rounded-sm border border-slate-200 shadow-sm"></div> Trống</div>
// // //           <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-[#ff6b6b] rounded-sm shadow-sm"></div> Đã đặt</div>
// // //           <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-[#888] rounded-sm shadow-sm"></div> Khoá</div>
// // //           <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-[#bf5af2] rounded-sm shadow-sm"></div> Sự kiện</div>
// // //           <button className="ml-auto underline decoration-dotted underline-offset-4">Xem sân & bảng giá</button>
// // //         </div>
// // //       </div>

// // //       <div className="bg-[#fff9db] py-2 px-4 text-center border-b border-[#ffe066]">
// // //          <p className="text-[11px] text-[#856404]">
// // //            <span className="font-bold text-red-600 uppercase">Lưu ý:</span> Nếu bạn cần đặt lịch cố định vui lòng liên hệ hệ: <span className="font-black text-slate-900">0789.368.370</span> để được hỗ trợ.
// // //          </p>
// // //       </div>

// // //       {/* 2. TIMELINE GRID */}
// // //       <div className="flex-1 overflow-auto relative custom-scrollbar bg-white">
// // //         {loading ? (
// // //           <div className="flex flex-col items-center justify-center py-20 gap-3">
// // //              <Loader2 className="animate-spin text-[#006a31]" size={32} />
// // //              <span className="text-xs font-bold text-slate-400">Đang đồng bộ khung giờ...</span>
// // //           </div>
// // //         ) : (
// // //           <div className="inline-block min-w-full">
// // //             {/* Header: Giờ (Lưới 30 phút) */}
// // //             <div className="flex sticky top-0 z-40 bg-[#f1f3f5] border-b border-slate-300">
// // //               <div className="w-20 shrink-0 bg-[#f1f3f5] border-r border-slate-300"></div>
// // //               {timeSteps.map(time => (
// // //                 <div key={time} className="w-[60px] shrink-0 text-center py-2.5 text-[10px] font-black text-slate-500 border-r border-slate-200 bg-white">
// // //                   {time}
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             {/* Rows: Danh sách sân */}
// // //             {fields.map(field => (
// // //               <div key={field.id} className="flex border-b border-slate-100">
// // //                 {/* Tên sân (Sticky) */}
// // //                 <div className="w-20 shrink-0 bg-white sticky left-0 z-30 border-r border-slate-300 flex flex-col items-center justify-center px-1 shadow-[2px_0_10px_rgba(0,0,0,0.03)]">
// // //                   <span className="text-[10px] font-black text-slate-800 text-center leading-tight uppercase truncate w-full">{field.name}</span>
// // //                   <span className="text-[8px] text-indigo-500 font-bold mt-1 uppercase italic tracking-tighter">{field.fieldTypeName}</span>
// // //                 </div>

// // //                 {/* Grid Slots co giãn theo interval */}
// // //                 <div className="grid grid-flow-col auto-cols-[60px]">
// // //                    {renderFieldRow(field)}
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* 3. FOOTER */}
// // //       <div className="p-4 bg-white border-t border-slate-100 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
// // //         <button 
// // //           disabled={!hasSelection}
// // //           className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg ${
// // //             hasSelection ? 'bg-[#eab308] text-white active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
// // //           }`}
// // //         >
// // //           Tiếp theo
// // //         </button>
// // //       </div>

// // //     </div>
// // //   );
// // // };

// // // export default UserFieldBooking;
// // import React, { useState, useEffect, useMemo } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { ChevronLeft, Calendar as CalendarIcon, Loader2, Coins, Search, Settings } from 'lucide-react';
// // import { fieldService } from '../../field/services/fieldService';
// // import { formatPrice } from '../../../shared/utils/formatDate';

// // const UserFieldBooking = () => {
// //   const { venueId } = useParams();
// //   const navigate = useNavigate();
// //   const [venue, setVenue] = useState(null);
// //   const [fields, setFields] = useState([]);
// //   const [fieldSlots, setFieldSlots] = useState({}); 
// //   const [selectedSlots, setSelectedSlots] = useState({}); // { "fieldId-time": true }
// //   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
// //   const [loading, setLoading] = useState(true);

// //   // 1. THANH KÉO PHÓNG TO THU NHỎ (Độ rộng của 1 block 30 phút)
// //   // Giá trị từ 60 (nhỏ) đến 150 (to)
// //   const [zoomScale, setZoomScale] = useState(80);

// //   // Tạo trục thời gian chuẩn 30 phút
// //   const timeSteps = useMemo(() => {
// //     const steps = [];
// //     let start = 6 * 60; // 06:00
// //     let end = 24 * 60;  // 24:00
// //     while (start <= end) {
// //       const h = Math.floor(start / 60);
// //       const m = start % 60;
// //       steps.push(`${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`);
// //       start += 30;
// //     }
// //     return steps;
// //   }, []);

// //   useEffect(() => { fetchData(); }, [venueId, selectedDate]);

// //   const fetchData = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await fieldService.getFieldsByVenue(venueId);
// //       if (res.data.code === 0) {
// //         const vData = res.data.result;
// //         setVenue(vData);
// //         setFields(vData.fields || []);
        
// //         // Mock dữ liệu trạng thái slot (AVAILABLE, BOOKED, BLOCKED)
// //         const slotsData = {};
// //         vData.fields.forEach(f => { slotsData[f.id] = {}; });
// //         setFieldSlots(slotsData);
// //       }
// //     } catch (e) { console.error(e); }
// //     finally { setLoading(false); }
// //   };

// //   // Tính giá thông minh từ priceSlots
// //   const getPriceForTime = (field, time) => {
// //     const dayOfWeek = new Date(selectedDate).getDay();
// //     const activeSlot = field.priceSlots?.find(ps => {
// //       const isDayMatch = ps.dayOfWeek === null || ps.dayOfWeek === dayOfWeek;
// //       const isTimeMatch = time >= ps.startTime.slice(0, 5) && time < ps.endTime.slice(0, 5);
// //       return isDayMatch && isTimeMatch;
// //     });
// //     return activeSlot ? activeSlot.price : field.pricePerHour;
// //   };

// //   const toggleSlot = (fieldId, time) => {
// //     const key = `${fieldId}-${time}`;
// //     setSelectedSlots(prev => {
// //       const currentKeys = Object.keys(prev).filter(k => prev[k]);
// //       if (currentKeys.length > 0 && !currentKeys[0].startsWith(fieldId)) {
// //         return { [key]: true }; // Chỉ cho phép chọn 1 sân
// //       }
// //       return { ...prev, [key]: !prev[key] };
// //     });
// //   };

// //   // 2. TÍNH TỔNG TIỀN GÓC TRÁI
// //   const totalPrice = useMemo(() => {
// //     let total = 0;
// //     Object.keys(selectedSlots).forEach(key => {
// //       if (selectedSlots[key]) {
// //         const [fId, time] = key.split('-');
// //         const field = fields.find(f => f.id === fId);
// //         if (field) total += getPriceForTime(field, time);
// //       }
// //     });
// //     return total;
// //   }, [selectedSlots, fields]);

// //   const selectionCount = Object.values(selectedSlots).filter(v => v).length;

// //   return (
// //     <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden select-none">
      
// //       {/* HEADER SECTION (Xanh lá, To rõ) */}
// //       <div className="bg-[#006a31] text-white shadow-xl z-50">
// //         <div className="px-6 py-6 flex items-center justify-between">
// //           <button onClick={() => navigate(-1)} className="p-1 active:scale-75 transition-transform">
// //             <ChevronLeft size={32} />
// //           </button>
// //           <h1 className="text-2xl font-black tracking-tight uppercase italic">Đặt lịch trực quan</h1>
// //           <div className="relative">
// //             <label className="bg-white/20 px-4 py-2 rounded-xl flex items-center gap-3 text-base font-black shadow-inner border border-white/10">
// //               {new Date(selectedDate).toLocaleDateString('vi-VN')}
// //               <CalendarIcon size={20} />
// //               <input type="date" className="absolute inset-0 opacity-0" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
// //             </label>
// //           </div>
// //         </div>

// //         <div className="px-6 pb-6 flex flex-wrap items-center gap-6 text-xs font-black uppercase tracking-widest opacity-90 border-t border-white/10 pt-4">
// //           <div className="flex items-center gap-2"><div className="w-5 h-5 bg-white rounded-md shadow-sm"></div> Trống</div>
// //           <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#ff6b6b] rounded-md shadow-sm"></div> Đã đặt</div>
// //           <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#888] rounded-md shadow-sm"></div> Khoá</div>
// //           <button className="ml-auto underline decoration-2 underline-offset-8 decoration-yellow-400">Xem bảng giá</button>
// //         </div>
// //       </div>

// //       <div className="bg-[#fff9db] py-3 px-6 text-center border-b border-[#ffe066] shadow-sm">
// //          <p className="text-[13px] text-[#856404] font-medium leading-relaxed">
// //            <span className="font-black text-red-600 uppercase">Lưu ý:</span> Cần đặt lịch cố định/dài hạn vui lòng gọi: <span className="font-black text-slate-900 underline underline-offset-2 text-sm ml-1">0789.368.370</span>
// //          </p>
// //       </div>

// //       {/* TIMELINE GRID CONTAINER */}
// //       <div className="flex-1 overflow-auto relative custom-scrollbar bg-slate-50">
// //         {loading ? (
// //           <div className="flex flex-col items-center justify-center h-full gap-4 py-20 opacity-50">
// //             <Loader2 className="animate-spin text-[#006a31]" size={48} />
// //             <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Đồng bộ lịch sân...</span>
// //           </div>
// //         ) : (
// //           <div className="inline-block min-w-full">
// //             {/* Header: Trục thời gian (Phóng to/Thu nhỏ theo zoomScale) */}
// //             <div className="flex sticky top-0 z-40 bg-[#f1f3f5] border-b border-slate-300">
// //               <div className="w-28 shrink-0 bg-[#f1f3f5] border-r border-slate-300"></div>
// //               {timeSteps.map(time => (
// //                 <div 
// //                   key={time} 
// //                   style={{ width: `${zoomScale}px` }} 
// //                   className="shrink-0 text-center py-4 text-[12px] font-black text-slate-500 border-r border-slate-200 bg-white"
// //                 >
// //                   {time}
// //                   <div className="h-2 w-px bg-yellow-400 mx-auto mt-1"></div>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Rows: Tên sân và các ô đặt */}
// //             {fields.map(field => (
// //               <div key={field.id} className="flex border-b border-slate-200 h-20 group">
// //                 {/* Tên sân cố định (To hơn) */}
// //                 <div className="w-28 shrink-0 bg-white sticky left-0 z-30 border-r border-slate-300 flex flex-col items-center justify-center px-2 shadow-[4px_0_15px_rgba(0,0,0,0.04)] group-hover:bg-slate-50 transition-colors">
// //                   <span className="text-[13px] font-black text-slate-800 text-center leading-tight uppercase mb-1">{field.name}</span>
// //                   <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">{field.slotInterval}p</span>
// //                 </div>

// //                 {/* Grid các ô slots */}
// //                 <div className="flex">
// //                   {timeSteps.map(time => {
// //                     const isSelected = selectedSlots[`${field.id}-${time}`];
// //                     const isOpen = time >= field.openTime.slice(0, 5) && time < field.closeTime.slice(0, 5);
// //                     const isAvailable = field.status === 'ACTIVE';

// //                     return (
// //                       <div 
// //                         key={time}
// //                         onClick={() => isOpen && isAvailable && toggleSlot(field.id, time)}
// //                         style={{ width: `${zoomScale}px` }}
// //                         className={`
// //                           shrink-0 border-r border-slate-100 transition-all flex items-center justify-center relative h-full
// //                           ${(!isOpen || !isAvailable) ? 'bg-slate-200/40 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'}
// //                           ${isSelected ? 'bg-[#006a31] shadow-inner border-[#004d24]' : 'bg-white'}
// //                         `}
// //                       >
// //                         {isSelected && (
// //                           <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse"></div>
// //                         )}
// //                         {!isOpen && <div className="absolute inset-0 opacity-[0.05] bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,#000_8px,#000_16px)]"></div>}
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* FLOATING ZOOM CONTROL (Góc phải như ảnh) */}
// //       <div className="fixed bottom-32 right-6 z-50 bg-white/80 backdrop-blur-md p-4 rounded-[2rem] shadow-2xl border border-white flex flex-col items-center gap-3 w-16">
// //           <Settings size={20} className="text-slate-400 animate-spin-slow" />
// //           <div className="h-32 flex items-center">
// //             <input 
// //               type="range" 
// //               min="60" 
// //               max="180" 
// //               value={zoomScale} 
// //               onChange={(e) => setZoomScale(Number(e.target.value))}
// //               className="accent-[#00a651] w-28 h-2 cursor-pointer rotate-270 origin-center"
// //               style={{ transform: 'rotate(-90deg)' }}
// //             />
// //           </div>
// //           <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Zoom</span>
// //       </div>

// //       {/* 3. FOOTER ACTION BAR (To, Giá góc trái, Nút vàng) */}
// //       <div className="p-6 bg-white border-t border-slate-100 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] flex items-center gap-6">
        
// //         {/* GIÁ HIỂN THỊ GÓC TRÁI */}
// //         <div className="flex-1 flex flex-col">
// //            <div className="flex items-center gap-2 text-slate-400">
// //               <Coins size={16} />
// //               <span className="text-xs font-black uppercase tracking-widest">Tổng thanh toán</span>
// //            </div>
// //            <div className="flex items-baseline gap-1 mt-1">
// //               <span className="text-3xl font-black text-slate-900 tracking-tighter">{formatPrice(totalPrice).replace('đ', '')}</span>
// //               <span className="text-lg font-black text-slate-400 uppercase italic">VNĐ</span>
// //            </div>
// //            <p className="text-[11px] font-bold text-indigo-500 italic mt-1">Đã chọn {selectionCount} khung giờ</p>
// //         </div>

// //         <button 
// //           disabled={selectionCount === 0}
// //           className={`px-12 py-5 rounded-[1.8rem] font-black text-lg uppercase tracking-[0.25em] transition-all shadow-xl shadow-yellow-200/50 ${
// //             selectionCount > 0 
// //             ? 'bg-gradient-to-r from-[#eab308] to-[#f59e0b] text-white active:scale-95' 
// //             : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
// //           }`}
// //         >
// //           Tiếp theo
// //         </button>
// //       </div>

// //     </div>
// //   );
// // };

// // export default UserFieldBooking;
// import React, { useState, useEffect, useMemo } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ChevronLeft, Calendar as CalendarIcon, Loader2, Coins, Clock, Settings } from 'lucide-react';
// import { fieldService } from '../../field/services/fieldService';
// import { formatPrice } from '../../../shared/utils/formatDate';

// const UserFieldBooking = () => {
//   const { venueId } = useParams();
//   const navigate = useNavigate();
//   const [venue, setVenue] = useState(null);
//   const [fields, setFields] = useState([]);
//   const [selectedSlots, setSelectedSlots] = useState({}); // { "fieldId-HH:mm": true }
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [loading, setLoading] = useState(true);
//   const [zoomScale, setZoomScale] = useState(80); // Thanh kéo phóng to thu nhỏ

//   useEffect(() => { fetchData(); }, [venueId, selectedDate]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await fieldService.getFieldsByVenue(venueId);
//       if (res.data.code === 0 && res.data.result) {
//         setVenue(res.data.result);
//         setFields(res.data.result.fields || []);
//       }
//     } catch (e) { console.error(e); }
//     finally { setLoading(false); }
//   };

//   // 1. TÍNH TOÁN LƯỚI GIỜ DỰA TRÊN OPEN/CLOSE CỦA VENUE
//   const timeLabels = useMemo(() => {
//     if (!venue) return [];
//     // Lấy giờ từ dữ liệu venue trả về
//     const openH = parseInt(venue.openTime?.split(':')[0]) || 6;
//     const closeH = parseInt(venue.closeTime?.split(':')[0]) || 23;
    
//     const times = [];
//     let current = openH * 60;
//     const end = (closeH + 1) * 60; // Thêm 1 tiếng để vạch kẻ cuối cùng hiện ra

//     while (current <= end) {
//       const h = Math.floor(current / 60);
//       const m = current % 60;
//       times.push(`${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`);
//       current += 30; // Chia nhỏ nhất 30p để khớp vạch kẻ
//     }
//     return times;
//   }, [venue]);

//   // 2. LOGIC TÍNH GIÁ RỜI RẠC (CÁCH 2)
//   const calculateSlotPrice = (field, time) => {
//     const dayOfWeek = new Date(selectedDate).getDay(); // 0: CN, 1: T2...
    
//     // Tìm giá đặc biệt trong priceSlots (Priority cao nhất)
//     const activePriceSlot = field.priceSlots
//       ?.filter(ps => {
//         const isDayMatch = ps.dayOfWeek === null || ps.dayOfWeek === dayOfWeek;
//         const isTimeMatch = time >= ps.startTime.slice(0, 5) && time < ps.endTime.slice(0, 5);
//         return isDayMatch && isTimeMatch;
//       })
//       .sort((a, b) => b.priority - a.priority)[0];

//     const basePrice = activePriceSlot ? activePriceSlot.price : field.pricePerHour;
//     // Giá cho 1 ô (30p = 0.5h, 60p = 1h...)
//     const durationMultiplier = (field.slotInterval || 60) / 60;
//     return basePrice * durationMultiplier;
//   };

//   // 3. TÍNH TỔNG GIỜ VÀ TỔNG TIỀN
//   const { totalHours, totalPrice, selectionCount } = useMemo(() => {
//     let totalP = 0;
//     let totalMins = 0;
//     let count = 0;

//     Object.keys(selectedSlots).forEach(key => {
//       if (selectedSlots[key]) {
//         const [fId, time] = key.split('-');
//         const field = fields.find(f => f.id === fId);
//         if (field) {
//           totalP += calculateSlotPrice(field, time);
//           totalMins += (field.slotInterval || 60);
//           count++;
//         }
//       }
//     });

//     const h = Math.floor(totalMins / 60);
//     const m = totalMins % 60;
//     const timeStr = m > 0 ? `${h}h${m}` : `${h}h00`;

//     return { totalHours: timeStr, totalPrice: totalP, selectionCount: count };
//   }, [selectedSlots, fields, selectedDate]);

//   const toggleSlot = (fieldId, time) => {
//     const key = `${fieldId}-${time}`;
//     setSelectedSlots(prev => {
//       // Chỉ cho phép chọn trên 1 sân
//       const activeKeys = Object.keys(prev).filter(k => prev[k]);
//       if (activeKeys.length > 0 && !activeKeys[0].startsWith(fieldId)) {
//         return { [key]: true };
//       }
//       return { ...prev, [key]: !prev[key] };
//     });
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden select-none">
      
//       {/* HEADER & LEGEND (STYLE CHUẨN ALOOBO) */}
//       <div className="bg-[#006a31] text-white z-50">
//         <div className="px-6 py-5 flex items-center justify-between">
//           <button onClick={() => navigate(-1)}><ChevronLeft size={32} /></button>
//           <h1 className="text-xl font-bold">Đặt lịch ngày trực quan</h1>
//           <div className="relative">
//             <label className="bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold">
//               {new Date(selectedDate).toLocaleDateString('vi-VN')}
//               <CalendarIcon size={18} />
//               <input type="date" className="absolute inset-0 opacity-0" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
//             </label>
//           </div>
//         </div>

//         <div className="px-6 pb-5 flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-widest opacity-90 border-t border-white/10 pt-4">
//           <div className="flex items-center gap-2"><div className="w-5 h-5 bg-white rounded shadow-sm"></div> Trống</div>
//           <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#ff6b6b] rounded shadow-sm"></div> Đã đặt</div>
//           <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#888] rounded shadow-sm"></div> Khoá</div>
//           <button className="ml-auto underline underline-offset-8 decoration-yellow-400">Xem sân & bảng giá</button>
//         </div>
//       </div>

//       <div className="bg-[#fff9db] py-2 px-6 text-center border-b border-[#ffe066]">
//          <p className="text-[12px] text-[#856404] font-medium">
//            <span className="font-black text-red-600 uppercase">Lưu ý:</span> Cần đặt lịch cố định/dài hạn vui lòng gọi: <span className="font-black text-slate-900 underline ml-1 text-sm tracking-tighter">0789.368.370</span>
//          </p>
//       </div>

//       {/* TIMELINE GRID */}
//       <div className="flex-1 overflow-auto relative custom-scrollbar bg-slate-50">
//         {loading ? (
//            <div className="flex flex-col items-center justify-center py-32 gap-4"><Loader2 className="animate-spin text-[#006a31]" size={40} /></div>
//         ) : (
//           <div className="inline-block min-w-full">
            
//             {/* Header: Giờ (CĂN GIỮA VẠCH KẺ) */}
//             <div className="flex sticky top-0 z-40 bg-[#f1f3f5] border-b border-slate-300">
//               <div className="w-28 shrink-0 bg-[#f1f3f5] border-r border-slate-300"></div>
//               {timeLabels.map((time, idx) => (
//                 <div 
//                   key={time} 
//                   style={{ width: `${zoomScale}px` }} 
//                   className="shrink-0 relative h-10 flex items-center justify-center"
//                 >
//                    {/* Vạch kẻ giờ ở giữa ô giờ */}
//                    <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-300"></div>
//                    <span className="text-[10px] font-black text-slate-500 absolute -left-1/2 w-full text-center">
//                       {time}
//                    </span>
//                 </div>
//               ))}
//             </div>

//             {/* Rows: Danh sách sân */}
//             {fields.map(field => (
//               <div key={field.id} className="flex border-b border-slate-200 h-20 bg-white">
//                 {/* Tên sân (Sticky) */}
//                 <div className="w-28 shrink-0 bg-white sticky left-0 z-30 border-r border-slate-300 flex flex-col items-center justify-center px-2 shadow-xl shadow-slate-200/20">
//                   <span className="text-[12px] font-black text-slate-800 text-center uppercase leading-tight mb-1">{field.name}</span>
//                   <span className="text-[9px] text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">{field.slotInterval}p</span>
//                 </div>

//                 {/* Các ô đặt (Grid) */}
//                 <div className="flex">
//                   {timeLabels.slice(0, -1).map(time => {
//                     const isSelected = selectedSlots[`${field.id}-${time}`];
//                     // Mỗi ô rộng zoomScale, nhưng 1 sân có slotInterval riêng (ví dụ 60p chiếm 2 ô 30p)
//                     const isStep = (parseInt(time.split(':')[1]) % field.slotInterval) === 0;
                    
//                     if (!isStep) return null; // Bỏ qua ô nếu ko phải mốc của sân đó

//                     const width = (field.slotInterval / 30) * zoomScale;
//                     const isClosed = time < field.openTime.slice(0, 5) || time >= field.closeTime.slice(0, 5);

//                     return (
//                       <div 
//                         key={time}
//                         onClick={() => !isClosed && field.status === 'ACTIVE' && toggleSlot(field.id, time)}
//                         style={{ width: `${width}px` }}
//                         className={`
//                           shrink-0 border-r border-slate-200 transition-all flex items-center justify-center relative
//                           ${isClosed ? 'bg-slate-100/40 cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-50'}
//                           ${isSelected ? 'bg-[#c3e6cb] border-[#006a31] border-2 z-10' : 'bg-white'}
//                         `}
//                       >
//                          {isSelected && (
//                            <div className="flex flex-col items-center">
//                               <div className="w-2.5 h-2.5 bg-[#006a31] rounded-full animate-pulse mb-1"></div>
//                               {/* HIỆN GIÁ GÓC TRÁI DƯỚI RỒI NÊN KHÔNG HIỆN TRÊN Ô NÀY NỮA THEO Ý BẠN */}
//                            </div>
//                          )}
//                          {!isClosed && field.status !== 'ACTIVE' && <div className="absolute inset-0 bg-slate-200 opacity-30"></div>}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ZOOM SLIDER (PHẢI DƯỚI) */}
//       <div className="fixed bottom-36 right-6 z-50 bg-white/90 backdrop-blur-md p-4 rounded-[2rem] shadow-2xl border border-white flex flex-col items-center w-14 gap-2">
//           <Settings size={18} className="text-slate-400" />
//           <div className="h-32 flex items-center relative">
//             <input 
//               type="range" min="60" max="180" value={zoomScale} 
//               onChange={(e) => setZoomScale(Number(e.target.value))}
//               className="accent-[#00a651] w-28 h-1.5 cursor-pointer appearance-none bg-slate-200 rounded-full"
//               style={{ transform: 'rotate(-90deg)', position: 'absolute' }}
//             />
//           </div>
//           <span className="text-[9px] font-black text-slate-400 uppercase mt-2">Zoom</span>
//       </div>

//       {/* FOOTER ACTION BAR (GIÁ GÓC TRÁI, NÚT VÀNG) */}
//       <div className="bg-[#006a31] p-6 shadow-[0_-15px_40px_rgba(0,0,0,0.15)] z-50">
//         <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 mb-4">
//            <div className="text-white">
//               <p className="text-[12px] font-bold opacity-80 uppercase tracking-widest">Tổng giờ: <span className="text-yellow-400">{totalHours}</span></p>
//               <div className="flex items-baseline gap-1 mt-1">
//                  <span className="text-sm font-bold opacity-70">Tổng tiền:</span>
//                  <span className="text-2xl font-black text-white leading-none">
//                     {formatPrice(totalPrice)}
//                  </span>
//               </div>
//            </div>
           
//            <button 
//             disabled={selectionCount === 0}
//             className={`px-12 py-4 rounded-xl font-black text-sm uppercase tracking-[0.25em] transition-all shadow-xl ${
//               selectionCount > 0 
//               ? 'bg-[#eab308] text-white active:scale-95' 
//               : 'bg-white/10 text-white/30 cursor-not-allowed'
//             }`}
//           >
//             TIẾP THEO
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default UserFieldBooking;
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Loader2,
  SlidersHorizontal,
  X
} from 'lucide-react';

import { fieldService } from '../../field/services/fieldService';
import { formatPrice } from '../../../shared/utils/formatDate';
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
const UserFieldBooking = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [fields, setFields] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    formatLocalDate(new Date())
  );

  const [loading, setLoading] = useState(true);
  const [zoomScale, setZoomScale] = useState(90);
  const timelineRef = useRef(null);

const isDragging = useRef(false);
const startX = useRef(0);
const scrollLeft = useRef(0);

  // --- PHẦN THÊM MỚI: STATE CHO LỊCH TÙY CHỈNH ---
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [tempDate, setTempDate] = useState(selectedDate);

  useEffect(() => {
    fetchData();
  }, [venueId, selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fieldService.getFieldsByVenue(venueId);
      if (res.data.code === 0 && res.data.result) {
        setVenue(res.data.result);
        setFields(res.data.result.fields || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC TẠO NGÀY TRONG THÁNG CHO LỊCH ---
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Thứ 2 là đầu tuần
    for (let i = 0; i < offset; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    return days;
  }, [currentMonth]);

  // timeline logic của bạn
  const timeLabels = useMemo(() => {
    if (!venue) return [];
    const openH = parseInt(venue.openTime?.split(':')[0]) || 6;
    const closeH = parseInt(venue.closeTime?.split(':')[0]) || 23;
    const times = [];
    for (let m = openH * 60; m < closeH * 60; m += 30) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      times.push(`${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
    }
    return times;
  }, [venue]);

  // Logic giá và chọn slot của bạn
  const getSlotPrice = (field, time) => {
    const dayOfWeek = new Date(selectedDate).getDay();
    const activeSlot = field.priceSlots?.find((ps) => {
      const isDayMatch = ps.dayOfWeek === null || ps.dayOfWeek === dayOfWeek;
      const isTimeMatch = time >= ps.startTime.slice(0, 5) && time < ps.endTime.slice(0, 5);
      return isDayMatch && isTimeMatch;
    });
    const basePrice = activeSlot ? activeSlot.price : field.pricePerHour;
    return basePrice * ((field.slotInterval || 60) / 60);
  };

  const getSlotPriceDisplay = (field, time) => `${Math.floor(getSlotPrice(field, time) / 1000)}K`;

  const toggleSlot = (fieldId, time) => {
    const key = `${fieldId}-${time}`;
    setSelectedSlots((prev) => {
      const current = { ...prev };
      const activeKeys = Object.keys(current).filter((k) => current[k]);
      if (activeKeys.length > 0 && !activeKeys[0].startsWith(fieldId)) return { [key]: true };
      if (current[key]) delete current[key]; else current[key] = true;
      return current;
    });
  };

  const summary = useMemo(() => {
    const keys = Object.keys(selectedSlots);
    if (keys.length === 0) return null;
    const parsed = keys.map((key) => {
      const [fieldId, time] = key.split('-');
      return { fieldId, time };
    });
    const field = fields.find((f) => f.id === parsed[0].fieldId);
    if (!field) return null;
    const times = parsed.map((p) => p.time).sort();
    const [h, m] = times[times.length - 1].split(':').map(Number);
    const endMinutes = h * 60 + m + (field.slotInterval || 60);
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;
    const totalPrice = times.reduce((sum, t) => sum + getSlotPrice(field, t), 0);
    return { fieldName: field.name, startTime: times[0], endTime, totalPrice, slotCount: times.length, totalMinutes: times.length * (field.slotInterval || 60) };
  }, [selectedSlots, fields, selectedDate]);

  const selectionCount = summary?.slotCount || 0;
  const handleMouseDown = (e) => {
  if (!timelineRef.current) return;

  isDragging.current = true;

  startX.current =
    e.pageX - timelineRef.current.offsetLeft;

  scrollLeft.current =
    timelineRef.current.scrollLeft;

  timelineRef.current.style.cursor = 'grabbing';
};

const handleMouseLeave = () => {
  isDragging.current = false;

  if (timelineRef.current) {
    timelineRef.current.style.cursor = 'grab';
  }
};

const handleMouseUp = () => {
  isDragging.current = false;

  if (timelineRef.current) {
    timelineRef.current.style.cursor = 'grab';
  }
};

const handleMouseMove = (e) => {
  if (!isDragging.current || !timelineRef.current)
    return;

  e.preventDefault();

  const x =
    e.pageX - timelineRef.current.offsetLeft;

  const walk = (x - startX.current) * 1.2;

  timelineRef.current.scrollLeft =
    scrollLeft.current - walk;
};

  return (
    <div className="h-screen flex flex-col bg-[#f4f6f8] overflow-hidden">
      {/* HEADER */}
      <div className="bg-[#006c35] text-white shadow-sm z-50">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <ChevronLeft size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="text-[18px] font-bold truncate">{venue?.name || 'Đặt lịch'}</h1>
              <p className="text-[11px] text-white/70">Chọn khung giờ phù hợp</p>
            </div>
          </div>

          {/* Ô BẤM LỊCH ĐÃ FIX: Chuyển sang gọi Modal Lịch */}
          <div 
            onClick={() => { setTempDate(selectedDate); setIsCalendarOpen(true); }}
            className="relative bg-white text-[#006c35] rounded-xl px-3 py-2 flex items-center gap-2 text-sm font-semibold shadow cursor-pointer active:scale-95 transition-all"
          >
            <CalendarIcon size={16} />
            {new Date(selectedDate).toLocaleDateString('vi-VN')}
          </div>
        </div>

        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-white border border-slate-300"></div> Trống
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-[#ff6b6b]"></div> Đã đặt
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-slate-500"></div> Bảo trì
          </div>
        </div>
      </div>

      {/* TIMELINE - GIỮ NGUYÊN HOÀN TOÀN */}
      <div
  ref={timelineRef}
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  onMouseLeave={handleMouseLeave}
  className="
    flex-1
    overflow-x-auto
    overflow-y-auto
    bg-[#eef1f4]
    relative
    cursor-grab
    select-none
  "
>
        {loading ? (
          <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-[#16a34a]" size={34} /></div>
        ) : (
          <div
  className="pb-40"
  style={{
    width: `${timeLabels.length * zoomScale + 120}px`
  }}
>
            <div className="flex sticky top-0 z-40 bg-white border-b border-slate-200 w-max">
              <div className="w-24 shrink-0 bg-white border-r border-slate-200"></div>
              {timeLabels.map((time) => (
                <div key={time} style={{ width: `${zoomScale}px` }} className="shrink-0 h-10 border-r border-slate-100 flex items-center justify-center bg-white">
                  <span className="text-[10px] font-medium text-slate-500">{time}</span>
                </div>
              ))}
            </div>
            {fields.map((field) => (
              <div key={field.id} className="flex h-[72px] border-b border-slate-200 bg-white">
                <div className="w-24 shrink-0 sticky left-0 z-30 bg-white border-r border-slate-200 px-2 flex flex-col justify-center text-center">
                  <span className="text-[13px] font-semibold text-slate-800 truncate">{field.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1">{field.slotInterval} phút</span>
                </div>
                <div className="flex">
                  {timeLabels.map((time) => {
                    const totalMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
                    const isStep = totalMinutes % (field.slotInterval || 60) === 0;
                    if (!isStep) return null;
                    const width = ((field.slotInterval || 60) / 30) * zoomScale;
                    const isSelected = selectedSlots[`${field.id}-${time}`];
                    const isClosed = time < field.openTime?.slice(0, 5) || time >= field.closeTime?.slice(0, 5);
                    const isNotAvailable = field.status !== 'ACTIVE' || isClosed;
                    return (
                      <div key={time} onClick={() => !isNotAvailable && toggleSlot(field.id, time)} style={{ width: `${width}px` }} className={`h-full shrink-0 border-r border-slate-200 relative transition-all duration-150 ${isNotAvailable ? 'bg-[#d7dce2]' : isSelected ? 'bg-[#16a34a]' : 'bg-white hover:bg-[#f0fdf4]'}`}>
                        {isSelected && <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-white text-[11px] font-bold">{getSlotPriceDisplay(field, time)}</span></div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- PHẦN THÊM MỚI: MODAL LỊCH --- */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCalendarOpen(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft size={20}/></button>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                tháng {currentMonth.getMonth() + 1} năm {currentMonth.getFullYear()}
              </h3>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 hover:bg-slate-100 rounded-full"><ChevronRight size={20}/></button>
            </div>
            <div className="p-4 text-center">
              <div className="grid grid-cols-7 mb-2">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                  <div key={d} className="text-[10px] font-bold text-slate-400 py-2 uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, idx) => {
                  if (!date) return <div key={idx} />;
                  const ds = formatLocalDate(date);
                  const isSel = ds === tempDate;
                  return (
                    <button key={idx} onClick={() => setTempDate(ds)} className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all ${isSel ? 'bg-[#006c35] text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'}`}>
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50">
              <button onClick={() => setIsCalendarOpen(false)} className="py-3 text-sm font-bold text-slate-400">Hủy</button>
              <button onClick={() => { setSelectedDate(tempDate); setIsCalendarOpen(false); }} className="py-3 bg-[#006c35] text-white rounded-xl font-bold shadow-lg">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* ZOOM & FOOTER - GIỮ NGUYÊN HOÀN TOÀN */}
      <div className="fixed right-4 bottom-28 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 w-52">
        <div className="flex items-center gap-2 mb-3"><SlidersHorizontal size={15} className="text-slate-500"/><span className="text-xs font-medium text-slate-500">Zoom timeline</span></div>
        <input type="range" min="60" max="180" value={zoomScale} onChange={(e) => setZoomScale(Number(e.target.value))} className="w-full accent-[#16a34a]" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 font-medium">Đã chọn</p>
            {summary ? (
              <>
                <p className="text-[15px] font-bold text-slate-800 truncate">{summary.startTime} - {summary.endTime}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[12px] text-slate-500">{summary.fieldName}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-[12px] text-slate-500">{Math.floor(summary.totalMinutes / 60)}h{summary.totalMinutes % 60 > 0 && `${summary.totalMinutes % 60}p`}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-[13px] font-bold text-[#16a34a]">{formatPrice(summary.totalPrice)}</span>
                </div>
              </>
            ) : <p className="text-sm font-medium text-slate-400">Chưa chọn khung giờ</p>}
          </div>
          <button disabled={selectionCount === 0} className={`h-12 px-6 rounded-xl text-sm font-semibold transition-all shrink-0 ${selectionCount > 0 ? 'bg-[#16a34a] text-white shadow-lg shadow-green-100' : 'bg-slate-200 text-slate-400'}`}>Tiếp tục</button>
        </div>
      </div>
    </div>
  );
};

export default UserFieldBooking;