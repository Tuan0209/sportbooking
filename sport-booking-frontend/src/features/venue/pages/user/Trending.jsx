import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Ticket, Crown, Check, Copy, CheckCheck } from 'lucide-react';
import { voucherService } from '../../../voucher/services/voucherService';
import { membershipService } from '../../../membership/services/membershipService';
import { formatPrice } from '../../../../shared/utils/formatDate';

const formatVN = (dateStr) => {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  } catch {
    return null;
  }
};

const discountLabel = (v) =>
  v.discountType === 'PERCENT'
    ? `Giảm ${Number(v.discountValue)}%`
    : `Giảm ${formatPrice(v.discountValue)}`;

const Trending = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    Promise.all([
      voucherService.list()
        .then((res) => { if (res.data.code === 0) setVouchers(res.data.result || []); })
        .catch(() => setVouchers([])),
      membershipService.plans()
        .then((res) => { setPlans((res.data.result || []).filter((p) => p.status === 'ACTIVE')); })
        .catch(() => setPlans([])),
    ]).finally(() => setLoading(false));
  }, []);

  const copyCode = (code) => {
    try {
      navigator.clipboard?.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* bỏ qua nếu trình duyệt chặn clipboard */
    }
  };

  return (
    <div className="min-h-screen bg-chalk pb-28 font-sans animate-fade-up">
      {/* HERO */}
      <div className="stadium pitch-lines px-4 md:px-8 pt-8 pb-10 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full border border-white/10" />
        <div className="max-w-[1600px] mx-auto relative">
          <span className="inline-flex items-center gap-1.5 text-lime text-[11px] font-bold uppercase tracking-widest bg-white/10 rounded-full px-3 py-1 mb-3">
            <Sparkles size={13} /> Ưu đãi
          </span>
          <h1 className="font-display text-white text-2xl md:text-3xl font-extrabold tracking-tight">Ưu đãi &amp; Gói VIP</h1>
          <p className="text-white/70 text-sm mt-2 max-w-md">Mã giảm giá đang mở và các gói thành viên giúp bạn tiết kiệm mỗi lần đặt sân.</p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-8 -mt-6 space-y-10">
        {/* MÃ GIẢM GIÁ */}
        <div>
          <div className="flex items-center gap-2 mb-5 px-1">
            <Ticket size={18} className="text-pitch" />
            <h2 className="text-sm font-bold text-muted uppercase tracking-[0.2em]">Mã giảm giá</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-white border border-line rounded-3xl animate-pulse" />)}
            </div>
          ) : vouchers.length === 0 ? (
            <p className="text-muted text-sm px-1">Hiện chưa có mã giảm giá nào đang mở.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {vouchers.map((v) => {
                const expiry = formatVN(v.endDate);
                return (
                  <div key={v.id} className="relative bg-white border border-line rounded-3xl shadow-card overflow-hidden flex">
                    <div className="w-2 bg-pitch shrink-0" />
                    <div className="p-5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-extrabold text-pitch text-xl truncate">{v.code}</span>
                        <span className="text-[11px] font-bold uppercase tracking-wide bg-pitch-soft text-pitch-deep rounded-full px-2.5 py-1 shrink-0">
                          {discountLabel(v)}
                        </span>
                      </div>

                      {v.description && (
                        <p className="text-sm text-muted mt-2 line-clamp-2">{v.description}</p>
                      )}

                      <div className="text-[12px] text-muted mt-3 space-y-0.5">
                        {Number(v.minOrder) > 0 && <p>Đơn tối thiểu: {formatPrice(v.minOrder)}</p>}
                        {Number(v.maxDiscount) > 0 && <p>Giảm tối đa: {formatPrice(v.maxDiscount)}</p>}
                        {expiry && <p>HSD: {expiry}</p>}
                      </div>

                      <button
                        onClick={() => copyCode(v.code)}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-pitch hover:text-pitch-deep transition"
                      >
                        {copied === v.code ? <><CheckCheck size={15} /> Đã sao chép</> : <><Copy size={15} /> Sao chép mã</>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* GÓI VIP */}
        <div>
          <div className="flex items-center gap-2 mb-5 px-1">
            <Crown size={18} className="text-amber" />
            <h2 className="text-sm font-bold text-muted uppercase tracking-[0.2em]">Gói VIP</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-white border border-line rounded-3xl animate-pulse" />)}
            </div>
          ) : plans.length === 0 ? (
            <p className="text-muted text-sm px-1">Hiện chưa có gói thành viên nào.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-white border border-line rounded-3xl shadow-card p-5 flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-amber/15 flex items-center justify-center shrink-0">
                      <Crown className="text-amber" size={24} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-ink text-lg truncate">{plan.name}</h3>
                      {plan.discountPercent > 0 && (
                        <span className="inline-block mt-1 text-xs font-medium text-pitch bg-pitch/10 px-2 py-0.5 rounded-full">
                          Giảm {plan.discountPercent}% mỗi lần đặt
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-2xl font-display font-extrabold text-ink">{formatPrice(plan.price)}</span>
                    <span className="text-sm text-muted mb-1">/{plan.durationDays} ngày</span>
                  </div>

                  {plan.description && <p className="mt-2 text-sm text-muted line-clamp-2">{plan.description}</p>}

                  {Array.isArray(plan.benefits) && plan.benefits.length > 0 && (
                    <ul className="mt-3 space-y-1.5 flex-1">
                      {plan.benefits.slice(0, 3).map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-ink/90">
                          <span className="h-5 w-5 rounded-full bg-pitch/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="text-pitch" size={13} />
                          </span>
                          <span className="truncate">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    onClick={() => navigate('/membership')}
                    className="mt-5 w-full h-11 rounded-2xl font-semibold bg-pitch text-white shadow-glow hover:bg-pitch-deep transition active:scale-[0.99]"
                  >
                    Xem &amp; mua gói
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trending;
