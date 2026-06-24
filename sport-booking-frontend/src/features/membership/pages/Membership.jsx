import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Crown, Check, Loader2, ShieldCheck } from 'lucide-react';
import { membershipService } from '../services/membershipService';
import { formatPrice } from '../../../shared/utils/formatDate';

const formatVN = (dateStr) => {
  if (!dateStr) return '--';
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  } catch {
    return dateStr;
  }
};

const Membership = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [my, setMy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  const loadMy = () => {
    return membershipService.my()
      .then((res) => { setMy(res.data.result || null); })
      .catch(() => { setMy(null); });
  };

  useEffect(() => {
    Promise.all([
      membershipService.plans()
        .then((res) => { setPlans(res.data.result || []); })
        .catch(() => { setPlans([]); }),
      loadMy(),
    ]).finally(() => setLoading(false));
  }, []);

  const handleBuy = async (planId) => {
    setBuyingId(planId);
    try {
      await membershipService.buy(planId);
      await loadMy();
      alert('Mua gói thành viên thành công!');
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Mua gói thất bại, vui lòng thử lại.';
      alert(message);
    } finally {
      setBuyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-chalk">
        <Loader2 className="animate-spin text-pitch" size={34} />
      </div>
    );
  }

  const currentPlanName = my?.planName;

  return (
    <div className="min-h-screen bg-chalk pb-28">
      {/* Header */}
      <div className="stadium pitch-lines text-white">
        <div className="h-14 px-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="h-10 w-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center active:scale-95 transition"
            aria-label="Quay lại"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-lg font-display font-semibold">Gói thành viên</h1>
        </div>

        {/* Thẻ gói đang dùng */}
        {my && (
          <div className="px-4 pb-6">
            <div className="bg-ink/40 backdrop-blur rounded-3xl p-5 border border-white/10 shadow-card animate-fade-up">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-lime/90 font-medium uppercase tracking-wide">
                    Đang kích hoạt
                  </p>
                  <p className="mt-1 text-xl font-display font-bold">
                    Bạn đang là {currentPlanName}
                  </p>
                  <p className="mt-1 text-sm text-white/85">
                    Giảm {my.discountPercent}% mỗi lần đặt sân
                  </p>
                  <p className="mt-2 text-xs text-white/70">
                    Hết hạn: {formatVN(my.endDate)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-lime/20 flex items-center justify-center shrink-0 shadow-glow-lime">
                  <ShieldCheck className="text-lime" size={26} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Danh sách gói */}
      <div className="px-4 pt-5 space-y-4">
        {plans.length === 0 ? (
          <div className="text-center text-muted py-16">
            Hiện chưa có gói thành viên nào.
          </div>
        ) : (
          plans.map((plan, idx) => {
            const isCurrent = currentPlanName && currentPlanName === plan.name;
            const isBuying = buyingId === plan.id;
            return (
              <div
                key={plan.id}
                className="bg-white border border-line rounded-3xl shadow-card p-5 animate-fade-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-pitch/10 flex items-center justify-center shrink-0">
                      <Crown className="text-pitch" size={26} />
                    </div>
                    <div>
                      <h2 className="text-lg font-display font-bold text-ink">
                        {plan.name}
                      </h2>
                      {plan.discountPercent > 0 && (
                        <span className="inline-block mt-1 text-xs font-medium text-pitch bg-pitch/10 px-2 py-0.5 rounded-full">
                          Giảm {plan.discountPercent}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-end gap-1">
                  <span className="text-3xl font-display font-extrabold text-ink">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-sm text-muted mb-1">
                    /{plan.durationDays} ngày
                  </span>
                </div>

                {plan.description && (
                  <p className="mt-2 text-sm text-muted">{plan.description}</p>
                )}

                {Array.isArray(plan.benefits) && plan.benefits.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {plan.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink/90">
                        <span className="h-5 w-5 rounded-full bg-pitch/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="text-pitch" size={14} />
                        </span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="button"
                  disabled={isCurrent || isBuying}
                  onClick={() => handleBuy(plan.id)}
                  className={`mt-5 w-full h-12 rounded-2xl font-semibold flex items-center justify-center gap-2 transition active:scale-[0.99] ${
                    isCurrent
                      ? 'bg-line text-muted cursor-not-allowed'
                      : 'bg-pitch text-white shadow-glow'
                  }`}
                >
                  {isBuying ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Đang xử lý...
                    </>
                  ) : isCurrent ? (
                    'Đang sử dụng'
                  ) : (
                    'Mua gói'
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Membership;
