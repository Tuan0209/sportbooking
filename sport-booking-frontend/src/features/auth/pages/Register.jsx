import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { authService } from '../services/authService';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.register(formData);
      if (res.data.code === 0) {
        alert('Đăng ký thành công!');
        navigate('/login');
      }
    } catch (err) { alert('Lỗi đăng ký, vui lòng thử lại!'); }
  };

  return (
    <div className="min-h-screen bg-[#c8102e] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-20 right-[5%] text-white/10 text-9xl font-serif">✦</div>
      
      <button onClick={() => navigate('/login')} className="absolute top-6 left-6 text-white">
        <ChevronLeft size={28} />
      </button>

      <div className="w-full max-w-[440px] z-10">
        <h2 className="text-white text-center text-[20px] font-bold mb-8 uppercase tracking-wider">Đăng ký</h2>
        
        <div className="bg-white rounded-[20px] p-8 pt-10 shadow-2xl">
          <form onSubmit={handleRegister}>
            <Input label="Họ và tên (*)" placeholder="Nhập họ và tên" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} onClear={() => setFormData({ ...formData, name: '' })}/>
            <Input label="Số điện thoại (*)" placeholder="Nhập số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} onClear={() => setFormData({ ...formData, phone: '' })} />
            <Input label="Email (*)" placeholder="Nhập email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} onClear={() => setFormData({ ...formData, email: '' })}  />
            <Input label="Mật khẩu (*)" isPassword placeholder="Nhập mật khẩu" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} onClear={() => setFormData({ ...formData, password: '' })} />
            
            <Button type="submit" className="mt-6">Đăng ký ngay</Button>
          </form>
        </div>
        
        <div className="text-center mt-8 text-white text-[15px]">
          Đã có tài khoản? <Link to="/login" className="font-bold underline decoration-1 ml-1">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;