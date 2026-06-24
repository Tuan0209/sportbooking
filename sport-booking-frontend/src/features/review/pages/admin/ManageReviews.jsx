import React, { useEffect, useState } from 'react';
import { reviewService } from '../../services/reviewService';
import { Star, Trash2, Loader2, RefreshCw } from 'lucide-react';

const ManageReviews = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    reviewService.adminList()
      .then((res) => setItems(res.data.result || []))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn gỡ đánh giá này?')) return;
    setBusyId(id);
    try {
      await reviewService.adminDelete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      alert('Xoá đánh giá thất bại.');
    } finally {
      setBusyId(null);
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="animate-fade-up">
      {/* HEADER */}
      <div className="stadium pitch-lines rounded-3xl px-8 py-7 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">Kiểm duyệt đánh giá</h1>
          <p className="text-white/60 text-sm font-medium mt-1">Xem và gỡ các đánh giá không phù hợp</p>
        </div>
        <button onClick={load} className="bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all w-fit">
          <RefreshCw size={18} /> Tải lại
        </button>
      </div>

      {/* DANH SÁCH */}
      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="animate-spin text-pitch mx-auto" size={28} />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-line rounded-2xl shadow-card p-16 text-center text-muted">
          Chưa có đánh giá nào
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((r) => (
            <div key={r.id} className="bg-white border border-line rounded-2xl shadow-card p-5">
              {/* Hàng đầu: avatar + tên + thời gian + sao */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {r.userAvatar ? (
                    <img src={r.userAvatar} alt={r.userName} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-pitch-soft text-pitch font-bold flex items-center justify-center flex-shrink-0">
                      {(r.userName || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-ink truncate">{r.userName}</p>
                    <p className="text-xs text-muted">{formatDate(r.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={s <= r.rating ? 'text-amber fill-amber' : 'text-line'}
                    />
                  ))}
                </div>
              </div>

              {/* Sân · venue */}
              <p className="text-xs text-muted mt-3">{r.venueName} · {r.fieldName}</p>

              {/* Nội dung */}
              {r.comment && (
                <p className="text-ink mt-2 leading-relaxed">{r.comment}</p>
              )}

              {/* Nút xoá */}
              <div className="flex justify-end mt-3">
                <button
                  disabled={busyId === r.id}
                  onClick={() => handleDelete(r.id)}
                  className="inline-flex items-center gap-1 text-red-600 bg-red-50 hover:bg-red-100 text-xs font-semibold px-3 py-2 rounded-xl disabled:opacity-50"
                >
                  {busyId === r.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
