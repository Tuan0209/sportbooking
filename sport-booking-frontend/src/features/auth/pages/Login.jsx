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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await authService.login(formData);
      if (res.data.code === 0) {
        const role = await loginContext(res.data.result.token);
        role === 'ADMIN' ? navigate('/admin/dashboard') : navigate('/dashboard');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen stadium pitch-lines flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Cung góc sân — vạch kẻ trắng signature */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 w-96 h-96 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-px bg-white/10" />

      <div className="w-full max-w-[440px] z-10 animate-fade-up">
        {/* Logo phù hiệu */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-pitch flex items-center justify-center shadow-glow-lime mb-4 rotate-3">
            <span className="font-display font-extrabold text-white text-3xl italic">S</span>
          </div>
          <h1 className="text-white text-center text-3xl font-extrabold tracking-tight">Vào sân thôi!</h1>
          <p className="text-lime/90 text-sm mt-2 font-medium">Đặt sân thể thao gần bạn chỉ trong vài giây</p>
        </div>

        <div className="bg-white rounded-[28px] shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex p-1.5 bg-chalk gap-1.5">
            <button
              className={`flex-1 py-3 text-[14px] font-semibold rounded-2xl transition-all ${
                activeTab === 'phone' ? 'bg-white text-ink shadow-card' : 'text-muted hover:text-ink'
              }`}
              onClick={() => setActiveTab('phone')}
            >
              Số điện thoại
            </button>
            <button
              className={`flex-1 py-3 text-[14px] font-semibold rounded-2xl transition-all ${
                activeTab === 'email' ? 'bg-white text-ink shadow-card' : 'text-muted hover:text-ink'
              }`}
              onClick={() => setActiveTab('email')}
            >
              Email
            </button>
          </div>

          <form className="p-7 md:p-9" onSubmit={handleSubmit}>
            <Input
              label={activeTab === 'email' ? 'Email của bạn' : 'Số điện thoại'}
              placeholder={activeTab === 'email' ? 'Nhập email của bạn (*)' : 'Nhập số điện thoại (*)'}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onClear={() => setFormData({ ...formData, email: '' })}
            />
            <Input
              label="Mật khẩu (*)"
              isPassword
              placeholder="Nhập mật khẩu (*)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {error && (
              <div className="text-red-600 text-sm mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <Button type="submit" className="mt-5">Đăng nhập</Button>

            <div className="text-center mt-6 text-[14px]">
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-pitch font-semibold hover:text-pitch-deep transition-colors">
                Quên mật khẩu?
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-8 text-white/80 text-[15px]">
          Bạn chưa có tài khoản?{' '}
          <Link to="/register" className="text-lime font-bold hover:text-lime-deep transition-colors ml-1">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
