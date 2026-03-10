import React, { useEffect, useState, useRef } from 'react';
import { userService } from '../../services/userService';
import { Edit, Trash2, Plus, Camera, Link as LinkIcon, Wallet, Shield, Activity } from 'lucide-react';
import Button from '../../../../shared/components/Button';
import Input from '../../../../shared/components/Input';
import Modal from '../../../../shared/components/Modal';

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
      case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
      case 'INACTIVE': return 'bg-yellow-100 text-yellow-700 border-yellow-200'; // Vàng
      case 'BLOCKED': return 'bg-red-100 text-red-700 border-red-200';         // Đỏ
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Quản lý Người dùng</h1>
          <p className="text-gray-500 text-sm font-medium">Chỉnh sửa quyền hạn, trạng thái và ví tiền thành viên</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Plus size={20} /> Thêm User mới
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Thành viên</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Liên hệ</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Ví tiền</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative group/avatar">
                        <img 
                          src={u.avatarUrl || 'https://via.placeholder.com/150'} 
                          alt="avatar" 
                          className={`w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-white transition-all duration-300 ${uploadingId === u.id ? 'opacity-20 blur-sm scale-90' : 'opacity-100'}`}
                        />
                        {uploadingId === u.id ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => { setSelectedUserId(u.id); setIsAvatarModalOpen(true); }}
                            className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-all"
                          >
                            <Camera size={18} />
                          </button>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-[15px]">{u.name}</p>
                        <p className="text-[11px] text-indigo-600 font-black uppercase tracking-wider">{u.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-gray-600">{u.email}</p>
                    <p className="text-xs text-gray-400">{u.phone}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-xl">
                       <Wallet size={14} className="text-orange-500" />
                       <span className="text-sm font-black text-orange-600">
                         {u.coinBalance?.toLocaleString() || 0}đ
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border ${getStatusStyles(u.status)}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(u)} className="p-2.5 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all"><Edit size={18} /></button>
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
          {/* ... phần code modal avatar trước đó ... */}
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
              <label className="text-[15px] font-bold text-[#004d31] flex items-center gap-2">
                <Shield size={16} /> Quyền hạn
              </label>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium bg-gray-50"
              >
                <option value="USER">USER (Khách hàng)</option>
                <option value="ADMIN">ADMIN (Quản trị)</option>
              </select>
            </div>
            
            {/* Cột Status */}
            <div className="space-y-2">
              <label className="text-[15px] font-bold text-[#004d31] flex items-center gap-2">
                <Activity size={16} /> Trạng thái
              </label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium bg-gray-50"
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

          <div className="pt-4 border-t border-gray-100">
            <Button type="submit" className="shadow-indigo-100 shadow-lg">
              {editUser ? "Xác nhận cập nhật" : "Tạo người dùng ngay"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageUsers;