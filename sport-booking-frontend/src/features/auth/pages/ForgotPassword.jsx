import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const ForgotPassword = () => {
  const [form, setForm] = useState({ email: '', newPassword: '', confirm: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.newPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (form.newPassword.length < 6) {
      setError('Mật khẩu mới tối thiểu 6 ký tự.');
      return;
    }
    if (form.newPassword !== form.confirm) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword({
        email: form.email,
        newPassword: form.newPassword,
      });
      if (res.data.code === 0) {
        setDone(true);
      } else {
        setError(res.data.message || 'Đặt lại mật khẩu thất bại');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen stadium pitch-lines flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 w-96 h-96 rounded-full border border-white/10" />

      <button
        onClick={() => navigate('/login')}
        className="absolute top-6 left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-20"
        aria-label="Quay lại"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="w-full max-w-[440px] z-10 animate-fade-up">
        <div className="flex flex-col items-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-pitch flex items-center justify-center shadow-glow-lime mb-4">
            <span className="font-display font-extrabold text-white text-3xl italic">S</span>
          </div>
          <h1 className="text-white text-center text-3xl font-extrabold tracking-tight">Quên mật khẩu</h1>
          <p className="text-lime/90 text-sm mt-2 font-medium text-center">
            Nhập email tài khoản để đặt lại mật khẩu
          </p>
        </div>

        <div className="bg-white rounded-[28px] p-7 md:p-9 shadow-2xl">
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-pitch-soft flex items-center justify-center text-pitch mx-auto mb-4">
                <CheckCircle2 size={34} />
              </div>
              <h3 className="font-display text-xl font-extrabold text-ink">Đặt lại mật khẩu thành công</h3>
              <p className="text-muted text-sm mt-2">Bạn có thể đăng nhập bằng mật khẩu mới.</p>
              <Button onClick={() => navigate('/login')} className="mt-6">Về đăng nhập</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                label="Email tài khoản"
                placeholder="Nhập email đã đăng ký"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onClear={() => setForm({ ...form, email: '' })}
              />
              <Input
                label="Mật khẩu mới"
                isPassword
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              />
              <Input
                label="Nhập lại mật khẩu mới"
                isPassword
                placeholder="Nhập lại mật khẩu mới"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />

              {error && (
                <div className="text-red-600 text-sm mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <Button type="submit" className="mt-5">
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </Button>
            </form>
          )}
        </div>

        <div className="text-center mt-8 text-white/80 text-[15px]">
          Nhớ ra mật khẩu rồi?{' '}
          <Link to="/login" className="text-lime font-bold hover:text-lime-deep transition-colors ml-1">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
