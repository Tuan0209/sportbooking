import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fieldService } from '../../services/fieldService';
import FieldCard from "../../../../shared/components/FieldCard";
import { 
  Search, SlidersHorizontal, Map as MapIcon, 
  CalendarCheck, Heart, Home, Compass, Zap, User 
} from 'lucide-react';

const UserHome = () => {
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fieldService.getAllFields().then(res => {
      if (res.data.code === 0) setFields(res.data.result);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-chalk pb-24 font-sans">
      {/* TOP NAVIGATION / SEARCH BAR */}
      <div className="bg-white px-4 py-3 sticky top-0 z-50 shadow-card border-b border-line">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Logo */}
          <div className="w-10 h-10 bg-pitch rounded-2xl flex items-center justify-center text-white font-display font-extrabold text-xl shadow-glow">
             A
          </div>

          {/* Search Box */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full bg-chalk border border-line py-2.5 pl-4 pr-10 rounded-2xl text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-pitch focus:border-pitch font-medium transition"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted border-l pl-2 border-line hover:text-pitch transition-colors">
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {/* Quick Actions Desktop */}
          <div className="hidden lg:flex items-center gap-6 ml-4">
             <button className="flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-pitch transition-colors"><MapIcon size={18} className="text-pitch"/> Bản đồ</button>
             <button className="flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-pitch transition-colors"><CalendarCheck size={18} className="text-pitch"/> Sân đã đặt</button>
             <button className="flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-pitch transition-colors"><Heart size={18} className="text-pitch"/> Yêu thích</button>
          </div>
        </div>
      </div>

      {/* DANH SÁCH SÂN GRID */}
      <div className="max-w-7xl mx-auto p-4">
        {loading ? (
          <div className="flex justify-center py-40">
             <div className="w-10 h-10 border-4 border-pitch border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-up">
            {fields.map(field => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION (Mobile Style) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-line px-2 py-2 flex justify-between items-end z-50 shadow-[0_-10px_30px_rgba(6,35,26,0.08)]">
         <div className="flex flex-col items-center gap-1 text-pitch flex-1 cursor-pointer">
            <Home size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wide">Trang chủ</span>
         </div>
         <div className="flex flex-col items-center gap-1 text-muted flex-1 cursor-pointer hover:text-pitch transition-colors">
            <MapIcon size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wide">Bản đồ</span>
         </div>

         {/* Nút Khám phá tròn ở giữa */}
         <div className="flex flex-col items-center -translate-y-3 flex-1">
            <div className="w-14 h-14 bg-white border-4 border-chalk rounded-full flex items-center justify-center shadow-glow mb-1 group cursor-pointer active:scale-90 transition-transform">
               <div className="w-10 h-10 border-2 border-pitch rounded-full flex items-center justify-center text-pitch group-hover:bg-pitch group-hover:text-white transition-all">
                  <Compass size={24} />
               </div>
            </div>
            <span className="text-[10px] font-bold text-muted uppercase tracking-wide">Khám phá</span>
         </div>

         <div className="flex flex-col items-center gap-1 text-muted flex-1 cursor-pointer hover:text-pitch transition-colors">
            <Zap size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wide">Nổi bật</span>
         </div>
        <div
  onClick={() => navigate('/profile')}
  className="flex flex-col items-center gap-1 text-muted flex-1 cursor-pointer hover:text-pitch transition-colors"
>
            <User size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wide">Tài </span>
         </div>
      </div>
    </div>
  );
};

export default UserHome;