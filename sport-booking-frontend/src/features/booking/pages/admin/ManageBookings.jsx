import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { Check, X, CheckCircle2, Loader2, RefreshCw, Calendar } from 'lucide-react';
import { formatPrice } from '../../../../shared/utils/formatDate';

const STATUS_LABEL = {
  PENDING_PAYMENT: 'Chờ thanh toán',
  PENDING_CONFIRMATION: 'Chờ duyệt',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELED: 'Đã huỷ',
  REJECTED: 'Bị từ chối',
};

const badgeClass = (status) => {
  if (status === 'CONFIRMED' || status === 'COMPLETED') return 'bg-pitch-soft text-pitch border-pitch/20';
  if (status === 'CANCELED' || status === 'REJECTED') return 'bg-red-50 text-red-600 border-red-200';
  if (status && status.startsWith('PENDING')) return 'bg-amber-50 text-amber-600 border-amber-200';
  return 'bg-chalk text-muted border-line';
};

const FILTERS = [
  { v: '', l: 'Tất cả' },
  { v: 'PENDING_CONFIRMATION', l: 'Chờ duyệt' },
  { v: 'CONFIRMED', l: 'Đã xác nhận' },
  { v: 'COMPLETED', l: 'Hoàn thành' },
  { v: 'CANCELED', l: 'Đã huỷ' },
];

const ManageBookings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    bookingService.adminList(filter || undefined)
      .then((res) => { if (res.data.code === 0) setItems(res.data.result || []); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      const res = await bookingService.adminUpdateStatus(id, status);
      if (res.data.code === 0) {
        setItems((prev) => prev.map((i) => (i.id === id ? res.data.result : i)));
      }
    } catch (e) {
      alert('Thao tác thất bại.');
    } finally {
      setBusyId(null);
    }
  };

  const done = ['CONFIRMED', 'COMPLETED', 'CANCELED'];
  const closed = ['COMPLETED', 'CANCELED', 'REJECTED'];

  return (
    <div className="animate-fade-up">
      {/* HEADER */}
      <div className="stadium pitch-lines rounded-3xl px-8 py-7 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">Quản lý lịch đặt</h1>
          <p className="text-white/60 text-sm font-medium mt-1">Toàn bộ lịch đặt sân của khách</p>
        </div>
        <button onClick={load} className="bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all w-fit">
          <RefreshCw size={18} /> Tải lại
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.v || 'ALL'}
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
          <table className="w-full text-left min-w-[1050px]">
            <thead>
              <tr className="bg-chalk border-b border-line">
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Mã đặt</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Khách</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Sân</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Ngày &amp; giờ</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-right">Tổng tiền</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={7} className="py-16 text-center"><Loader2 className="animate-spin text-pitch mx-auto" size={28} /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-muted">Không có lịch đặt nào.</td></tr>
              ) : items.map((b) => (
                <tr key={b.id} className="hover:bg-chalk transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-ink text-sm">{b.bookingCode}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-ink text-sm">{b.customerName}</p>
                    <p className="text-[11px] text-muted">{b.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-ink">{b.fieldName}</p>
                    <p className="text-[11px] text-muted">{b.venueName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-ink flex items-center gap-1.5">
                      <Calendar size={14} className="text-muted" /> {b.bookingDate}
                    </p>
                    <p className="text-[11px] text-muted mt-0.5">
                      {b.startTime?.slice(0, 5)} - {b.endTime?.slice(0, 5)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right font-display font-extrabold text-pitch">{formatPrice(b.totalPrice)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${badgeClass(b.status)}`}>
                      {STATUS_LABEL[b.status] || b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {!done.includes(b.status) && (
                        <button
                          disabled={busyId === b.id}
                          onClick={() => updateStatus(b.id, 'CONFIRMED')}
                          className="inline-flex items-center gap-1 bg-pitch text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-glow hover:bg-pitch-deep disabled:opacity-50"
                        >
                          {busyId === b.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Xác nhận
                        </button>
                      )}
                      {b.status === 'CONFIRMED' && (
                        <button
                          disabled={busyId === b.id}
                          onClick={() => updateStatus(b.id, 'COMPLETED')}
                          className="inline-flex items-center gap-1 bg-pitch text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-glow hover:bg-pitch-deep disabled:opacity-50"
                        >
                          {busyId === b.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Hoàn thành
                        </button>
                      )}
                      {!closed.includes(b.status) && (
                        <button
                          disabled={busyId === b.id}
                          onClick={() => updateStatus(b.id, 'CANCELED')}
                          className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-red-100 disabled:opacity-50"
                        >
                          <X size={14} /> Huỷ
                        </button>
                      )}
                      {closed.includes(b.status) && (
                        <p className="text-right text-[11px] text-muted">Đã xử lý</p>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
