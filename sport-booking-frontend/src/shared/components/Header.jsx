// Đảm bảo dòng 1 có đầy đủ { useContext, useState, useEffect, useRef }
import React, { useContext, useState, useEffect, useRef } from 'react'; 
import { AuthContext } from '../../context/AuthContext';
import { Bell, User, LogOut, Menu, ChevronDown } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Dòng này sẽ không còn lỗi nữa
  const dropdownRef = useRef(null);  // Ref để theo dõi dropdown menu 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { 
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-line flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-chalk rounded-lg text-ink">
          <Menu size={20} />
        </button>
        <h2 className="font-display font-bold text-ink text-lg hidden md:block tracking-tight">
          Hệ thống quản trị
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2.5 text-muted hover:bg-chalk rounded-full transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber rounded-full border-2 border-white"></span>
        </button>

        {/* Gắn ref vào đây */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center gap-3 p-1.5 rounded-xl transition-all border ${
              showDropdown ? 'bg-chalk border-line' : 'border-transparent hover:bg-chalk'
            }`}
          >
            <div className="w-9 h-9 bg-pitch rounded-lg flex items-center justify-center text-white font-display font-bold shadow-glow">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-ink leading-tight">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-[11px] text-muted font-medium uppercase tracking-tight">
                {user?.role}
              </p>
            </div>
            <ChevronDown size={14} className={`text-muted transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-line rounded-2xl shadow-2xl py-2 z-50 animate-fade-up">
              <div className="px-4 py-3 border-b border-line mb-1">
                <p className="text-xs text-muted font-medium">Đang đăng nhập với</p>
                <p className="text-sm font-bold text-ink truncate">{user?.email}</p>
              </div>

              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-pitch-soft hover:text-pitch transition-all">
                <User size={16} /> Thông tin cá nhân
              </button>

              <hr className="my-1 border-line" />

              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all font-semibold"
              >
                <LogOut size={16} /> Đăng xuất tài khoản
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;