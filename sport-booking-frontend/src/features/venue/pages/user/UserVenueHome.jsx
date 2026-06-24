import React, { useEffect, useState, useMemo } from 'react';
import { venueService } from '../../services/venueService';
import { calculateDistance } from '../../../../shared/utils/distance';
import VenueCard from '../../components/user/VenueCard';
import { Search, SlidersHorizontal, Map as MapIcon, CalendarCheck, Heart, Home, Compass, Zap, User } from 'lucide-react';
import {  useNavigate} from 'react-router-dom';

const UserVenueHome = () => {
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isLocating, setIsLocating] = useState(true); 
  useEffect(() => {
     // 1. Kiểm tra vị trí trong cache (sessionStorage) trước
    const cachedLoc = sessionStorage.getItem('user_location');
    if (cachedLoc) {
      setUserLocation(JSON.parse(cachedLoc));
      setIsLocating(false);
    }
    // 2. Lấy vị trí GPS thật (cập nhật lại nếu có thay đổi)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setIsLocating(false);
          sessionStorage.setItem('user_location', JSON.stringify(loc)); // Lưu cache
        },
        () => setIsLocating(false), // Lỗi GPS thì ngừng loading
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }

    venueService.getAllVenues().then(res => {
      if (res.data.code === 0) setVenues(res.data.result);
      setLoading(false);
    });
  }, []);

  const processedVenues = useMemo(() => {
    return venues
      .map(v => ({
        ...v,
        distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, v.latitude, v.longitude) : null
      }))
      .filter(v => 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        v.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (a.distance || 999) - (b.distance || 999));
  }, [venues, userLocation, searchTerm]);

  return (
    <div className="min-h-screen bg-chalk pb-28 font-sans animate-fade-up">

      {/* 1. HEADER */}
      <div className="bg-white/90 backdrop-blur-md px-4 md:px-8 py-4 sticky top-0 z-40 border-b border-line shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-wrap lg:flex-nowrap items-center gap-4">

          {/* Logo */}
          <div className="w-10 h-10 bg-pitch rounded-xl flex items-center justify-center text-white italic font-display font-extrabold text-2xl shadow-glow-lime shrink-0">S</div>

          {/* Thanh tìm kiếm - Co giãn linh hoạt (flex-1) */}
          <div className="flex-1 relative min-w-[260px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm cơ sở, địa chỉ..."
              className="w-full bg-chalk border border-line py-3 pl-12 pr-12 rounded-2xl text-sm font-medium text-ink placeholder:text-muted/70 focus:outline-none focus:border-pitch focus:ring-2 focus:ring-pitch/20 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-pitch">
               <SlidersHorizontal size={20} />
            </button>
          </div>

          {/* CÁC NÚT CHỨC NĂNG: ĐÃ ĐẨY LÊN NGANG HÀNG THANH SEARCH */}
          <div className="flex items-center gap-2 shrink-0 overflow-x-auto scrollbar-hide py-1">
             <QuickAction icon={<MapIcon size={18}/>} label="Bản đồ" color="text-blue-500" bg="bg-blue-50" onClick={() => navigate('/map')} />
             <QuickAction icon={<CalendarCheck size={18}/>} label="Sân đã đặt" color="text-pitch" bg="bg-pitch-soft" onClick={() => navigate('/my-bookings')} />
             <QuickAction icon={<Heart size={18}/>} label="Yêu thích" color="text-red-500" bg="bg-red-50" />
          </div>
        </div>
      </div>

      {/* 2. NỘI DUNG CHÍNH */}
      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        {/* Dải hero sân vận động */}
        <div className="stadium pitch-lines rounded-[28px] p-6 md:p-9 mb-8 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full border border-white/10" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 text-lime text-[11px] font-bold uppercase tracking-widest bg-white/10 rounded-full px-3 py-1 mb-3">
              Sân gần bạn
            </span>
            <h2 className="font-display text-white text-2xl md:text-3xl font-extrabold max-w-xl leading-tight">
              Chọn sân, chốt giờ, ra sân thôi!
            </h2>
            <p className="text-white/70 text-sm mt-2 max-w-md">
              Đặt sân bóng đá, cầu lông, pickleball quanh bạn — nhanh gọn, không gọi điện.
            </p>
          </div>
        </div>

        {!loading && (
          <div className="mb-6 flex items-center justify-between px-1">
             <h3 className="text-sm font-bold text-muted uppercase tracking-[0.2em]">Gần bạn nhất ({processedVenues.length})</h3>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => <div key={i} className="h-96 bg-white border border-line rounded-4xl animate-pulse"></div>)}
          </div>
        ) : processedVenues.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-ink text-lg font-bold">Chưa tìm thấy sân nào</p>
            <p className="text-muted text-sm mt-1">Thử đổi từ khoá hoặc xoá bộ lọc tìm kiếm.</p>
          </div>
        ) : (
          /* Grid 4 cột trên màn hình siêu rộng để không bị trống */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {processedVenues.map(venue => (
              <VenueCard 
                key={venue.id} 
                venue={venue} 
                distance={venue.distance} 
                isLocating={isLocating} // Truyền trạng thái đang tìm GPS vào card
                 onBooking={(id) => console.log("Booking:", id)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION (Giữ nguyên) */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-2 py-3 flex justify-between items-end z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
         <BottomNavItem active={activeTab === 'home'} icon={<Home size={24}/>} label="Trang chủ" onClick={() => setActiveTab('home')} />
         <BottomNavItem active={activeTab === 'map'} icon={<MapIcon size={24}/>} label="Bản đồ" onClick={() => setActiveTab('map')} />
         <div className="flex flex-col items-center -translate-y-4 flex-1">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#f8fafc] mb-1 group cursor-pointer active:scale-90 transition-all">
               <div className="w-12 h-12 bg-gradient-to-tr from-[#f3a638] to-[#f7b733] rounded-full flex items-center justify-center text-white">
                  <Compass size={28} />
               </div>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Khám phá</span>
         </div>
         <BottomNavItem active={activeTab === 'trending'} icon={<Zap size={24}/>} label="Nổi bật" onClick={() => setActiveTab('trending')} />
         <BottomNavItem active={activeTab === 'account'} icon={<User size={24}/>} label="Tài khoản1" onClick={() => navigate('/profile')} />
      </div>
    </div> */}
</div>);
};

const QuickAction = ({ icon, label, color, bg, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 ${bg} ${color} rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap shadow-sm border border-transparent hover:border-current`}>
    {icon} {label}
  </button>
);

const BottomNavItem = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${active ? 'text-[#00a651] scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
  </button>
);

export default UserVenueHome;