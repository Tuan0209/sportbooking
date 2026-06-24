import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { voucherService } from '../../voucher/services/voucherService';
import { serviceService } from '../../service/services/serviceService';
import VenueMap from '../../../shared/components/VenueMap';
import {
  ChevronLeft,
  MapPin,
  CalendarDays,
  User,
  Phone,
  NotebookPen,
  Tag,
  X,
  Coffee,
  Plus,
  Minus
} from 'lucide-react';

import { formatPrice } from '../../../shared/utils/formatDate';

const BookingConfirm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user, setUser } = useContext(AuthContext);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Voucher
  const [voucherCode, setVoucherCode] = useState('');
  const [voucher, setVoucher] = useState(null); // { code, discount, finalAmount }
  const [voucherErr, setVoucherErr] = useState('');
  const [applying, setApplying] = useState(false);

  // Dịch vụ kèm sân
  const [services, setServices] = useState([]);
  const [qty, setQty] = useState({}); // { serviceId: số lượng }

  useEffect(() => {
    serviceService.list()
      .then((res) => { if (res.data.code === 0) setServices(res.data.result || []); })
      .catch(() => {});
  }, []);

  const changeQty = (id, delta) =>
    setQty((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: next };
    });
  const servicesTotal = services.reduce((sum, s) => sum + (qty[s.id] || 0) * Number(s.price), 0);

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const [note, setNote] = useState('');

  if (!state) {
    return (
      <div className="h-screen flex items-center justify-center bg-chalk text-muted font-medium">
        Không có dữ liệu đặt sân
      </div>
    );
  }

  const baseTotal = Number(state?.totalPrice || 0);
  const finalTotal = (voucher ? Number(voucher.finalAmount) : baseTotal) + servicesTotal;

  const applyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setApplying(true);
    setVoucherErr('');
    try {
      const res = await voucherService.apply(voucherCode.trim(), baseTotal);
      if (res.data.code === 0) {
        setVoucher(res.data.result);
      } else {
        setVoucherErr(res.data.message || 'Mã không hợp lệ');
      }
    } catch (err) {
      setVoucherErr(err.response?.data?.message || 'Mã không hợp lệ');
      setVoucher(null);
    } finally {
      setApplying(false);
    }
  };

  const removeVoucher = () => {
    setVoucher(null);
    setVoucherCode('');
    setVoucherErr('');
  };

  const handleConfirm = async () => {
    if (!state?.slots || state.slots.length === 0) {
      setError('Không có khung giờ để đặt.');
      return;
    }

    const totalPrice = finalTotal;
    const userCoins = Number(user?.coinBalance || 0);

    if (paymentMethod === 'COIN' && userCoins < totalPrice) {
      setError('Số dư coin không đủ để thanh toán.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await bookingService.createBooking({
        fieldId: state.fieldId,
        bookingDate: state.bookingDate,
        slots: state.slots,
        customerName: fullName,
        customerPhone: phone,
        note: voucher ? `${note || ''} [Mã: ${voucher.code}]`.trim() : note,
        totalPrice: finalTotal,
        paymentMethod: paymentMethod
      });

      const result = res.data.result;

      // Chuyển khoản QR / PayOS -> sang trang thanh toán
      if (paymentMethod === 'BANK_QR' || paymentMethod === 'PAYOS') {
        navigate(`/payment/${result.id}`);
        return;
      }

      if (paymentMethod === 'COIN' && user) {
        setUser({
          ...user,
          coinBalance: userCoins - totalPrice
        });
      }

      alert('Đặt sân và thanh toán bằng coin thành công.');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  console.log(user);

  return (
    <div className="min-h-screen bg-chalk pb-40">

      {/* HEADER */}

      <div className="sticky top-0 z-50 stadium pitch-lines h-14 flex items-center justify-center px-4">

        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 w-9 h-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
        >
          <ChevronLeft
            size={24}
            className="text-white"
          />
        </button>

        <h1 className="text-white font-display font-bold tracking-tight text-xl">
          Xác nhận đặt sân
        </h1>

      </div>

      <div className="p-4 space-y-4 animate-fade-up">

        {/* THÔNG TIN SÂN */}

        <div className="bg-white border border-line rounded-2xl p-4 shadow-card">

          <div className="flex items-center gap-2 mb-3">

            <MapPin
              size={18}
              className="text-pitch"
            />

            <h3 className="font-display font-bold text-ink text-lg">
              Thông tin sân
            </h3>

          </div>

          <div className="space-y-2">

            <div>
              <p className="text-ink font-display font-extrabold text-xl">
                {state.venueName}
              </p>
            </div>

            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-pitch-soft text-pitch-deep text-sm font-semibold">
                {state.fieldName}
              </span>
            </div>

            <div>
              <p className="text-muted text-sm">
                Địa chỉ: {state.venueAddress}
              </p>
            </div>

            {/* Bản đồ OpenStreetMap theo địa chỉ cơ sở */}
            <div className="pt-2">
              <VenueMap
                lat={state.venueLat}
                lng={state.venueLng}
                name={state.venueName}
                address={state.venueAddress}
                height={200}
              />
            </div>

          </div>

        </div>

        {/* THÔNG TIN LỊCH */}

        <div className="bg-white border border-line rounded-2xl p-4 shadow-card">

          <div className="flex items-center gap-2 mb-4">

            <CalendarDays
              size={18}
              className="text-pitch"
            />

            <h3 className="font-display font-bold text-ink text-lg">
              Thông tin lịch đặt
            </h3>

          </div>

          <div className="space-y-3 text-ink-soft">

            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-muted text-sm">Ngày</span>
              <span className="font-semibold text-ink">
                {new Date(
                  state.bookingDate
                ).toLocaleDateString('vi-VN')}
              </span>
            </div>

            <div className="flex items-start justify-between border-b border-line pb-3">
              <span className="text-muted text-sm">Khung giờ</span>
              <div className="text-right space-y-1">
                {state.ranges?.map((item, index) => (
                  <div key={index} className="font-semibold text-ink">
                    {item.start} - {item.end}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-muted text-sm">Loại sân</span>
              <span className="font-semibold text-ink">{state.fieldTypeName}</span>
            </div>

            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-muted text-sm">Tổng giờ</span>
              <span className="font-semibold text-ink">
                {Math.floor(
                  state.totalMinutes / 60
                )}
                h
                {state.totalMinutes % 60 > 0
                  ? state.totalMinutes % 60
                  : ''}
              </span>
            </div>

            {voucher && (
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-muted text-sm">Giảm giá ({voucher.code})</span>
                <span className="font-semibold text-pitch">- {formatPrice(voucher.discount)}</span>
              </div>
            )}

            {servicesTotal > 0 && (
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-muted text-sm">Dịch vụ kèm theo</span>
                <span className="font-semibold text-ink">+ {formatPrice(servicesTotal)}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-ink font-semibold">Tổng tiền</span>
              <div className="text-right">
                {voucher && (
                  <span className="block text-sm text-muted line-through">{formatPrice(baseTotal)}</span>
                )}
                <span className="text-2xl font-display font-extrabold text-pitch">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* MÃ GIẢM GIÁ */}
        <div className="bg-white border border-line rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={18} className="text-pitch" />
            <h3 className="font-display font-bold text-ink text-lg">Mã giảm giá</h3>
          </div>

          {voucher ? (
            <div className="flex items-center justify-between bg-pitch-soft border border-pitch/20 rounded-xl px-4 py-3">
              <div>
                <p className="font-bold text-pitch">{voucher.code}</p>
                <p className="text-xs text-muted">Đã giảm {formatPrice(voucher.discount)}</p>
              </div>
              <button onClick={removeVoucher} className="text-muted hover:text-red-500" aria-label="Bỏ mã">
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã (vd WELCOME10)"
                  className="flex-1 h-12 rounded-xl bg-chalk border border-line px-4 text-ink uppercase outline-none focus:ring-2 focus:ring-pitch focus:border-pitch"
                />
                <button
                  onClick={applyVoucher}
                  disabled={applying || !voucherCode.trim()}
                  className={`px-5 rounded-xl font-semibold transition ${applying || !voucherCode.trim() ? 'bg-chalk text-muted border border-line' : 'bg-pitch text-white shadow-glow hover:bg-pitch-deep'}`}
                >
                  {applying ? '...' : 'Áp dụng'}
                </button>
              </div>
              {voucherErr && <p className="text-sm text-red-600 mt-2">{voucherErr}</p>}
            </>
          )}
        </div>

        {/* DỊCH VỤ KÈM SÂN */}
        {services.length > 0 && (
          <div className="bg-white border border-line rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Coffee size={18} className="text-pitch" />
              <h3 className="font-display font-bold text-ink text-lg">Dịch vụ kèm theo</h3>
            </div>
            <div className="space-y-2">
              {services.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted">{formatPrice(s.price)}/{s.unit}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button onClick={() => changeQty(s.id, -1)} className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink hover:bg-chalk disabled:opacity-40" disabled={!qty[s.id]}>
                      <Minus size={15} />
                    </button>
                    <span className="w-6 text-center font-bold text-ink">{qty[s.id] || 0}</span>
                    <button onClick={() => changeQty(s.id, 1)} className="w-8 h-8 rounded-full bg-pitch text-white flex items-center justify-center shadow-glow">
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white border border-line rounded-2xl p-4 shadow-card">
          <h3 className="font-display font-bold text-ink text-lg mb-3">
            Chọn phương thức thanh toán
          </h3>

          <div className="space-y-3 text-ink-soft text-sm">
            <label className={`flex items-center gap-3 font-medium text-ink border rounded-xl px-4 py-3 cursor-pointer transition-all ${paymentMethod === 'COIN' ? 'border-pitch bg-pitch-soft' : 'border-line'}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="COIN"
                checked={paymentMethod === 'COIN'}
                onChange={() => setPaymentMethod('COIN')}
                className="accent-pitch w-4 h-4"
              />
              Thanh toán bằng coin
            </label>

            <label className={`flex items-center gap-3 font-medium text-ink border rounded-xl px-4 py-3 cursor-pointer transition-all ${paymentMethod === 'BANK_QR' ? 'border-pitch bg-pitch-soft' : 'border-line'}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="BANK_QR"
                checked={paymentMethod === 'BANK_QR'}
                onChange={() => setPaymentMethod('BANK_QR')}
                className="accent-pitch w-4 h-4"
              />
              Chuyển khoản ngân hàng (QR)
            </label>

            <label className={`flex items-center gap-3 font-medium text-ink border rounded-xl px-4 py-3 cursor-pointer transition-all ${paymentMethod === 'PAYOS' ? 'border-pitch bg-pitch-soft' : 'border-line'}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="PAYOS"
                checked={paymentMethod === 'PAYOS'}
                onChange={() => setPaymentMethod('PAYOS')}
                className="accent-pitch w-4 h-4"
              />
              Cổng thanh toán PayOS
            </label>

            {paymentMethod === 'PAYOS' && (
              <p className="text-sm text-muted">
                Bạn sẽ được chuyển tới cổng PayOS để thanh toán.
              </p>
            )}

            {paymentMethod === 'COIN' && (
              <div className="rounded-xl bg-pitch-soft p-3">
                <p className="text-muted mb-1">Số dư coin hiện tại:</p>
                <p className="text-lg font-display font-bold text-pitch">
                  {Number(user?.coinBalance || 0).toLocaleString()} Coin
                </p>
              </div>
            )}

            {paymentMethod === 'BANK_QR' && (
              <p className="text-sm text-muted">
                Sau khi xác nhận, bạn sẽ nhận mã QR để chuyển khoản và tải lên ảnh bill.
              </p>
            )}

            {paymentMethod === 'COIN' && Number(user?.coinBalance || 0) < finalTotal && (
              <p className="text-sm text-red-600">
                Số dư không đủ. Vui lòng nạp thêm coin hoặc chọn hình thức khác.
              </p>
            )}

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* THÔNG TIN NGƯỜI ĐẶT */}

        <div className="bg-white border border-line rounded-2xl p-4 shadow-card space-y-4">

          <div>

            <label className="block text-ink font-semibold mb-2 text-sm">
              Tên của bạn
            </label>

            <div className="relative">

              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-pitch"
              />

              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                className="w-full h-12 rounded-xl bg-chalk border border-line pl-12 pr-4 text-ink outline-none focus:ring-2 focus:ring-pitch focus:border-pitch transition"
              />

            </div>

          </div>

          <div>

            <label className="block text-ink font-semibold mb-2 text-sm">
              Số điện thoại
            </label>

            <div className="relative">

              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-pitch"
              />

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                className="w-full h-12 rounded-xl bg-chalk border border-line pl-12 pr-4 text-ink outline-none focus:ring-2 focus:ring-pitch focus:border-pitch transition"
              />

            </div>

          </div>

          <div>

            <label className="block text-ink font-semibold mb-2 text-sm">
              Ghi chú cho chủ sân
            </label>

            <div className="relative">

              <NotebookPen
                size={18}
                className="absolute left-4 top-4 text-pitch"
              />

              <textarea
                rows={4}
                value={note}
                onChange={(e) =>
                  setNote(e.target.value)
                }
                placeholder="Nhập ghi chú..."
                className="w-full rounded-xl bg-chalk border border-line pl-12 pt-3 pr-4 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-pitch focus:border-pitch transition"
              />

            </div>

          </div>

        </div>

        {/* LƯU Ý */}

        <div className="bg-white border border-line rounded-2xl overflow-hidden shadow-card">

          <div className="bg-amber/15 px-4 py-3 font-display font-bold text-amber border-b border-line">
            Lưu ý:
          </div>

          <div className="p-4 text-ink-soft space-y-2 text-sm">

            <p>
              • Việc thanh toán được thực hiện trực tiếp giữa bạn và chủ sân.
            </p>

            <p>
              • ALOBOOKING đóng vai trò kết nối, hỗ trợ tìm sân nhanh hơn.
            </p>

            <p>
              • Mỗi sân có thể có quy định riêng, vui lòng đọc kỹ trước khi đặt.
            </p>

          </div>

        </div>

      </div>

      {/* FOOTER */}

      <div className="fixed bottom-0 left-0 right-0 bg-white p-3 border-t border-line shadow-[0_-10px_30px_rgba(6,35,26,0.08)]">

        <button
          onClick={handleConfirm}
          disabled={loading || (paymentMethod === 'COIN' && Number(user?.coinBalance || 0) < finalTotal)}
          className={`
            w-full
            h-14
            rounded-2xl
            text-white
            font-semibold
            text-lg
            transition
            ${loading || (paymentMethod === 'COIN' && Number(user?.coinBalance || 0) < finalTotal) ? 'bg-line text-muted cursor-not-allowed' : 'bg-pitch shadow-glow hover:bg-pitch-deep'}
          `}
        >
          {loading ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT SÂN'}
        </button>

      </div>

    </div>
  );
};

export default BookingConfirm;