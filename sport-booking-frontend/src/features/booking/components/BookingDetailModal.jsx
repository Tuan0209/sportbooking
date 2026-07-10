import React, { useEffect, useState } from 'react';
import { X, Loader2, MapPin, CalendarDays, Clock, User, Phone, Coffee, NotebookPen } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { formatPrice } from '../../../shared/utils/formatDate';

const STATUS_LABEL = {
  PENDING_PAYMENT: 'Chờ thanh toán',
  PENDING_CONFIRMATION: 'Chờ duyệt',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELED: 'Đã huỷ',
  REJECTED: 'Từ chối',
};
const PAYMENT_LABEL = {
  PENDING: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  FAILED: 'Thất bại',
  EXPIRED: 'Hết hạn',
  REFUNDED: 'Đã hoàn tiền',
};
const METHOD_LABEL = {
  COIN: 'Ví coin',
  BANK_QR: 'Chuyển khoản QR',
  PAYOS: 'Cổng PayOS',
};

const Row = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3 py-2">
    <Icon size={16} className="text-pitch mt-0.5 shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-muted uppercase tracking-wide font-semibold">{label}</p>
      <div className="text-sm text-ink font-medium mt-0.5">{children}</div>
    </div>
  </div>
);

const BookingDetailModal = ({ bookingId, admin = false, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetcher = admin ? bookingService.adminDetail : bookingService.detail;
    fetcher(bookingId)
      .then((res) => { if (res.data.code === 0) setDetail(res.data.result); else setError(res.data.message || 'Không tải được chi tiết'); })
      .catch((e) => setError(e.response?.data?.message || 'Không tải được chi tiết'))
      .finally(() => setLoading(false));
  }, [bookingId, admin]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-md rounded-4xl shadow-card-hover relative overflow-hidden animate-fade-up max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-line flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">Chi tiết đặt sân</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-chalk flex items-center justify-center text-muted hover:text-ink transition" aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-pitch" size={28} /></div>
          ) : error ? (
            <p className="text-center text-red-600 text-sm py-8">{error}</p>
          ) : detail ? (
            <div className="divide-y divide-line">
              <div className="flex items-center justify-between pb-3">
                <span className="text-[12px] text-muted">Mã đơn</span>
                <span className="font-display font-bold text-ink">{detail.bookingCode}</span>
              </div>

              <Row icon={MapPin} label="Cơ sở / Sân">
                <p className="font-semibold">{detail.venueName} · {detail.fieldName}</p>
                {detail.fieldTypeName && <p className="text-muted text-[12px]">{detail.fieldTypeName}</p>}
                {detail.venueAddress && <p className="text-muted text-[12px]">{detail.venueAddress}</p>}
              </Row>

              <Row icon={CalendarDays} label="Ngày">
                {new Date(detail.bookingDate).toLocaleDateString('vi-VN')}
              </Row>

              <Row icon={Clock} label="Khung giờ">
                {detail.startTime?.slice(0, 5)} - {detail.endTime?.slice(0, 5)}
                {Array.isArray(detail.slots) && detail.slots.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {detail.slots.map((s) => (
                      <span key={s} className="text-[11px] bg-pitch-soft text-pitch-deep rounded-full px-2 py-0.5 font-semibold">{s}</span>
                    ))}
                  </div>
                )}
              </Row>

              <Row icon={User} label="Người đặt">{detail.customerName}</Row>
              <Row icon={Phone} label="Số điện thoại">{detail.customerPhone}</Row>

              <div className="py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee size={16} className="text-pitch" />
                  <p className="text-[11px] text-muted uppercase tracking-wide font-semibold">Dịch vụ kèm theo</p>
                </div>
                {Array.isArray(detail.services) && detail.services.length > 0 ? (
                  <div className="space-y-1.5">
                    {detail.services.map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-ink">{s.name} <span className="text-muted">× {s.quantity}</span></span>
                        <span className="font-semibold text-ink">{formatPrice(s.lineTotal)}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between text-sm pt-1.5 border-t border-line">
                      <span className="text-muted">Tổng dịch vụ</span>
                      <span className="font-semibold text-pitch">{formatPrice(detail.servicesTotal)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted">Không có dịch vụ kèm theo.</p>
                )}
              </div>

              {detail.note && (
                <Row icon={NotebookPen} label="Ghi chú">{detail.note}</Row>
              )}

              <div className="pt-3 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Trạng thái</span>
                  <span className="font-semibold text-ink">{STATUS_LABEL[detail.status] || detail.status}</span>
                </div>
                {detail.paymentMethod && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Thanh toán</span>
                    <span className="font-semibold text-ink">
                      {METHOD_LABEL[detail.paymentMethod] || detail.paymentMethod}
                      {detail.paymentStatus ? ` · ${PAYMENT_LABEL[detail.paymentStatus] || detail.paymentStatus}` : ''}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-ink font-semibold">Tổng tiền</span>
                  <span className="text-xl font-display font-extrabold text-pitch">{formatPrice(detail.totalPrice)}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
