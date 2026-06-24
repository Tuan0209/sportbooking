import React, { useEffect, useMemo, useState } from 'react';
import { venueService } from '../../services/venueService';
import { favoriteService } from '../../services/favoriteService';
import VenueCard from '../../components/user/VenueCard';
import { useUserLocation } from '../../../../shared/hooks/useUserLocation';
import { calculateDistance } from '../../../../shared/utils/distance';
import { Search, MapPin, X } from 'lucide-react';

// Lấy danh sách môn thể thao có trong 1 cơ sở (từ các sân con)
const venueSports = (v) => [...new Set((v.fields || []).map((f) => f.sportTypeName).filter(Boolean))];

const Explore = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sport, setSport] = useState('');
  const [area, setArea] = useState('');
  const [favIds, setFavIds] = useState(new Set());
  const { userLocation, isLocating } = useUserLocation();
  const distanceOf = (v) =>
    userLocation ? calculateDistance(userLocation.lat, userLocation.lng, v.latitude, v.longitude) : null;

  useEffect(() => {
    venueService
      .getAllVenues()
      .then((res) => {
        if (res.data.code === 0) setVenues(res.data.result || []);
      })
      .finally(() => setLoading(false));
    favoriteService.myFavoriteIds()
      .then((res) => { if (res.data.code === 0) setFavIds(new Set(res.data.result || [])); })
      .catch(() => {});
  }, []);

  // Gom danh sách môn & khu vực từ dữ liệu thật
  const sports = useMemo(() => {
    const s = new Set();
    venues.forEach((v) => venueSports(v).forEach((x) => s.add(x)));
    return [...s].sort();
  }, [venues]);

  const areas = useMemo(() => {
    const s = new Set();
    venues.forEach((v) => v.areaName && s.add(v.areaName));
    return [...s].sort();
  }, [venues]);

  const filtered = useMemo(() => {
    const kw = searchTerm.trim().toLowerCase();
    return venues.filter((v) => {
      const matchKw = !kw || v.name?.toLowerCase().includes(kw) || v.address?.toLowerCase().includes(kw);
      const matchSport = !sport || venueSports(v).includes(sport);
      const matchArea = !area || v.areaName === area;
      return matchKw && matchSport && matchArea;
    });
  }, [venues, searchTerm, sport, area]);

  const hasFilter = sport || area || searchTerm;

  return (
    <div className="min-h-screen bg-chalk pb-28 font-sans animate-fade-up">
      {/* HEADER */}
      <div className="bg-white/90 backdrop-blur-md px-4 md:px-8 py-4 sticky top-0 z-40 border-b border-line shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center gap-4">
          <div className="w-10 h-10 bg-pitch rounded-xl flex items-center justify-center text-white italic font-display font-extrabold text-2xl shadow-glow-lime shrink-0">S</div>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Tìm sân, địa chỉ để khám phá..."
              className="w-full bg-chalk border border-line py-3 pl-12 pr-4 rounded-2xl text-sm font-medium text-ink placeholder:text-muted/70 focus:outline-none focus:border-pitch focus:ring-2 focus:ring-pitch/20 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        {/* TIÊU ĐỀ */}
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-ink tracking-tight">Khám phá sân</h1>
          <p className="text-muted text-sm mt-1">Lọc theo môn thể thao và khu vực bạn quan tâm.</p>
        </div>

        {/* BỘ LỌC MÔN */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-2">Môn thể thao</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <Chip active={!sport} onClick={() => setSport('')}>Tất cả</Chip>
            {sports.map((s) => (
              <Chip key={s} active={sport === s} onClick={() => setSport(s)}>{s}</Chip>
            ))}
          </div>
        </div>

        {/* BỘ LỌC KHU VỰC */}
        <div className="mb-6">
          <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-2">Khu vực</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <Chip active={!area} onClick={() => setArea('')}>Tất cả</Chip>
            {areas.map((a) => (
              <Chip key={a} active={area === a} onClick={() => setArea(a)} icon={<MapPin size={13} />}>{a}</Chip>
            ))}
          </div>
        </div>

        {/* KẾT QUẢ */}
        <div className="flex items-center justify-between mb-5 px-1">
          <h2 className="text-sm font-bold text-muted uppercase tracking-[0.2em]">Kết quả ({filtered.length})</h2>
          {hasFilter && (
            <button
              onClick={() => { setSport(''); setArea(''); setSearchTerm(''); }}
              className="flex items-center gap-1 text-xs font-semibold text-pitch hover:text-pitch-deep"
            >
              <X size={14} /> Xoá lọc
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-96 bg-white border border-line rounded-4xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-ink text-lg font-bold">Không có sân phù hợp</p>
            <p className="text-muted text-sm mt-1">Thử bỏ bớt bộ lọc hoặc đổi từ khoá.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {filtered.map((v) => (
              <VenueCard key={v.id} venue={v} distance={distanceOf(v)} isLocating={isLocating} isFavorite={favIds.has(v.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Chip = ({ active, onClick, children, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all active:scale-95 border ${
      active
        ? 'bg-pitch text-white border-pitch shadow-glow'
        : 'bg-white text-ink border-line hover:border-pitch'
    }`}
  >
    {icon}{children}
  </button>
);

export default Explore;
