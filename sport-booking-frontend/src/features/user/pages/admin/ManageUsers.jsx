import React, { useEffect, useState, useRef } from 'react';
import { userService } from '../../services/userService';
import { Edit, Trash2, Plus, Camera, Link as LinkIcon, Wallet, Shield, Activity } from 'lucide-react';
import Button from '../../../../shared/components/Button';
import Input from '../../../../shared/components/Input';
import Modal from '../../../../shared/components/Modal';

// Avatar dự phòng dạng SVG inline (không bao giờ lỗi tải, tránh log lỗi mạng)
const AVATAR_FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><rect width='56' height='56' rx='16' fill='%23E8F5EC'/><circle cx='28' cy='22' r='9' fill='%230E8C4E'/><rect x='13' y='35' width='30' height='17' rx='8.5' fill='%230E8C4E'/></svg>";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  // States cho User Modal - Cập nhật đầy đủ các trường mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '',
    role: 'USER',
    status: 'ACTIVE',
    coinBalance: 0
  });

  // States cho Avatar Modal
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers();
      if (res.data.code === 0) setUsers(res.data.result);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditUser(user);
      setFormData({ 
        name: user.name, 
        email: user.email, 
        phone: user.phone || '', 
        password: '', // Để trống nếu không muốn đổi pass
        role: user.role,
        status: user.status,
        coinBalance: user.coinBalance
      });
    } else {
      setEditUser(null);
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        password: '', 
        role: 'USER', 
        status: 'ACTIVE', 
        coinBalance: 0 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Chuẩn bị dữ liệu gửi đi
      const submitData = { ...formData };
      
      // Nếu đang sửa và password trống thì xóa trường password đi để tránh ghi đè pass cũ thành trống
      if (editUser && !submitData.password) {
        delete submitData.password;
      }

      if (editUser) {
        await userService.updateUser(editUser.id, submitData);
        alert("Cập nhật thông tin User thành công!");
      } else {
        await userService.createUser(submitData);
        alert("Thêm người dùng mới thành công!");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) { 
      alert(error.response?.data?.message || "Có lỗi xảy ra!"); 
    }
  };

  // --- Logic Upload Avatar và Delete giữ nguyên như cũ ---
  const handleAvatarUpdate = async (type, value) => {
    if (!selectedUserId) return;
    setUploadingId(selectedUserId);
    setIsAvatarModalOpen(false);
    try {
      const payload = type === 'file' ? { file: value } : { imageUrl: value };
      const res = await userService.uploadAvatar(selectedUserId, payload);
      if (res.data.code === 0) {
        alert("Cập nhật ảnh thành công!");
        setAvatarUrlInput('');
        fetchUsers();
      }
    } catch (error) { alert("Lỗi cập nhật ảnh!"); } 
    finally { setUploadingId(null); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleAvatarUpdate('file', file);
    e.target.value = null;
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xóa người dùng này?")) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error) { alert("Xóa thất bại!"); }
    }
  };
  // Logic màu sắc trạng thái
  const getStatusStyles = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-pitch-soft text-pitch border-pitch/20';
      case 'INACTIVE': return 'bg-amber/10 text-amber border-amber/20'; // Vàng
      case 'BLOCKED': return 'bg-red-50 text-red-600 border-red-200';   // Đỏ
      default: return 'bg-chalk text-muted border-line';
    }
  }
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink tracking-tight">Quản lý Người dùng</h1>
          <p className="text-muted text-sm font-medium">Chỉnh sửa quyền hạn, trạng thái và ví tiền thành viên</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center justify-center gap-2 bg-pitch text-white px-6 py-3.5 rounded-2xl font-semibold shadow-glow hover:bg-pitch-deep transition-all">
          <Plus size={20} /> Thêm User mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-chalk border-b border-line">
                <th className="px-6 py-5 text-xs font-bold text-muted uppercase tracking-widest">Thành viên</th>
                <th className="px-6 py-5 text-xs font-bold text-muted uppercase tracking-widest">Liên hệ</th>
                <th className="px-6 py-5 text-xs font-bold text-muted uppercase tracking-widest text-center">Ví tiền</th>
                <th className="px-6 py-5 text-xs font-bold text-muted uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-6 py-5 text-xs font-bold text-muted uppercase tracking-widest text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-chalk transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative group/avatar">
                        <img
                          src={u.avatarUrl || AVATAR_FALLBACK}
                          alt="avatar"
                          onError={(e) => { e.currentTarget.src = AVATAR_FALLBACK; }}
                          className={`w-14 h-14 rounded-2xl object-cover shadow-card border-2 border-white transition-all duration-300 ${uploadingId === u.id ? 'opacity-20 blur-sm scale-90' : 'opacity-100'}`}
                        />
                        {uploadingId === u.id ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-pitch border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setSelectedUserId(u.id); setIsAvatarModalOpen(true); }}
                            className="absolute inset-0 bg-ink/50 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-all"
                          >
                            <Camera size={18} />
                          </button>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-ink text-[15px]">{u.name}</p>
                        <p className="text-[11px] text-pitch font-bold uppercase tracking-wider">{u.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-ink-soft">{u.email}</p>
                    <p className="text-xs text-muted">{u.phone}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber/10 rounded-xl">
                       <Wallet size={14} className="text-amber" />
                       <span className="text-sm font-bold text-amber">
                         {u.coinBalance?.toLocaleString() || 0}đ
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase border ${getStatusStyles(u.status)}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(u)} className="p-2.5 text-pitch hover:bg-pitch-soft rounded-xl transition-all"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(u.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CẬP NHẬT AVATAR GIỮ NGUYÊN */}
      <Modal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} title="Thay đổi ảnh đại diện">
    <div className="space-y-6">
      <div className="p-5 bg-pitch-soft rounded-2xl border border-pitch/15">
        <label className="text-sm text-pitch-deep font-semibold mb-3 flex items-center gap-2">
          <LinkIcon size={16} /> Nhập link ảnh trực tiếp
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="https://images.unsplash.com/..."
            className="flex-1 px-4 py-3.5 rounded-xl border border-line outline-none focus:ring-2 focus:ring-pitch text-sm bg-white shadow-card"
            value={avatarUrlInput}
            onChange={(e) => setAvatarUrlInput(e.target.value)}
          />
          <button
            onClick={() => handleAvatarUpdate('url', avatarUrlInput)}
            disabled={!avatarUrlInput}
            className="bg-pitch text-white px-5 py-2 rounded-xl font-semibold disabled:opacity-50 hover:bg-pitch-deep transition-colors"
          >
            Lưu
          </button>
        </div>
      </div>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-line"></div>
        <span className="flex-shrink mx-4 text-xs font-bold text-muted uppercase tracking-widest">Hoặc</span>
        <div className="flex-grow border-t border-line"></div>
      </div>

      <button
        onClick={() => fileInputRef.current.click()}
        className="w-full py-10 border-2 border-dashed border-line rounded-3xl hover:border-pitch hover:bg-pitch-soft transition-all group flex flex-col items-center justify-center"
      >
        <div className="p-4 bg-chalk rounded-2xl group-hover:bg-pitch-soft transition-colors mb-3">
           <Camera className="text-muted group-hover:text-pitch transition-colors" size={32} />
        </div>
        <p className="text-sm font-semibold text-muted group-hover:text-pitch">Tải ảnh lên từ thiết bị</p>
        <p className="text-[11px] text-muted mt-1">Chấp nhận JPG, PNG, WEBP</p>
      </button>
    </div>
  </Modal>

  <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />


      {/* --- MODAL USER FORM (CẬP NHẬT MỚI) --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editUser ? "Chỉnh sửa thông tin thành viên" : "Tạo tài khoản mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Họ và tên (*)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <Input label="Số điện thoại (*)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          
          <Input label="Email liên hệ (*)" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cột Role */}
            <div className="space-y-2">
              <label className="text-[15px] font-semibold text-ink-soft flex items-center gap-2">
                <Shield size={16} /> Quyền hạn
              </label>
              <select
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-3 border border-line rounded-xl outline-none focus:ring-2 focus:ring-pitch text-sm font-medium bg-chalk"
              >
                <option value="USER">USER (Khách hàng)</option>
                <option value="ADMIN">ADMIN (Quản trị)</option>
              </select>
            </div>

            {/* Cột Status */}
            <div className="space-y-2">
              <label className="text-[15px] font-semibold text-ink-soft flex items-center gap-2">
                <Activity size={16} /> Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 border border-line rounded-xl outline-none focus:ring-2 focus:ring-pitch text-sm font-medium bg-chalk"
              >
                <option value="ACTIVE">ACTIVE (Hoạt động)</option>
                <option value="INACTIVE" className="text-yellow-600">INACTIVE (Tạm Khóa)</option>
                <option value="BLOCKED" className="text-red-600">BLOCKED (Cấm)</option>
              </select>
            </div> 
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <Input 
              label="Số dư ví (Coin)" 
              type="number" 
              value={formData.coinBalance} 
              onChange={e => setFormData({...formData, coinBalance: Number(e.target.value)})} 
            />
            <Input 
              label={editUser ? "Mật khẩu mới (Bỏ trống nếu giữ cũ)" : "Mật khẩu khởi tạo (*)"} 
              isPassword 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <div className="pt-4 border-t border-line">
            <Button type="submit">
              {editUser ? "Xác nhận cập nhật" : "Tạo người dùng ngay"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageUsers;