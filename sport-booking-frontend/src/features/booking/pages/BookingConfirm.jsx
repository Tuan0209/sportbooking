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
      <div className="h-screen flex items-center justify-center">
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
    <div className="min-h-screen bg-[#006c35] pb-40">

      {/* HEADER */}

      <div className="sticky top-0 z-50 bg-[#006c35] h-14 flex items-center justify-center px-4">

        <button
          onClick={() => navigate(-1)}
          className="absolute left-4"
        >
          <ChevronLeft
            size={24}
            className="text-white"
          />
        </button>

        <h1 className="text-white font-bold text-xl">
          Đặt lịch trực quan
        </h1>

      </div>

      <div className="p-3 space-y-4">

        {/* THÔNG TIN SÂN */}

        <div className="bg-[#03652f] rounded-2xl p-4">

          <div className="flex items-center gap-2 mb-3">

            <MapPin
              size={18}
              className="text-[#ffd84d]"
            />

            <h3 className="font-bold text-[#ffd84d] text-xl">
              Thông tin sân
            </h3>

          </div>

          <div className="space-y-3">

            <div>
              <p className="text-white font-bold text-2xl">
                {state.venueName}
              </p>
            </div>

            <div>
              <p className="text-white text-lg">
                {state.fieldName}
              </p>
            </div>

            <div>
              <p className="text-white/90">
                Địa chỉ: {state.venueAddress}
              </p>
            </div>

          </div>

        </div>

        {/* THÔNG TIN LỊCH */}

        <div className="bg-[#03652f] rounded-2xl p-4">

          <div className="flex items-center gap-2 mb-4">

            <CalendarDays
              size={18}
              className="text-[#ffd84d]"
            />

            <h3 className="font-bold text-[#ffd84d] text-xl">
              Thông tin lịch đặt
            </h3>

          </div>

          <div className="space-y-4 text-white">

            <p>
              <span className="font-bold">
                Ngày:
              </span>{' '}
              {new Date(
                state.bookingDate
              ).toLocaleDateString('vi-VN')}
            </p>

          
      <div>
  <span className="font-bold">
    Khung giờ:
  </span>

  <div className="mt-2 space-y-1">
    {state.ranges?.map((item, index) => (
      <div key={index}>
        - {item.start} - {item.end}
      </div>
    ))}
  </div>
</div>
            

            <p>
              <span className="font-bold">
                Loại sân:
              </span>{' '}
              {state.fieldTypeName}
            </p>

            <p>
              <span className="font-bold">
                Tổng giờ:
              </span>{' '}
              {Math.floor(
                state.totalMinutes / 60
              )}
              h
              {state.totalMinutes % 60 > 0
                ? state.totalMinutes % 60
                : ''}
            </p>

            <p className="text-2xl font-black text-[#ffd84d]">
              Tổng tiền:{' '}
              {formatPrice(state.totalPrice)}
            </p>

          </div>

        </div>

        <div className="bg-[#03652f] rounded-2xl p-4">
          <h3 className="font-bold text-[#ffd84d] text-xl mb-3">
            Chọn phương thức thanh toán
          </h3>

          <div className="space-y-3 text-white text-sm">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="COIN"
                checked={paymentMethod === 'COIN'}
                onChange={() => setPaymentMethod('COIN')}
                className="accent-[#ffd84d]"
              />
              Thanh toán bằng coin
            </label>

            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-white/80 mb-1">
                Số dư coin hiện tại:
              </p>
              <p className="text-lg font-bold text-[#ffd84d]">
                {Number(user?.coinBalance || 0).toLocaleString()} Coin
              </p>
            </div>

            {paymentMethod === 'COIN' && Number(user?.coinBalance || 0) < Number(state.totalPrice) && (
              <p className="text-sm text-red-300">
                Số dư không đủ. Vui lòng nạp thêm coin hoặc chọn hình thức khác.
              </p>
            )}

            {error && (
              <p className="text-sm text-red-300">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* THÔNG TIN NGƯỜI ĐẶT */}

        <div className="space-y-4">

          <div>

            <label className="block text-white font-bold mb-2 uppercase">
              Tên của bạn
            </label>

            <div className="relative">

              <User
                size={18}
                className="absolute left-4 top-4 text-[#006c35]"
              />

              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                className="w-full h-12 rounded-md pl-12 pr-4 outline-none"
              />

            </div>

          </div>

          <div>

            <label className="block text-white font-bold mb-2 uppercase">
              Số điện thoại
            </label>

            <div className="relative">

              <Phone
                size={18}
                className="absolute left-4 top-4 text-[#006c35]"
              />

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                className="w-full h-12 rounded-md pl-12 pr-4 outline-none"
              />

            </div>

          </div>

          <div>

            <label className="block text-white font-bold mb-2 uppercase">
              Ghi chú cho chủ sân
            </label>

            <div className="relative">

              <NotebookPen
                size={18}
                className="absolute left-4 top-4 text-[#006c35]"
              />

              <textarea
                rows={4}
                value={note}
                onChange={(e) =>
                  setNote(e.target.value)
                }
                placeholder="Nhập ghi chú..."
                className="w-full rounded-md pl-12 pt-3 pr-4 outline-none"
              />

            </div>

          </div>

        </div>

        {/* LƯU Ý */}

        <div className="bg-[#03652f] rounded-2xl overflow-hidden">

          <div className="bg-gradient-to-r from-[#e8be2d] to-transparent px-4 py-3 font-bold text-[#006c35]">
            ⚠ Lưu ý:
          </div>

          <div className="p-4 text-white space-y-2 text-sm">

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

      <div className="fixed bottom-0 left-0 right-0 bg-[#006c35] p-3 border-t border-white/10">

        <button
          onClick={handleConfirm}
          disabled={loading || (paymentMethod === 'COIN' && Number(user?.coinBalance || 0) < Number(state.totalPrice))}
          className={`
            w-full
            h-14
            rounded-xl
            text-white
            font-black
            text-lg
            shadow-xl
            ${loading || (paymentMethod === 'COIN' && Number(user?.coinBalance || 0) < Number(state.totalPrice)) ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#e4b12c]'}
          `}
        >
          {loading ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT SÂN'}
        </button>

      </div>

    </div>
  );
};

export default BookingConfirm;