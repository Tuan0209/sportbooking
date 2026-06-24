import React, { useEffect, useState } from 'react';
import { fieldService } from '../../services/fieldService';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import Modal from '../../../../shared/components/Modal';
import Input from '../../../../shared/components/Input';
import Button from '../../../../shared/components/Button';

const ManageFieldTypes = () => {
  const [types, setTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => { fetchTypes(); }, []);

  const fetchTypes = async () => {
    const res = await fieldService.getAllFieldTypes();
    if (res.data.code === 0) setTypes(res.data.result);
  };

  const handleOpenModal = (data = null) => {
    setEditData(data);
    setFormData(data ? { name: data.name } : { name: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) await fieldService.updateFieldType(editData.id, formData);
      else await fieldService.createFieldType(formData);
      setIsModalOpen(false);
      fetchTypes();
    } catch (err) { alert("Lỗi thao tác!"); }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-card border border-line">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink tracking-tight">Quản lý Loại sân</h1>
          <p className="text-muted text-sm font-medium">Các danh mục: Sân gôn, Sân bóng đá...</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-pitch text-white px-8 py-3.5 rounded-2xl font-semibold flex items-center gap-2 hover:bg-pitch-deep transition-all shadow-glow">
          <Plus size={20} /> Thêm Loại sân
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {types.map((type) => (
          <div key={type.id} className="bg-white p-6 rounded-2xl border border-line shadow-card hover:shadow-card-hover transition-all group flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-4 bg-pitch-soft rounded-2xl text-pitch"><Layers size={24} /></div>
               <h3 className="font-display text-lg font-bold text-ink leading-tight">{type.name}</h3>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(type)} className="p-2 text-pitch hover:bg-pitch-soft rounded-xl transition-all"><Edit size={18} /></button>
                <button onClick={() => { if(window.confirm("Xóa loại sân này?")) fieldService.deleteFieldType(type.id).then(fetchTypes) }} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editData ? "Sửa loại sân" : "Thêm loại sân"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Tên Loại sân (*)" value={formData.name} onChange={e => setFormData({name: e.target.value})} />
          <Button type="submit">Lưu thông tin</Button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageFieldTypes;