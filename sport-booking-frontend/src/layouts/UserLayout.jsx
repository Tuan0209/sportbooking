import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Map as MapIcon, Compass, Zap, User } from 'lucide-react';

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định tab nào đang active dựa trên đường dẫn URL hiện tại
  const activeTab = location.pathname;

  const BottomNavItem = ({ path, icon: Icon, label }) => {
    const isActive = activeTab === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${isActive ? 'text-pitch scale-110' : 'text-muted hover:text-ink'}`}
      >
        <Icon size={24} />
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-chalk">
      {/* Nơi hiển thị nội dung các trang: UserVenueHome, Profile, v.v. */}
      <div className="pb-24">
        <Outlet />
      </div>

      {/* FIXED BOTTOM NAVIGATION CHUNG CHO TOÀN BỘ USER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-line px-2 py-3 flex justify-between items-end z-50 shadow-[0_-8px_30px_rgba(6,35,26,0.08)]">
         <BottomNavItem path="/dashboard" icon={Home} label="Trang chủ" />
         <BottomNavItem path="/map" icon={MapIcon} label="Bản đồ" />

         {/* Nút Khám phá ở giữa */}
         <div className="flex flex-col items-center -translate-y-4 flex-1">
            <div
              onClick={() => navigate('/explore')}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-chalk mb-1 group cursor-pointer active:scale-90 transition-all"
            >
               <div className="w-12 h-12 bg-pitch rounded-full flex items-center justify-center text-white shadow-glow-lime">
                  <Compass size={28} className="group-hover:rotate-45 transition-transform duration-500" />
               </div>
            </div>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Khám phá</span>
         </div>

         <BottomNavItem path="/trending" icon={Zap} label="Nổi bật" />
         <BottomNavItem path="/profile" icon={User} label="Tài khoản" />
      </div>
    </div>
  );
};

export default UserLayout;