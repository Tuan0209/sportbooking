import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  MapPin,
  LayoutGrid,
  Calendar,
  Settings,
  X,
  Globe,
  Wallet,
  RotateCcw,
  Tag,
  Crown,
  Coffee,
  Star
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, role }) => {

  // 👉 ADMIN MENU (đã nhóm lại theo domain)
  const adminSections = [
    {
      title: 'Tổng quan',
      links: [
        { name: 'Dashboard', icon: <Home size={20} />, path: '/admin/dashboard' },
      ],
    },
    {
      title: 'Quản lý địa điểm',
      links: [
        { name: 'Quản lý Cơ sở', icon: <Globe size={20} />, path: '/admin/venues' },
        { name: 'Khu vực', icon: <MapPin size={20} />, path: '/admin/areas' },
        { name: 'Sân', icon: <LayoutGrid size={20} />, path: '/admin/fields' },
        { name: 'Loại sân', icon: <LayoutGrid size={20} />, path: '/admin/field-types' },
        { name: 'Dịch vụ', icon: <Coffee size={20} />, path: '/admin/services' },
      ],
    },
    {
      title: 'Đặt sân & thanh toán',
      links: [
        { name: 'Lịch đặt', icon: <Calendar size={20} />, path: '/admin/bookings' },
        { name: 'Duyệt thanh toán', icon: <Wallet size={20} />, path: '/admin/payments' },
        { name: 'Duyệt hoàn tiền', icon: <RotateCcw size={20} />, path: '/admin/refunds' },
      ],
    },
    {
      title: 'Khuyến mãi',
      links: [
        { name: 'Voucher', icon: <Tag size={20} />, path: '/admin/vouchers' },
        { name: 'Gói thành viên', icon: <Crown size={20} />, path: '/admin/membership-plans' },
      ],
    },
    {
      title: 'Người dùng',
      links: [
        { name: 'User', icon: <Users size={20} />, path: '/admin/users' },
        { name: 'Đánh giá', icon: <Star size={20} />, path: '/admin/reviews' },
      ],
    },
  ];

  // 👉 USER MENU (giữ đơn giản)
  const userLinks = [
    { name: 'Trang chủ', icon: <Home size={20} />, path: '/dashboard' },
    { name: 'Danh sách sân', icon: <MapPin size={20} />, path: '/fields' },
    { name: 'Lịch sử đặt', icon: <Calendar size={20} />, path: '/bookings' },
    { name: 'Cài đặt', icon: <Settings size={20} />, path: '/profile' },
  ];

  const linkClass = ({ isActive }) => `
    flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
    ${isActive
      ? 'bg-pitch text-white shadow-glow'
      : 'text-white/55 hover:bg-white/10 hover:text-white'}
  `;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 stadium pitch-lines border-r border-white/5 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Header */}
        <div className="h-16 shrink-0 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pitch flex items-center justify-center text-white font-display font-extrabold italic shadow-glow-lime">S</div>
            <span className="text-lg font-display font-extrabold text-white tracking-tight">
              SVĐ<span className="text-lime">.</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 min-h-0 p-4 space-y-5 overflow-y-auto scrollbar-thin">

          {role === 'ADMIN' ? (
            adminSections.map((section, idx) => (
              <div key={idx}>
                <p className="px-4 mb-2 text-[10px] font-bold text-lime/70 uppercase tracking-[0.15em]">
                  {section.title}
                </p>
                <div className="space-y-1.5">
                  {section.links.map((link) => (
                    <NavLink key={link.path} to={link.path} className={linkClass}>
                      {link.icon}
                      <span className="text-sm">{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))
          ) : (
            userLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={linkClass}>
                {link.icon}
                <span className="text-sm">{link.name}</span>
              </NavLink>
            ))
          )}

        </nav>

        {/* Footer */}
        <div className="shrink-0 m-5 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-xs text-white/50 text-center font-medium">
            Hỗ trợ 24/7: <span className="text-lime font-semibold">1900 1234</span>
          </p>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
