import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  MapPin, 
  LayoutGrid, 
  Calendar, 
  Settings, 
  X,
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
        { name: 'Venue', icon: <MapPin size={20} />, path: '/admin/venues' }, // ⭐ thêm
        { name: 'Khu vực', icon: <MapPin size={20} />, path: '/admin/areas' },
        { name: 'Sân', icon: <LayoutGrid size={20} />, path: '/admin/fields' },
        { name: 'Loại sân', icon: <LayoutGrid size={20} />, path: '/admin/field-types' },
      ],
    },
    {
      title: 'Đặt sân',
      links: [
        { name: 'Lịch đặt', icon: <Calendar size={20} />, path: '/admin/bookings' },
      ],
    },
    {
      title: 'Người dùng',
      links: [
        { name: 'User', icon: <Users size={20} />, path: '/admin/users' },
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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onClose}
        ></div>
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-50">
          <span className="text-2xl font-black text-indigo-600 tracking-tighter italic">
            SPORTBOOKING
          </span>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400">
            <X size={20}/>
          </button>
        </div>

        {/* MENU */}
        <nav className="p-4 space-y-4">
          
          {role === 'ADMIN' ? (
            adminSections.map((section, idx) => (
              <div key={idx}>
                
                {/* Section title */}
                <p className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase">
                  {section.title}
                </p>

                <div className="space-y-2">
                  {section.links.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all duration-200
                        ${isActive 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                          : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}
                      `}
                    >
                      {link.icon}
                      <span className="text-sm">{link.name}</span>
                    </NavLink>
                  ))}
                </div>

              </div>
            ))
          ) : (
            userLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}
                `}
              >
                {link.icon}
                <span className="text-sm">{link.name}</span>
              </NavLink>
            ))
          )}

        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6 right-6 p-4 bg-gray-50 rounded-2xl">
          <p className="text-xs text-gray-400 text-center font-medium">
            Hỗ trợ 24/7: 1900 1234
          </p>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;