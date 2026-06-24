import React, { useEffect, useMemo, useState } from 'react';
import { refundService } from '../../services/refundService';
import { Check, X, Loader2, RefreshCw, Wallet, Landmark } from 'lucide-react';
import { formatPrice } from '../../../../shared/utils/formatDate';

const STATUS_BADGE = {
  REQUESTED: 'bg-amber-50 text-amber-600 border-amber-200',
  APPROVED: 'bg-pitch-soft text-pitch border-pitch/20',
  DONE: 'bg-pitch-soft text-pitch border-pitch/20',
  REJECTED: 'bg-red-50 text-red-600 border-red-200',
};

const STATUS_LABEL = {
  REQUESTED: 'Chờ xử lý',
  APPROVED: 'Đã duyệt',
  DONE: 'Đã hoàn',
  REJECTED: 'Từ chối',
};

const ManageRefunds = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [bankModal, setBankModal] = useState(null); // refund object đang chờ nhập mã giao dịch
  const [txCode, setTxCode] = useState('');

  const load = () => {
    setLoading(true);
    refundService.adminList()
      .then((res) => { if (res.data.code === 0) setItems(res.data.result || []); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => (filter === 'ALL' ? items : items.filter((i) => i.status === filter)),
    [items, filter]
  );

  const replaceItem = (id, next) => {
    setItems((prev) => prev.map((i) => (i.refundId === id ? next : i)));
  };

  // Duyệt hoàn vào ví (COIN) ngay
  const approveCoin = async (id) => {
    setBusyId(id);
    try {
      const res = await refundService.adminApprove(id, {});
      if (res.data.code === 0) replaceItem(id, res.data.result);
    } catch (e) {
      alert('Thao tác thất bại.');
    } finally {
      setBusyId(null);
    }
  };

  // Xác nhận đã chuyển khoản (BANK_TRANSFER) kèm mã giao dịch
  const confirmBankTransfer = async () => {
    if (!bankModal) return;
    const id = bankModal.refundId;
    if (!txCode.trim()) { alert('Vui lòng nhập mã giao dịch.'); return; }
    setBusyId(id);
    try {
      const res = await refundService.adminApprove(id, { transactionCode: txCode.trim() });
      if (res.data.code === 0) replaceItem(id, res.data.result);
      setBankModal(null);
      setTxCode('');
    } catch (e) {
      alert('Thao tác thất bại.');
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id) => {
    setBusyId(id);
    try {
      const res = await refundService.adminReject(id);
      if (res.data.code === 0) replaceItem(id, res.data.result);
    } catch (e) {
      alert('Thao tác thất bại.');
    } finally {
      setBusyId(null);
    }
  };

  const FILTERS = [
    { v: 'ALL', l: 'Tất cả' },
    { v: 'REQUESTED', l: 'Chờ xử lý' },
    { v: 'DONE', l: 'Đã hoàn' },
    { v: 'REJECTED', l: 'Từ chối' },
  ];

  return (
    <div className="animate-fade-up">
      {/* HEADER */}
      <div className="stadium pitch-lines rounded-3xl px-8 py-7 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">Duyệt hoàn tiền</h1>
          <p className="text-white/60 text-sm font-medium mt-1">Xử lý yêu cầu hoàn tiền của khách</p>
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
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="bg-chalk border-b border-line">
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Mã đặt</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Khách</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Sân</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-right">Số tiền hoàn</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Thông tin nhận</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={7} className="py-16 text-center"><Loader2 className="animate-spin text-pitch mx-auto" size={28} /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-muted">Không có yêu cầu hoàn tiền nào.</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.refundId} className="hover:bg-chalk transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-ink text-sm">{r.bookingCode}</p>
                    <p className="text-[11px] text-muted inline-flex items-center gap-1 mt-0.5">
                      {r.refundMethod === 'COIN'
                        ? <><Wallet size={12} /> Hoàn vào ví</>
                        : <><Landmark size={12} /> Chuyển khoản</>}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-ink text-sm">{r.customerName}</p>
                    <p className="text-[11px] text-muted">{r.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-ink">{r.fieldName}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-display font-extrabold text-pitch">{formatPrice(r.refundAmount)}</td>
                  <td className="px-6 py-4">
                    {r.refundMethod === 'BANK_TRANSFER' ? (
                      <div className="text-[12px] leading-tight">
                        <p className="font-semibold text-ink">{r.bankName}</p>
                        <p className="text-muted">{r.bankAccount}</p>
                        <p className="text-muted">{r.bankAccountName}</p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[12px] text-pitch font-semibold">
                        <Wallet size={14} /> Hoàn vào ví
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${STATUS_BADGE[r.status] || 'bg-chalk text-muted border-line'}`}>
                      {STATUS_LABEL[r.status] || r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {r.status === 'REQUESTED' ? (
                      <div className="flex items-center justify-end gap-2">
                        {r.refundMethod === 'COIN' ? (
                          <button
                            disabled={busyId === r.refundId}
                            onClick={() => approveCoin(r.refundId)}
                            className="inline-flex items-center gap-1 bg-pitch text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-glow hover:bg-pitch-deep disabled:opacity-50"
                          >
                            {busyId === r.refundId ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Duyệt hoàn
                          </button>
                        ) : (
                          <button
                            disabled={busyId === r.refundId}
                            onClick={() => { setBankModal(r); setTxCode(''); }}
                            className="inline-flex items-center gap-1 bg-pitch text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-glow hover:bg-pitch-deep disabled:opacity-50"
                          >
                            {busyId === r.refundId ? <Loader2 size={14} className="animate-spin" /> : <Landmark size={14} />} Đã chuyển khoản
                          </button>
                        )}
                        <button
                          disabled={busyId === r.refundId}
                          onClick={() => reject(r.refundId)}
                          className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-red-100 disabled:opacity-50"
                        >
                          <X size={14} /> Từ chối
                        </button>
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="text-[11px] text-muted">Đã xử lý</p>
                        {r.transactionCode && (
                          <p className="text-[11px] text-ink font-medium mt-0.5">Mã GD: {r.transactionCode}</p>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NHẬP MÃ GIAO DỊCH (BANK_TRANSFER) */}
      {bankModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={() => { if (busyId !== bankModal.refundId) setBankModal(null); }}>
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-card border border-line w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-1">
              <Landmark size={20} className="text-pitch" />
              <h3 className="font-display text-lg font-extrabold text-ink">Xác nhận đã chuyển khoản</h3>
            </div>
            <p className="text-sm text-muted mb-4">
              Hoàn {formatPrice(bankModal.refundAmount)} cho <span className="font-semibold text-ink">{bankModal.customerName}</span> — đặt sân <span className="font-semibold text-ink">{bankModal.bookingCode}</span>.
            </p>

            <div className="bg-chalk border border-line rounded-xl p-3 mb-4 text-[12px] leading-relaxed">
              <p className="font-semibold text-ink">{bankModal.bankName}</p>
              <p className="text-muted">{bankModal.bankAccount}</p>
              <p className="text-muted">{bankModal.bankAccountName}</p>
            </div>

            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1">Mã giao dịch</label>
            <input
              autoFocus
              value={txCode}
              onChange={(e) => setTxCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') confirmBankTransfer(); }}
              placeholder="Nhập mã giao dịch ngân hàng"
              className="w-full border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-pitch focus:ring-2 focus:ring-pitch/20"
            />

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => { if (busyId !== bankModal.refundId) setBankModal(null); }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-ink border border-line hover:bg-chalk transition-all"
              >
                Hủy
              </button>
              <button
                disabled={busyId === bankModal.refundId}
                onClick={confirmBankTransfer}
                className="inline-flex items-center gap-1 bg-pitch text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-glow hover:bg-pitch-deep disabled:opacity-50"
              >
                {busyId === bankModal.refundId ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Xác nhận hoàn tiền
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRefunds;
