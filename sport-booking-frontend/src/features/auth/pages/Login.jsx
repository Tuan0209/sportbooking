import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { authService } from '../services/authService';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const Login = () => {
  const [activeTab, setActiveTab] = useState('email');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loginContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login(formData);
      if (res.data.code === 0) {
        const role = loginContext(res.data.result.token);
        role === 'ADMIN' ? navigate('/admin/dashboard') : navigate('/dashboard');
      }
    } catch (err) {
      alert('Đăng nhập thất bại!');
    }
  };

  return (
    <div className="min-h-screen bg-[#c8102e] flex flex-col items-center justify-center p-6 relative font-sans">
      {/* Sao trang trí to hơn */}
      <div className="absolute top-20 left-[10%] text-white/20 text-6xl transform rotate-12">✦</div>
      <div className="absolute bottom-20 right-[10%] text-white/20 text-6xl transform -rotate-12">✦</div>

      {/* Tăng max-w từ 440px lên 520px */}
      <div className="w-full max-w-[520px] z-10">
        <h2 className="text-white text-center text-[24px] font-bold mb-10 uppercase tracking-[3px]">Đăng nhập</h2>
        
        <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden">
          {/* Tabs cao hơn: h-[70px] */}
          <div className="flex bg-gray-100 h-[70px]">
            <button 
              className={`flex-1 text-[16px] font-bold transition-all ${
                activeTab === 'phone' 
                ? 'bg-white text-gray-800 rounded-tr-[40px]' 
                : 'text-gray-400 hover:text-gray-500'
              }`}
              onClick={() => setActiveTab('phone')}
            >
              Số điện thoại
            </button>
            <button 
              className={`flex-1 text-[16px] font-bold transition-all ${
                activeTab === 'email' 
                ? 'bg-white text-gray-800 rounded-tl-[40px]' 
                : 'text-gray-400 hover:text-gray-500 border-l border-gray-200'
              }`}
              onClick={() => setActiveTab('email')}
            >
              Email
            </button>
          </div>

          {/* Padding form rộng hơn: p-12 */}
          <form className="p-10 md:p-12" onSubmit={handleSubmit}>
            <Input 
              label={activeTab === 'email' ? "Email của bạn?" : "Số điện thoại?"}
              placeholder={activeTab === 'email' ? "Nhập email của bạn (*)" : "Nhập số điện thoại (*)"}
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              onClear={() => setFormData({...formData, email: ''})} 
            />
            <Input 
              label="Mật khẩu (*)" 
              isPassword 
              placeholder="Nhập mật khẩu (*)" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />

            <Button type="submit" className="mt-4">Đăng nhập</Button>

            <div className="text-center mt-8 text-[15px]">
              <span className="text-gray-500">Bạn quên mật khẩu? </span>
              <button type="button" className="text-[#004d31] font-extrabold underline underline-offset-4">Quên mật khẩu</button>
            </div>
          </form>
        </div>

        <div className="text-center mt-10 text-white text-[16px]">
          Bạn chưa có tài khoản? <Link to="/register" className="font-bold underline underline-offset-4 ml-1">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;