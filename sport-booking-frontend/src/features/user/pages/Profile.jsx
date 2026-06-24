import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { bookingService } from '../../booking/services/bookingService';
import { favoriteService } from '../../venue/services/favoriteService';
import { formatPrice } from '../../../shared/utils/formatDate';
import {
  LayoutGrid,
  Calendar,
  Heart,
  Wallet,
  Settings,
  LogOut,
  TrendingUp,
  Star,
  User,
  Clock3,
  ChevronRight,
  Home,
  MapIcon,
  Compass,
  Zap,
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [myBookings, setMyBookings] = useState([]);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    bookingService.myBookings()
      .then((res) => { if (res.data.code === 0) setMyBookings(res.data.result || []); })
      .catch(() => {});
    favoriteService.myFavoriteIds()
      .then((res) => { if (res.data.code === 0) setFavCount((res.data.result || []).length); })
      .catch(() => {});
  }, []);

  const totalSpent = myBookings
    .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((s, b) => s + Number(b.totalPrice || 0), 0);
  const recentBookings = myBookings.slice(0, 3);

  const tabs = [
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: <LayoutGrid size={20} />,
    },
    {
      id: 'history',
      label: 'Lịch sử',
      icon: <Calendar size={20} />,
    },
    {
      id: 'favorites',
      label: 'Yêu thích',
      icon: <Heart size={20} />,
    },
    {
      id: 'wallet',
      label: 'Ví tiền',
      icon: <Wallet size={20} />,
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-chalk pb-28 font-sans text-ink">
      {/* HERO HEADER — sân vận động về đêm */}
      <section className="stadium pitch-lines relative h-[360px] overflow-hidden rounded-b-4xl">
        {/* ánh đèn pha mềm */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-lime/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-pitch/20 blur-3xl" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 h-full flex items-end justify-center pb-16">
          <div className="text-center animate-fade-up">
            {/* AVATAR */}
            <div className="relative w-fit mx-auto">
              <div className="w-32 h-32 rounded-full overflow-hidden border-[6px] border-white shadow-glow bg-white">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-pitch-soft flex items-center justify-center">
                    <User size={42} className="text-pitch" />
                  </div>
                )}
              </div>

              {/* online dot */}
              <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-lime border-4 border-white shadow-glow-lime" />
            </div>

            {/* INFO */}
            <div className="mt-5">
              <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                {user?.name || user?.fullName || 'Người dùng'}
              </h1>

              <p className="text-white/70 mt-2 font-medium">
                {user?.email || ''}
              </p>

              <div className="flex items-center justify-center gap-3 flex-wrap mt-5">
                <div className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-semibold border border-white/20">
                  {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
                </div>

                <div className="px-5 py-2 rounded-full bg-lime text-ink font-display font-extrabold shadow-glow-lime">
                  {formatPrice(Number(user?.coinBalance || 0))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <div className="max-w-[1400px] mx-auto px-6 mt-10 flex gap-8">
        {/* SIDEBAR */}
        <aside className="hidden lg:block w-[260px] shrink-0">
          <div className="bg-white rounded-3xl border border-line shadow-card p-4 sticky top-24">
            <div className="space-y-1.5">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === 'history') return navigate('/my-bookings');
                      if (tab.id === 'favorites') return navigate('/favorites');
                      if (tab.id === 'wallet') return navigate('/wallet');
                      setActiveTab(tab.id);
                    }}
                    className={`
                      w-full h-14 px-4 rounded-2xl
                      flex items-center justify-between
                      transition-all duration-200
                      ${
                        active
                          ? 'bg-pitch-soft text-pitch'
                          : 'text-muted hover:bg-chalk'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {tab.icon}

                      <span className="font-semibold">
                        {tab.label}
                      </span>
                    </div>

                    {active && (
                      <ChevronRight size={16} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-line">
              <button
                onClick={logout}
                className="w-full h-14 px-4 rounded-2xl flex items-center gap-4 text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={20} />

                <span className="font-semibold">
                  Đăng xuất
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 min-w-0">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-up">
              {/* STATS */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                  icon={<Calendar size={24} />}
                  title="Trận đã đặt"
                  value={String(myBookings.length)}
                />

                <StatCard
                  icon={<TrendingUp size={24} />}
                  title="Đã chi tiêu"
                  value={formatPrice(totalSpent)}
                />

                <StatCard
                  icon={<Heart size={24} />}
                  title="Sân yêu thích"
                  value={String(favCount)}
                />

                <StatCard
                  icon={<Wallet size={24} />}
                  title="Số dư ví"
                  value={formatPrice(Number(user?.coinBalance || 0))}
                />
              </div>

              {/* RECENT BOOKINGS */}
              <div className="bg-white rounded-3xl border border-line shadow-card p-5 sm:p-7">
                <div className="mb-7">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                    Đặt lịch gần đây
                  </h2>

                  <p className="text-muted mt-1">
                    Các trận sân bạn vừa đặt gần đây
                  </p>
                </div>

                {recentBookings.length === 0 ? (
                  <p className="text-muted text-sm">Bạn chưa có lượt đặt nào. Hãy đặt sân đầu tiên nhé!</p>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((b) => (
                      <BookingCard key={b.id} booking={b} onClick={() => navigate('/my-bookings')} />
                    ))}
                  </div>
                )}
              </div>

              {/* QUICK ACTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <QuickCard
                  title="Ví của tôi"
                  desc="Xem số dư & nạp coin nhanh."
                  button="Mở ví"
                  onClick={() => navigate('/wallet')}
                />

                <QuickCard
                  title="Gói thành viên"
                  desc="Ưu đãi giảm giá khi đặt sân."
                  button="Xem gói"
                  onClick={() => navigate('/membership')}
                />

                <QuickCard
                  title="Sân đã đặt"
                  desc="Lịch sử đặt, đánh giá & hoàn tiền."
                  button="Xem lịch sử"
                  onClick={() => navigate('/my-bookings')}
                />

                <QuickCard
                  title="Sân yêu thích"
                  desc="Danh sách sân bạn đã lưu."
                  button="Xem danh sách"
                  onClick={() => navigate('/favorites')}
                />
              </div>
            </div>
          )}

          {/* HISTORY */}
          {activeTab === 'history' && (
            <EmptyState
              icon={<Clock3 size={50} />}
              title="Chưa có lịch sử đặt sân"
              desc="Bạn chưa thực hiện giao dịch nào gần đây."
            />
          )}

          {/* FAVORITES */}
          {activeTab === 'favorites' && (
            <EmptyState
              icon={<Heart size={50} />}
              title="Chưa có sân yêu thích"
              desc="Lưu sân bóng để đặt nhanh hơn."
            />
          )}

          {/* WALLET */}
          {activeTab === 'wallet' && (
            <EmptyState
              icon={<Wallet size={50} />}
              title="Ví coin đang trống"
              desc="Nạp thêm coin để thanh toán tiện lợi."
            />
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-line shadow-card p-8 max-w-3xl animate-fade-up">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-8">
                Cài đặt tài khoản
              </h2>

              <div className="space-y-6">
                <InputField
                  label="Họ và tên"
                  value={user?.fullName || ''}
                />

                <InputField
                  label="Email"
                  value={user?.email || ''}
                />

                <InputField
                  label="Số điện thoại"
                  value="0123456789"
                />

                <button className="mt-2 px-7 py-4 rounded-2xl bg-pitch text-white font-display font-bold shadow-glow hover:bg-pitch-deep active:scale-95 transition-all">
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-2xl border-t border-line px-2 py-3 flex justify-between items-end z-50 shadow-card">
        <BottomNavItem
          active={false}
          icon={<Home size={24} />}
          label="Trang chủ"
        />

        <BottomNavItem
          active={false}
          icon={<MapIcon size={24} />}
          label="Bản đồ"
        />

        {/* CENTER BUTTON */}
        <div className="flex flex-col items-center -translate-y-2 flex-1">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-card border-4 border-chalk mb-1 active:scale-90 transition-all">
            <div className="w-11 h-11 bg-pitch rounded-full flex items-center justify-center text-white shadow-glow">
              <Compass size={24} />
            </div>
          </div>

          <span className="text-[11px] font-semibold text-muted">
            Khám phá
          </span>
        </div>

        <BottomNavItem
          active={false}
          icon={<Zap size={24} />}
          label="Nổi bật"
        />

        <BottomNavItem
          active={true}
          icon={<User size={24} />}
          label="Tài khoản"
        />
      </div>
    </div>
  );
};

/* ======================== */
/* COMPONENTS */
/* ======================== */

const StatCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white rounded-2xl border border-line shadow-card p-5 sm:p-6 min-w-0 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-pitch-soft flex items-center justify-center text-pitch mb-4">
        {icon}
      </div>

      <p className="text-muted text-xs font-semibold uppercase tracking-wide truncate">
        {title}
      </p>

      <h3 className="font-display text-xl sm:text-2xl xl:text-3xl font-extrabold text-ink mt-1 leading-tight break-words tabular-nums">
        {value}
      </h3>
    </div>
  );
};

const BOOKING_STATUS = {
  CONFIRMED: { l: 'Đã xác nhận', c: 'bg-pitch-soft text-pitch' },
  PENDING_PAYMENT: { l: 'Chờ thanh toán', c: 'bg-amber-50 text-amber-600' },
  PENDING_CONFIRMATION: { l: 'Chờ duyệt', c: 'bg-amber-50 text-amber-600' },
  COMPLETED: { l: 'Hoàn thành', c: 'bg-pitch-soft text-pitch' },
  CANCELED: { l: 'Đã huỷ', c: 'bg-red-50 text-red-600' },
  REJECTED: { l: 'Bị từ chối', c: 'bg-red-50 text-red-600' },
};

const BookingCard = ({ booking, onClick }) => {
  const st = BOOKING_STATUS[booking?.status] || { l: booking?.status, c: 'bg-chalk text-muted' };
  return (
    <div onClick={onClick} className="flex items-center gap-4 sm:gap-5 bg-chalk hover:bg-pitch-soft/60 transition-all rounded-2xl p-4 sm:p-5 border border-line cursor-pointer">
      <div className="w-14 h-14 rounded-2xl bg-pitch-soft flex items-center justify-center text-pitch shrink-0">
        <Calendar size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-base sm:text-lg font-bold text-ink truncate">
              {booking?.fieldName}
            </h3>
            <p className="text-muted mt-1 text-sm truncate">
              {booking?.venueName} · {booking?.bookingDate}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="font-display text-lg sm:text-xl font-extrabold text-pitch">
              {formatPrice(Number(booking?.totalPrice || 0))}
            </p>
            <div className={`mt-2 inline-flex px-3 py-1 rounded-full text-xs font-semibold ${st.c}`}>
              {st.l}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickCard = ({ title, desc, button, onClick }) => {
  return (
    <div className="bg-white rounded-2xl border border-line shadow-card p-6 hover:shadow-card-hover transition-all">
      <h3 className="font-display text-xl font-bold text-ink">
        {title}
      </h3>

      <p className="text-muted mt-2 leading-relaxed">
        {desc}
      </p>

      <button onClick={onClick} className="mt-6 px-5 py-3 rounded-2xl bg-pitch text-white font-semibold shadow-glow hover:bg-pitch-deep transition-all">
        {button}
      </button>
    </div>
  );
};

const EmptyState = ({ icon, title, desc }) => {
  return (
    <div className="bg-white rounded-3xl border border-line shadow-card p-16 flex flex-col items-center justify-center text-center animate-fade-up">
      <div className="w-24 h-24 rounded-full bg-pitch-soft flex items-center justify-center text-pitch mb-6">
        {icon}
      </div>

      <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        {title}
      </h3>

      <p className="text-muted mt-3 max-w-md leading-relaxed">
        {desc}
      </p>
    </div>
  );
};

const InputField = ({ label, value }) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-ink-soft">
        {label}
      </label>

      <input
        defaultValue={value}
        className="w-full h-14 rounded-2xl border border-line px-5 bg-chalk outline-none focus:border-pitch focus:ring-2 focus:ring-pitch/20 transition-all"
      />
    </div>
  );
};

const BottomNavItem = ({ active, icon, label }) => {
  return (
    <button
      className={`
        flex-1 flex flex-col items-center gap-1
        transition-all
        ${
          active
            ? 'text-pitch scale-105'
            : 'text-muted'
        }
      `}
    >
      {icon}

      <span className="text-[11px] font-semibold">
        {label}
      </span>
    </button>
  );
};

export default Profile;
