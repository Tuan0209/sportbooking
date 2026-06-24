import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Star, Heart, CalendarCheck, Loader2 } from 'lucide-react';
import { venueService } from '../../services/venueService';
import { favoriteService } from '../../services/favoriteService';
import { reviewService } from '../../../review/services/reviewService';
import VenueMap from '../../../../shared/components/VenueMap';
import { formatTime, formatPrice } from '../../../../shared/utils/formatDate';

const STATUS = {
  ACTIVE: { l: 'Đang mở cửa', c: 'bg-pitch text-white' },
  INACTIVE: { l: 'Tạm ngưng', c: 'bg-amber text-white' },
  MAINTENANCE: { l: 'Đang bảo trì', c: 'bg-red-500 text-white' },
};

const VenueDetail = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [reviews, setReviews] = useState({ averageRating: 0, totalReviews: 0, items: [] });
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    venueService.getVenueById(venueId)
      .then((res) => { if (res.data.code === 0) setVenue(res.data.result); })
      .finally(() => setLoading(false));
    reviewService.byVenue(venueId)
      .then((res) => { if (res.data.code === 0) setReviews(res.data.result); })
      .catch(() => {});
    favoriteService.myFavoriteIds()
      .then((res) => { if (res.data.code === 0) setFav((res.data.result || []).includes(venueId)); })
      .catch(() => {});
  }, [venueId]);

  const toggleFav = async () => {
    const prev = fav; setFav(!prev);
    try {
      const res = await favoriteService.toggle(venueId);
      if (res.data.code === 0) setFav(res.data.result.favorited);
    } catch { setFav(prev); }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-chalk"><Loader2 className="animate-spin text-pitch" size={34} /></div>;
  }
  if (!venue) {
    return <div className="h-screen flex items-center justify-center bg-chalk text-muted">Không tìm thấy cơ sở</div>;
  }

  const st = STATUS[venue.status] || { l: venue.status, c: 'bg-muted text-white' };
  const fields = venue.fields || [];

  return (
    <div className="min-h-screen bg-chalk pb-32 animate-fade-up">
      {/* ẢNH BÌA */}
      <div className="relative h-56 bg-ink-soft overflow-hidden">
        <img
          src={venue.coverUrl || 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1200&auto=format&fit=crop'}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-ink shadow-lg">
          <ChevronLeft size={22} />
        </button>
        <button onClick={toggleFav} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/85 backdrop-blur flex items-center justify-center shadow-lg">
          <Heart size={20} className={fav ? 'fill-red-500 text-red-500' : 'text-muted'} />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${st.c}`}>{st.l}</span>
          <h1 className="font-display text-white text-2xl font-extrabold mt-2 drop-shadow">{venue.name}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* THÔNG TIN */}
        <div className="bg-white border border-line rounded-2xl shadow-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-amber fill-amber" />
            <span className="font-bold text-ink">{reviews.averageRating > 0 ? reviews.averageRating.toFixed(1) : 'Mới'}</span>
            <span className="text-muted text-sm">({reviews.totalReviews} đánh giá)</span>
            <span className="mx-1 text-line">·</span>
            <span className="text-muted text-sm">{venue.areaName}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-pitch shrink-0 mt-0.5" />
            <span className="text-sm text-ink">{venue.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted" />
            <span className="text-sm text-ink">{formatTime(venue.openTime)} - {formatTime(venue.closeTime)}</span>
          </div>
        </div>

        {/* BẢN ĐỒ */}
        <div>
          <h2 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-2 px-1">Vị trí trên bản đồ</h2>
          <VenueMap lat={venue.latitude} lng={venue.longitude} name={venue.name} address={venue.address} height={220} />
        </div>

        {/* DANH SÁCH SÂN */}
        <div className="bg-white border border-line rounded-2xl shadow-card p-5">
          <h2 className="font-display font-bold text-ink text-lg mb-3">Các sân ({fields.length})</h2>
          {fields.length === 0 ? (
            <p className="text-muted text-sm">Cơ sở chưa có sân nào.</p>
          ) : (
            <div className="space-y-2">
              {fields.map((f) => (
                <div key={f.id} className="flex items-center justify-between bg-chalk rounded-xl px-4 py-3 border border-line">
                  <div>
                    <p className="font-semibold text-ink text-sm">{f.name}</p>
                    <p className="text-xs text-muted">{f.sportTypeName || f.fieldTypeName}</p>
                  </div>
                  <span className="font-display font-bold text-pitch text-sm">{formatPrice(Number(f.pricePerHour))}/giờ</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ĐÁNH GIÁ */}
        <div className="bg-white border border-line rounded-2xl shadow-card p-5">
          <h2 className="font-display font-bold text-ink text-lg mb-3">Đánh giá ({reviews.totalReviews})</h2>
          {reviews.items.length === 0 ? (
            <p className="text-muted text-sm">Chưa có đánh giá nào cho cơ sở này.</p>
          ) : (
            <div className="space-y-4">
              {reviews.items.map((r) => (
                <div key={r.id} className="border-b border-line last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-pitch-soft flex items-center justify-center text-pitch font-bold text-sm overflow-hidden">
                        {r.userAvatar ? <img src={r.userAvatar} alt="" className="w-full h-full object-cover" /> : (r.userName?.charAt(0) || 'U')}
                      </div>
                      <span className="font-semibold text-ink text-sm">{r.userName}</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={13} className={r.rating >= s ? 'text-amber fill-amber' : 'text-line'} />)}
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-ink mt-2">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* THANH ĐÁY */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-line px-4 py-3 shadow-[0_-10px_30px_rgba(6,35,26,0.08)]">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(`/booking/${venueId}`)}
            disabled={venue.status !== 'ACTIVE'}
            className={`w-full h-13 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${venue.status === 'ACTIVE' ? 'bg-pitch text-white shadow-glow hover:bg-pitch-deep' : 'bg-chalk text-muted border border-line cursor-not-allowed'}`}
          >
            <CalendarCheck size={18} /> {venue.status === 'ACTIVE' ? 'Đặt lịch ngay' : 'Hiện chưa thể đặt'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;
