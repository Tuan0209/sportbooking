import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Wallet, Landmark, RotateCcw, CheckCircle2, Star } from 'lucide-react';
import { refundService } from '../../payment/services/refundService';
import { reviewService } from '../../review/services/reviewService';
import { formatPrice } from '../../../shared/utils/formatDate';

const STATUS = {
  CONFIRMED: { l: 'Đã xác nhận', c: 'bg-pitch-soft text-pitch border-pitch/20' },
  PENDING_PAYMENT: { l: 'Chờ thanh toán', c: 'bg-amber-50 text-amber-600 border-amber-200' },
  PENDING_CONFIRMATION: { l: 'Chờ duyệt', c: 'bg-amber-50 text-amber-600 border-amber-200' },
  COMPLETED: { l: 'Hoàn thành', c: 'bg-pitch-soft text-pitch border-pitch/20' },
  CANCELED: { l: 'Đã huỷ', c: 'bg-red-50 text-red-600 border-red-200' },
  REJECTED: { l: 'Bị từ chối', c: 'bg-red-50 text-red-600 border-red-200' },
};

const MyBookings = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refundFor, setRefundFor] = useState(null); // booking đang yêu cầu hoàn
  const [reviewFor, setReviewFor] = useState(null); // booking đang đánh giá
  const [done, setDone] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  const load = () => {
    setLoading(true);
    refundService.myBookings()
      .then((res) => { if (res.data.code === 0) setItems(res.data.result || []); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-chalk pb-28">
      <div className="stadium pitch-lines text-white">
        <div className="h-14 px-4 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition">
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-[18px] font-display font-bold tracking-tight">Sân đã đặt</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-pitch" size={32} /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-ink text-lg font-bold">Chưa có lượt đặt nào</p>
            <p className="text-muted text-sm mt-1">Đặt sân đầu tiên của bạn ngay thôi!</p>
          </div>
        ) : items.map((b) => {
          const st = STATUS[b.status] || { l: b.status, c: 'bg-chalk text-muted border-line' };
          return (
            <div key={b.id} className="bg-white border border-line rounded-2xl shadow-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-bold text-ink">{b.fieldName}</p>
                  <p className="text-[12px] text-muted">{b.venueName} · {b.bookingDate}</p>
                  <p className="text-[11px] text-muted mt-1">Mã: {b.bookingCode}</p>
                </div>
                <span className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold border ${st.c}`}>{st.l}</span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-line">
                <span className="font-display text-lg font-extrabold text-pitch">{formatPrice(b.totalPrice)}</span>
                <div className="flex gap-2">
                  {b.status === 'PENDING_PAYMENT' && (
                    <button onClick={() => navigate(`/payment/${b.id}`)} className="text-sm font-semibold bg-pitch text-white px-4 py-2 rounded-xl shadow-glow hover:bg-pitch-deep transition">
                      Thanh toán
                    </button>
                  )}
                  {b.refundable && (
                    <button onClick={() => setRefundFor(b)} className="text-sm font-semibold border border-line text-ink px-4 py-2 rounded-xl hover:bg-chalk transition inline-flex items-center gap-1">
                      <RotateCcw size={15} /> Hoàn tiền
                    </button>
                  )}
                  {(b.status === 'CONFIRMED' || b.status === 'COMPLETED') && (
                    <button onClick={() => setReviewFor(b)} className="text-sm font-semibold border border-line text-ink px-4 py-2 rounded-xl hover:bg-chalk transition inline-flex items-center gap-1">
                      <Star size={15} className="text-amber" /> Đánh giá
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {refundFor && (
        <RefundModal
          booking={refundFor}
          onClose={() => setRefundFor(null)}
          onSuccess={() => { setRefundFor(null); setDone(true); load(); }}
        />
      )}

      {reviewFor && (
        <ReviewModal
          booking={reviewFor}
          onClose={() => setReviewFor(null)}
          onSuccess={() => { setReviewFor(null); setReviewed(true); }}
        />
      )}

      {reviewed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setReviewed(false)} />
          <div className="bg-white w-full max-w-sm rounded-4xl shadow-card-hover relative p-7 text-center animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber mx-auto mb-4">
              <Star size={34} className="fill-amber" />
            </div>
            <h3 className="font-display text-xl font-extrabold text-ink">Cảm ơn đánh giá của bạn!</h3>
            <p className="text-muted text-sm mt-2">Đánh giá giúp cộng đồng chọn sân tốt hơn.</p>
            <button onClick={() => setReviewed(false)} className="mt-5 w-full h-12 rounded-2xl bg-pitch text-white font-semibold shadow-glow hover:bg-pitch-deep transition">Đã hiểu</button>
          </div>
        </div>
      )}

      {done && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setDone(false)} />
          <div className="bg-white w-full max-w-sm rounded-4xl shadow-card-hover relative p-7 text-center animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-pitch-soft flex items-center justify-center text-pitch mx-auto mb-4">
              <CheckCircle2 size={34} />
            </div>
            <h3 className="font-display text-xl font-extrabold text-ink">Đã gửi yêu cầu hoàn tiền</h3>
            <p className="text-muted text-sm mt-2">Chủ sân sẽ xử lý và hoàn tiền cho bạn sớm nhất.</p>
            <button onClick={() => setDone(false)} className="mt-5 w-full h-12 rounded-2xl bg-pitch text-white font-semibold shadow-glow hover:bg-pitch-deep transition">Đã hiểu</button>
          </div>
        </div>
      )}
    </div>
  );
};

const RefundModal = ({ booking, onClose, onSuccess }) => {
  const [method, setMethod] = useState('COIN');
  const [bank, setBank] = useState({ bankName: '', bankAccount: '', bankAccountName: '' });
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = method === 'COIN' || (bank.bankName && bank.bankAccount && bank.bankAccountName);

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await refundService.createRefund({
        bookingId: booking.id,
        refundMethod: method,
        ...(method === 'BANK_TRANSFER' ? bank : {}),
      });
      onSuccess();
    } catch (e) {
      alert(e.response?.data?.message || 'Gửi yêu cầu hoàn tiền thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-sm rounded-4xl shadow-card-hover relative overflow-hidden animate-fade-up">
        <div className="p-6 border-b border-line">
          <h3 className="font-display text-lg font-bold text-ink">Yêu cầu hoàn tiền</h3>
          <p className="text-muted text-sm mt-1">{booking.fieldName} · {formatPrice(booking.totalPrice)}</p>
        </div>
        <div className="p-6 space-y-3">
          <button onClick={() => setMethod('COIN')} className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 text-left transition-all ${method === 'COIN' ? 'border-pitch bg-pitch-soft' : 'border-line'}`}>
            <Wallet size={20} className="text-pitch" />
            <div>
              <p className="font-semibold text-ink text-sm">Hoàn vào ví (Coin)</p>
              <p className="text-[11px] text-muted">Nhận ngay sau khi được duyệt</p>
            </div>
          </button>
          <button onClick={() => setMethod('BANK_TRANSFER')} className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 text-left transition-all ${method === 'BANK_TRANSFER' ? 'border-pitch bg-pitch-soft' : 'border-line'}`}>
            <Landmark size={20} className="text-pitch" />
            <div>
              <p className="font-semibold text-ink text-sm">Chuyển khoản ngân hàng</p>
              <p className="text-[11px] text-muted">Chủ sân chuyển lại qua tài khoản</p>
            </div>
          </button>

          {method === 'BANK_TRANSFER' && (
            <div className="space-y-2 pt-1">
              <input placeholder="Tên ngân hàng" value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} className="w-full px-4 py-3 bg-chalk border border-line rounded-xl text-sm text-ink focus:outline-none focus:border-pitch focus:ring-2 focus:ring-pitch/20" />
              <input placeholder="Số tài khoản" value={bank.bankAccount} onChange={(e) => setBank({ ...bank, bankAccount: e.target.value })} className="w-full px-4 py-3 bg-chalk border border-line rounded-xl text-sm text-ink focus:outline-none focus:border-pitch focus:ring-2 focus:ring-pitch/20" />
              <input placeholder="Tên chủ tài khoản" value={bank.bankAccountName} onChange={(e) => setBank({ ...bank, bankAccountName: e.target.value })} className="w-full px-4 py-3 bg-chalk border border-line rounded-xl text-sm text-ink focus:outline-none focus:border-pitch focus:ring-2 focus:ring-pitch/20" />
            </div>
          )}
        </div>
        <div className="p-4 grid grid-cols-2 gap-3 border-t border-line bg-chalk">
          <button onClick={onClose} className="py-3 text-sm font-bold text-muted rounded-2xl border border-line bg-white">Huỷ</button>
          <button onClick={submit} disabled={!canSubmit || submitting} className={`py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition ${canSubmit && !submitting ? 'bg-pitch text-white shadow-glow hover:bg-pitch-deep' : 'bg-line text-muted'}`}>
            {submitting && <Loader2 size={16} className="animate-spin" />} Gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await reviewService.create({ bookingId: booking.id, rating, comment });
      onSuccess();
    } catch (e) {
      alert(e.response?.data?.message || 'Gửi đánh giá thất bại (có thể bạn đã đánh giá đơn này).');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-sm rounded-4xl shadow-card-hover relative overflow-hidden animate-fade-up">
        <div className="p-6 border-b border-line">
          <h3 className="font-display text-lg font-bold text-ink">Đánh giá sân</h3>
          <p className="text-muted text-sm mt-1">{booking.fieldName} · {booking.venueName}</p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center gap-2 mb-5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}>
                <Star size={36} className={(hover || rating) >= s ? 'text-amber fill-amber' : 'text-line'} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Chia sẻ cảm nhận của bạn về sân..."
            className="w-full rounded-xl bg-chalk border border-line px-4 py-3 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-pitch focus:border-pitch"
          />
        </div>
        <div className="p-4 grid grid-cols-2 gap-3 border-t border-line bg-chalk">
          <button onClick={onClose} className="py-3 text-sm font-bold text-muted rounded-2xl border border-line bg-white">Huỷ</button>
          <button onClick={submit} disabled={submitting} className="py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 bg-pitch text-white shadow-glow hover:bg-pitch-deep transition disabled:opacity-60">
            {submitting && <Loader2 size={16} className="animate-spin" />} Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
