import React, { useEffect, useState } from 'react';
import { fieldService } from '../../services/fieldService';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import Modal from '../../../../shared/components/Modal';
import Input from '../../../../shared/components/Input';
import Button from '../../../../shared/components/Button';

const ManageAreas = () => {
  const [areas, setAreas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editArea, setEditArea] = useState(null);
  const [formData, setFormData] = useState({ name: '', city: '' });

  useEffect(() => { fetchAreas(); }, []);

  const fetchAreas = async () => {
    const res = await fieldService.getAllAreas();
    if (res.data.code === 0) setAreas(res.data.result);
  };

  const handleOpenModal = (area = null) => {
    setEditArea(area);
    setFormData(area ? { name: area.name, city: area.city } : { name: '', city: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editArea) await fieldService.updateArea(editArea.id, formData);
      else await fieldService.createArea(formData);
      setIsModalOpen(false);
      fetchAreas();
    } catch (err) { alert("Lỗi thao tác!"); }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-card border border-line">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink tracking-tight">Quản lý Khu vực</h1>
          <p className="text-muted text-sm">Quản lý các quận/huyện và thành phố</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-pitch text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:bg-pitch-deep transition-all shadow-glow">
          <Plus size={20} /> Thêm Khu vực
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area) => (
          <div key={area.id} className="bg-white p-6 rounded-2xl border border-line shadow-card hover:shadow-card-hover transition-all group">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-pitch-soft rounded-2xl text-pitch mb-4">
                <MapPin size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(area)} className="p-2 text-pitch hover:bg-pitch-soft rounded-lg"><Edit size={18} /></button>
                <button onClick={() => { if(window.confirm("Xóa khu vực này?")) fieldService.deleteArea(area.id).then(fetchAreas) }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
              </div>
            </div>
            <h3 className="font-display text-lg font-bold text-ink">{area.name}</h3>
            <p className="text-muted font-medium">{area.city}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editArea ? "Sửa khu vực" : "Thêm khu vực"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Tên Khu vực (Quận/Huyện)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <Input label="Thành phố" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
          <Button type="submit">Lưu thông tin</Button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageAreas;