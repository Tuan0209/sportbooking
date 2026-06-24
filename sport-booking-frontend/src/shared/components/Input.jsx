import { Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, isPassword, onClear }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      {label && <label className="block text-ink font-semibold text-[13px] mb-1.5">{label}</label>}
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3.5 bg-chalk border border-line rounded-xl focus:outline-none focus:border-pitch focus:ring-2 focus:ring-pitch/20 focus:bg-white text-[14px] text-ink placeholder:text-muted/60 transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted">
          {!isPassword && value && <X size={18} className="cursor-pointer hover:text-ink" onClick={onClear} />}
          {isPassword && (
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-ink">
              {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Input;
