import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { bookingService } from '../services/bookingService';
import {
  ChevronLeft,
  MapPin,
  CalendarDays,
  User,
  Phone,
  NotebookPen
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

  const handleConfirm = async () => {
    if (!state?.slots || state.slots.length === 0) {
      setError('Không có khung giờ để đặt.');
      return;
    }

    const totalPrice = Number(state.totalPrice || 0);
    const userCoins = Number(user?.coinBalance || 0);

    if (paymentMethod === 'COIN' && userCoins < totalPrice) {
      setError('Số dư coin không đủ để thanh toán.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await bookingService.createBooking({
        fieldId: state.fieldId,
        bookingDate: state.bookingDate,
        slots: state.slots,
        customerName: fullName,
        customerPhone: phone,
        note,
        totalPrice: state.totalPrice,
        paymentMethod: paymentMethod
      });

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

            <div className="flex items-center justify-between pt-1">
              <span className="text-ink font-semibold">Tổng tiền</span>
              <span className="text-2xl font-display font-extrabold text-pitch">
                {formatPrice(state.totalPrice)}
              </span>
            </div>

          </div>

        </div>

        <div className="bg-white border border-line rounded-2xl p-4 shadow-card">
          <h3 className="font-display font-bold text-ink text-lg mb-3">
            Chọn phương thức thanh toán
          </h3>

          <div className="space-y-3 text-ink-soft text-sm">
            <label className="flex items-center gap-3 font-medium text-ink">
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

            <div className="rounded-xl bg-pitch-soft p-3">
              <p className="text-muted mb-1">
                Số dư coin hiện tại:
              </p>
              <p className="text-lg font-display font-bold text-pitch">
                {Number(user?.coinBalance || 0).toLocaleString()} Coin
              </p>
            </div>

            {paymentMethod === 'COIN' && Number(user?.coinBalance || 0) < Number(state.totalPrice) && (
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
          disabled={loading || (paymentMethod === 'COIN' && Number(user?.coinBalance || 0) < Number(state.totalPrice))}
          className={`
            w-full
            h-14
            rounded-2xl
            text-white
            font-semibold
            text-lg
            transition
            ${loading || (paymentMethod === 'COIN' && Number(user?.coinBalance || 0) < Number(state.totalPrice)) ? 'bg-line text-muted cursor-not-allowed' : 'bg-pitch shadow-glow hover:bg-pitch-deep'}
          `}
        >
          {loading ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT SÂN'}
        </button>

      </div>

    </div>
  );
};

export default BookingConfirm;