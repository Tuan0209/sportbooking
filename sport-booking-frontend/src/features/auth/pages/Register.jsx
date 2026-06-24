import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { authService } from '../services/authService';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Kiểm tra phía client trước khi gửi
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      const res = await authService.register(formData);
      if (res.data.code === 0) {
        alert('Đăng ký thành công!');
        navigate('/login');
      } else {
        setError(res.data.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại!');
    }
  };

  return (
    <div className="min-h-screen stadium pitch-lines flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 w-96 h-96 rounded-full border border-white/10" />

      <button
        onClick={() => navigate('/login')}
        className="absolute top-6 left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-20"
        aria-label="Quay lại"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="w-full max-w-[440px] z-10 animate-fade-up">
        <div className="flex flex-col items-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-pitch flex items-center justify-center shadow-glow-lime mb-4 -rotate-3">
            <span className="font-display font-extrabold text-white text-3xl italic">S</span>
          </div>
          <h1 className="text-white text-center text-3xl font-extrabold tracking-tight">Tạo tài khoản</h1>
          <p className="text-lime/90 text-sm mt-2 font-medium">Gia nhập cộng đồng mê thể thao</p>
        </div>

        <div className="bg-white rounded-[28px] p-7 md:p-9 shadow-2xl">
          <form onSubmit={handleRegister}>
            <Input label="Họ và tên (*)" placeholder="Nhập họ và tên" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} onClear={() => setFormData({ ...formData, name: '' })} />
            <Input label="Số điện thoại (*)" placeholder="Nhập số điện thoại" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} onClear={() => setFormData({ ...formData, phone: '' })} />
            <Input label="Email (*)" placeholder="Nhập email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} onClear={() => setFormData({ ...formData, email: '' })} />
            <Input label="Mật khẩu (*)" isPassword placeholder="Nhập mật khẩu" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} onClear={() => setFormData({ ...formData, password: '' })} />

            {error && (
              <div className="text-red-600 text-sm mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" className="mt-5">Đăng ký ngay</Button>
          </form>
        </div>

        <div className="text-center mt-8 text-white/80 text-[15px]">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-lime font-bold hover:text-lime-deep transition-colors ml-1">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
