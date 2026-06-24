import React, { useEffect, useMemo, useState } from 'react';
import { paymentService } from '../../services/paymentService';
import { Check, X, Loader2, ImageIcon, RefreshCw } from 'lucide-react';
import { formatPrice } from '../../../../shared/utils/formatDate';

const STATUS_BADGE = {
  PENDING: 'bg-amber-50 text-amber-600 border-amber-200',
  PAID: 'bg-pitch-soft text-pitch border-pitch/20',
  FAILED: 'bg-red-50 text-red-600 border-red-200',
  EXPIRED: 'bg-chalk text-muted border-line',
  REFUNDED: 'bg-chalk text-muted border-line',
};

const ManagePayments = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [preview, setPreview] = useState(null);

  const load = () => {
    setLoading(true);
    paymentService.adminList()
      .then((res) => { if (res.data.code === 0) setItems(res.data.result || []); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => (filter === 'ALL' ? items : items.filter((i) => i.status === filter)),
    [items, filter]
  );

  const act = async (id, type) => {
    setBusyId(id);
    try {
      const res = type === 'approve'
        ? await paymentService.adminApprove(id)
        : await paymentService.adminReject(id);
      if (res.data.code === 0) {
        setItems((prev) => prev.map((i) => (i.paymentId === id ? res.data.result : i)));
      }
    } catch (e) {
      alert('Thao tác thất bại.');
    } finally {
      setBusyId(null);
    }
  };

  const FILTERS = [
    { v: 'ALL', l: 'Tất cả' },
    { v: 'PENDING', l: 'Chờ duyệt' },
    { v: 'PAID', l: 'Đã duyệt' },
    { v: 'FAILED', l: 'Từ chối' },
  ];

  return (
    <div className="animate-fade-up">
      {/* HEADER */}
      <div className="stadium pitch-lines rounded-3xl px-8 py-7 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">Duyệt thanh toán</h1>
          <p className="text-white/60 text-sm font-medium mt-1">Xác nhận chuyển khoản của khách để hoàn tất đặt sân</p>
        </div>
        <button onClick={load} className="bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all w-fit">
          <RefreshCw size={18} /> Tải lại
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${filter === f.v ? 'bg-pitch text-white border-pitch shadow-glow' : 'bg-white text-ink border-line hover:border-pitch'}`}
          >
            {f.l}
          </button>
        ))}
      </div>

      {/* BẢNG */}
      <div className="bg-white rounded-2xl shadow-card border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-chalk border-b border-line">
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Mã đặt</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Khách</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Sân</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-right">Số tiền</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Bill</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={7} className="py-16 text-center"><Loader2 className="animate-spin text-pitch mx-auto" size={28} /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-muted">Không có thanh toán nào.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.paymentId} className="hover:bg-chalk transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-ink text-sm">{p.bookingCode}</p>
                    <p className="text-[11px] text-muted">{p.method}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-ink text-sm">{p.customerName}</p>
                    <p className="text-[11px] text-muted">{p.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-ink">{p.fieldName}</p>
                    <p className="text-[11px] text-muted">{p.venueName} · {p.bookingDate}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-display font-extrabold text-pitch">{formatPrice(p.amount)}</td>
                  <td className="px-6 py-4 text-center">
                    {p.proofImageUrl ? (
                      <button onClick={() => setPreview(p.proofImageUrl)} className="inline-flex items-center gap-1 text-pitch hover:text-pitch-deep text-xs font-semibold">
                        <ImageIcon size={16} /> Xem
                      </button>
                    ) : (
                      <span className="text-[11px] text-muted">Chưa có</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${STATUS_BADGE[p.status] || 'bg-chalk text-muted border-line'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {p.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={busyId === p.paymentId}
                          onClick={() => act(p.paymentId, 'approve')}
                          className="inline-flex items-center gap-1 bg-pitch text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-glow hover:bg-pitch-deep disabled:opacity-50"
                        >
                          {busyId === p.paymentId ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Duyệt
                        </button>
                        <button
                          disabled={busyId === p.paymentId}
                          onClick={() => act(p.paymentId, 'reject')}
                          className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-red-100 disabled:opacity-50"
                        >
                          <X size={14} /> Từ chối
                        </button>
                      </div>
                    ) : (
                      <p className="text-right text-[11px] text-muted">Đã xử lý</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* XEM ẢNH BILL */}
      {preview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={() => setPreview(null)}>
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" />
          <img src={preview} alt="bill" className="relative max-h-[85vh] max-w-full rounded-2xl shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default ManagePayments;
