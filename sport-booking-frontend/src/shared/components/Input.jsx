import { Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, isPassword, onClear }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      {label && <label className="block text-[#004d31] font-bold text-[13px] mb-1.5">{label}</label>}
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 text-[14px] placeholder:text-gray-400"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400">
          {!isPassword && value && <X size={18} className="cursor-pointer hover:text-gray-600" onClick={onClear} />}
          {isPassword && (
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-gray-600">
              {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Input;