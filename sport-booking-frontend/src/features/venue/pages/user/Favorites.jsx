import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Loader2 } from 'lucide-react';
import { favoriteService } from '../../services/favoriteService';
import VenueCard from '../../components/user/VenueCard';

const Favorites = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoriteService
      .myFavorites()
      .then((res) => {
        setVenues(res.data.result || []);
      })
      .catch(() => setVenues([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-chalk pb-28 font-sans animate-fade-up">
      {/* HEADER dải tối sân vận động */}
      <div className="stadium pitch-lines px-4 md:px-8 pt-8 pb-10 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full border border-white/10" />
        <div className="max-w-[1600px] mx-auto relative flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white transition-all hover:bg-white/25 active:scale-90 shrink-0"
            aria-label="Quay lại"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-white text-2xl md:text-3xl font-extrabold tracking-tight">
              Sân yêu thích
            </h1>
            <p className="text-white/70 text-sm mt-1">Những sân bạn đã lưu lại để chốt nhanh.</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-8 -mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-pitch">
            <Loader2 size={36} className="animate-spin" />
            <p className="mt-4 text-sm font-medium text-muted">Đang tải sân yêu thích...</p>
          </div>
        ) : venues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-white border border-line shadow-card flex items-center justify-center">
              <Heart size={34} className="text-muted" />
            </div>
            <h2 className="font-display font-bold text-ink text-lg mt-6">Chưa có sân yêu thích</h2>
            <p className="text-muted text-sm mt-2 max-w-xs">
              Nhấn vào trái tim trên thẻ sân để lưu lại.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((v) => (
              <VenueCard key={v.id} venue={v} distance={null} isLocating={false} isFavorite={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
