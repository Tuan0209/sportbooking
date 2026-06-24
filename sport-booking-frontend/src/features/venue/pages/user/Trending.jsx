import React, { useEffect, useMemo, useState } from 'react';
import { venueService } from '../../services/venueService';
import VenueCard from '../../components/user/VenueCard';
import { Star, Sparkles, Trophy } from 'lucide-react';

const ratingOf = (v) => Number(v.rating || 0);

const Trending = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    venueService
      .getAllVenues()
      .then((res) => {
        if (res.data.code === 0) setVenues(res.data.result || []);
      })
      .finally(() => setLoading(false));
  }, []);

  // Chỉ xếp hạng cơ sở đang mở, theo rating giảm dần
  const ranked = useMemo(
    () => [...venues].filter((v) => v.status === 'ACTIVE').sort((a, b) => ratingOf(b) - ratingOf(a)),
    [venues]
  );

  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  // Mới mở: theo createdAt giảm dần
  const newest = useMemo(
    () => [...venues].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4),
    [venues]
  );

  return (
    <div className="min-h-screen bg-chalk pb-28 font-sans animate-fade-up">
      {/* HERO */}
      <div className="stadium pitch-lines px-4 md:px-8 pt-8 pb-10 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full border border-white/10" />
        <div className="max-w-[1600px] mx-auto relative">
          <span className="inline-flex items-center gap-1.5 text-lime text-[11px] font-bold uppercase tracking-widest bg-white/10 rounded-full px-3 py-1 mb-3">
            <Sparkles size={13} /> Đang hot
          </span>
          <h1 className="font-display text-white text-2xl md:text-3xl font-extrabold tracking-tight">Sân nổi bật</h1>
          <p className="text-white/70 text-sm mt-2 max-w-md">Những sân được đánh giá cao nhất, chốt nhanh kẻo hết giờ đẹp.</p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-8 -mt-6">
        {/* PODIUM TOP 3 */}
        {!loading && podium.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {podium.map((v, i) => (
              <PodiumCard key={v.id} venue={v} rank={i + 1} />
            ))}
          </div>
        )}

        {/* MỚI MỞ */}
        {!loading && newest.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-bold text-muted uppercase tracking-[0.2em] mb-5 px-1">Mới mở</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
              {newest.map((v) => <VenueCard key={v.id} venue={v} distance={null} isLocating={false} />)}
            </div>
          </div>
        )}

        {/* BẢNG XẾP HẠNG CÒN LẠI */}
        <h2 className="text-sm font-bold text-muted uppercase tracking-[0.2em] mb-5 px-1">Xếp hạng theo đánh giá</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-96 bg-white border border-line rounded-4xl animate-pulse" />)}
          </div>
        ) : rest.length === 0 ? (
          <p className="text-muted text-sm px-1">Chưa có thêm sân nào trong bảng xếp hạng.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {rest.map((v) => <VenueCard key={v.id} venue={v} distance={null} isLocating={false} />)}
          </div>
        )}
      </div>
    </div>
  );
};

const rankStyle = {
  1: 'bg-amber text-white',
  2: 'bg-muted text-white',
  3: 'bg-pitch-deep text-white',
};

const PodiumCard = ({ venue, rank }) => {
  const navigate = (id) => (window.location.href = `/venue/${id}`);
  return (
    <button
      onClick={() => navigate(venue.id)}
      className="text-left bg-white border border-line rounded-3xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all overflow-hidden"
    >
      <div className="relative h-32 bg-ink-soft overflow-hidden">
        <img
          src={venue.coverUrl || 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=800&auto=format&fit=crop'}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        <div className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center font-display font-extrabold shadow-md ${rankStyle[rank]}`}>
          {rank === 1 ? <Trophy size={16} /> : `#${rank}`}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display font-bold text-ink truncate">{venue.name}</h3>
        <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mt-0.5">{venue.areaName}</p>
        <div className="flex items-center gap-1 mt-2">
          <Star size={14} className="text-amber fill-amber" />
          <span className="text-sm font-bold text-ink">{ratingOf(venue) > 0 ? ratingOf(venue).toFixed(1) : 'Mới'}</span>
          {venue.totalReviews > 0 && <span className="text-xs text-muted">({venue.totalReviews} đánh giá)</span>}
        </div>
      </div>
    </button>
  );
};

export default Trending;
