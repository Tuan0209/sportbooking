import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Copy, Check, Upload, Loader2, ShieldCheck, Clock, CreditCard } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { formatPrice } from '../../../shared/utils/formatDate';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState('');

  const load = () => {
    paymentService.getByBooking(bookingId)
      .then((res) => { if (res.data.code === 0) setPayment(res.data.result); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [bookingId]);

  const copy = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 1500);
  };

  const handlePayos = async () => {
    setUploading(true);
    try {
      const res = await paymentService.mockSuccess(payment.paymentId);
      if (res.data.code === 0) setPayment(res.data.result);
    } catch (err) {
      alert('Thanh toán PayOS thất bại, vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await paymentService.uploadProof(payment.paymentId, file);
      if (res.data.code === 0) setPayment(res.data.result);
    } catch (err) {
      alert('Tải bill thất bại, vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-chalk"><Loader2 className="animate-spin text-pitch" size={34} /></div>;
  }
  if (!payment) {
    return <div className="h-screen flex items-center justify-center bg-chalk text-muted">Không tìm thấy thông tin thanh toán</div>;
  }

  const paid = payment.status === 'PAID';
  const isPayos = payment.method === 'PAYOS';
  const waiting = !isPayos && !!payment.proofImageUrl && !paid;

  return (
    <div className="min-h-screen bg-chalk pb-10">
      <div className="stadium pitch-lines text-white">
        <div className="h-14 px-4 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition">
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-[18px] font-display font-bold tracking-tight">Thanh toán chuyển khoản</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* TRẠNG THÁI */}
        {paid ? (
          <div className="bg-pitch-soft border border-pitch/20 rounded-2xl p-4 flex items-center gap-3 text-pitch">
            <ShieldCheck size={22} /> <span className="font-semibold">Đã thanh toán & xác nhận</span>
          </div>
        ) : waiting ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-600">
            <Clock size={22} /> <span className="font-semibold">Đã gửi bill — đang chờ chủ sân duyệt</span>
          </div>
        ) : (
          <div className="bg-white border border-line rounded-2xl p-4 text-center">
            <p className="text-muted text-sm">
              {isPayos ? 'Thanh toán nhanh qua cổng PayOS' : 'Quét mã hoặc chuyển khoản theo thông tin bên dưới'}
            </p>
          </div>
        )}

        {/* PAYOS */}
        {isPayos && !paid && (
          <div className="bg-white border border-line rounded-2xl shadow-card p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-pitch-soft flex items-center justify-center text-pitch mb-4">
              <CreditCard size={30} />
            </div>
            <p className="font-display font-bold text-ink text-lg">Cổng thanh toán PayOS</p>
            <p className="text-muted text-sm mt-1">Số tiền cần thanh toán</p>
            <p className="font-display text-2xl font-extrabold text-pitch mt-1">{formatPrice(payment.amount)}</p>
          </div>
        )}

        {/* QR (chỉ chuyển khoản tay) */}
        {!isPayos && !paid && (
          <div className="bg-white border border-line rounded-2xl shadow-card p-5 flex flex-col items-center">
            <img src={payment.qrUrl} alt="QR chuyển khoản" className="w-60 h-60 object-contain" />
            <p className="text-[11px] text-muted mt-2">Quét bằng app ngân hàng để chuyển nhanh</p>
          </div>
        )}

        {/* THÔNG TIN CK (chỉ chuyển khoản tay) */}
        {!isPayos && (
          <div className="bg-white border border-line rounded-2xl shadow-card p-5 space-y-3">
            <Row label="Ngân hàng" value={payment.bankName} />
            <Row label="Số tài khoản" value={payment.accountNo} onCopy={() => copy(payment.accountNo, 'acc')} copied={copied === 'acc'} />
            <Row label="Chủ tài khoản" value={payment.accountName} />
            <Row label="Số tiền" value={formatPrice(payment.amount)} valueClass="text-pitch font-display font-extrabold" onCopy={() => copy(String(Math.round(payment.amount)), 'amt')} copied={copied === 'amt'} />
            <Row label="Nội dung CK" value={payment.transferContent} onCopy={() => copy(payment.transferContent, 'ct')} copied={copied === 'ct'} />
          </div>
        )}

        {/* ẢNH BILL */}
        {!isPayos && payment.proofImageUrl && (
          <div className="bg-white border border-line rounded-2xl shadow-card p-4">
            <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-2">Bill đã gửi</p>
            <img src={payment.proofImageUrl} alt="bill" className="w-full rounded-xl border border-line" />
          </div>
        )}

        {/* HÀNH ĐỘNG */}
        {!paid && isPayos && (
          <button
            onClick={handlePayos}
            disabled={uploading}
            className={`w-full h-14 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${uploading ? 'bg-chalk text-muted border border-line' : 'bg-pitch text-white shadow-glow hover:bg-pitch-deep'}`}
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
            {uploading ? 'Đang xử lý...' : 'Thanh toán qua PayOS'}
          </button>
        )}

        {!paid && !isPayos && (
          <label className={`block w-full text-center h-14 rounded-2xl font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${uploading ? 'bg-chalk text-muted border border-line' : 'bg-pitch text-white shadow-glow hover:bg-pitch-deep'}`}>
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {uploading ? 'Đang tải...' : payment.proofImageUrl ? 'Tải lại ảnh bill' : 'Tải lên ảnh bill'}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        )}

        {paid && (
          <button onClick={() => navigate('/dashboard')} className="w-full h-14 rounded-2xl bg-pitch text-white font-semibold shadow-glow hover:bg-pitch-deep transition">
            Về trang chủ
          </button>
        )}
      </div>
    </div>
  );
};

const Row = ({ label, value, valueClass = 'text-ink font-semibold', onCopy, copied }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-muted text-sm shrink-0">{label}</span>
    <div className="flex items-center gap-2 min-w-0">
      <span className={`truncate ${valueClass}`}>{value}</span>
      {onCopy && (
        <button onClick={onCopy} className="text-pitch hover:text-pitch-deep shrink-0" aria-label="Sao chép">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      )}
    </div>
  </div>
);

export default PaymentPage;
