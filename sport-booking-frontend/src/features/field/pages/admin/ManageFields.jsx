import React, { useEffect, useState } from 'react';
import { fieldService } from '../../services/fieldService';
import { formatPrice, formatTime } from '../../../../shared/utils/formatDate';
import { 
  Plus, Edit, Trash2, Search, MapPin, 
  Clock, DollarSign, LayoutGrid, Globe , Image as ImageIcon
} from 'lucide-react';
import Modal from '../../../../shared/components/Modal';
import Input from '../../../../shared/components/Input';
import Button from '../../../../shared/components/Button';
import FieldImagesModal from '../../components/admin/FieldImagesModal';


// Hàm định dạng màu sắc trạng thái giống ảnh mẫu
const getStatusStyles = (status) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
    case 'INACTIVE': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'MAINTENANCE': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};
// Modal quản lý ảnh sân

const ManageFields = () => {
  const [fields, setFields] = useState([]); 
  const [filteredFields, setFilteredFields] = useState([]); 
  const [areas, setAreas] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [selectedFieldForImg, setSelectedFieldForImg] = useState(null);


  const [formData, setFormData] = useState({
    name: '', areaId: '', fieldTypeId: '', address: '',
    pricePerHour: 0, openTime: '06:00:00', closeTime: '22:00:00',
    latitude: 0, longitude: 0, status: 'ACTIVE'
  });

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    let result = [...fields];
    if (searchTerm) result = result.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())); 
    if (filterArea) result = result.filter(f => f.areaId === filterArea);
    if (filterType) result = result.filter(f => f.fieldTypeId === filterType);
    if (filterStatus) result = result.filter(f => f.status === filterStatus);
    setFilteredFields(result);
  }, [searchTerm, filterArea, filterType, filterStatus, fields]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resF, resA, resT] = await Promise.all([
        fieldService.getAllFields(),      
        fieldService.getAllAreas(),       
        fieldService.getAllFieldTypes()   
      ]);
      if (resF.data.code === 0) {
        setFields(resF.data.result);
        setFilteredFields(resF.data.result);
      }
      if (resA.data.code === 0) setAreas(resA.data.result);
      if (resT.data.code === 0) setFieldTypes(resT.data.result);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleOpenModal = (field = null) => {
    setEditField(field);
    setFormData(field ? { ...field } : {
      name: '', areaId: '', fieldTypeId: '', address: '',
      pricePerHour: 0, openTime: '06:00:00', closeTime: '22:00:00',
      latitude: 0, longitude: 0, status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editField) await fieldService.updateField(editField.id, formData);
      else await fieldService.createField(formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err) { alert("Lỗi khi lưu dữ liệu!"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xóa sân này?")) {
      try {
        await fieldService.deleteField(id);
        fetchData();
      } catch (err) { alert("Lỗi khi xóa!"); }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic underline decoration-indigo-500 decoration-4">Quản lý Sân</h1>
          <p className="text-slate-400 text-sm font-medium italic">Hệ thống quản lý chi tiết danh sách sân bóng</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl active:scale-95">
          <Plus size={20} /> Thêm sân mới
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Tìm tên sân..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-600" value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
          <option value="">-- Tất cả khu vực --</option>
          {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-600" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">-- Tất cả loại sân --</option>
          {fieldTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-600" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">-- Trạng thái --</option>
          <option value="ACTIVE">ACTIVE (Xanh)</option>
          <option value="INACTIVE">INACTIVE (Vàng)</option>
          <option value="MAINTENANCE">MAINTENANCE (Đỏ)</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Sân</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Loại sân</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Khu vực</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Giá</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Giờ</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFields.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                   
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-800 text-[15px]">{f.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium italic truncate max-w-[150px]">{f.address}</p>
                  </td>
                  <td className="px-6 py-5 text-center text-sm font-bold text-slate-600 italic">
                    {f.fieldTypeName}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase italic">
                      <Globe size={12}/> {f.areaName}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-black text-emerald-600 text-sm italic">
                    {formatPrice(f.pricePerHour)}
                  </td>
                  <td className="px-6 py-5 text-center font-bold text-slate-500 text-[12px] whitespace-nowrap italic">
                    {formatTime(f.openTime)} - {formatTime(f.closeTime)}
                  </td>
                      
                  {/* CỘT TRẠNG THÁI MỚI */}
                  <td className="px-6 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest ${getStatusStyles(f.status)}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                     <button 
                        onClick={() => {
                        setSelectedFieldForImg(f);
                        setIsImgModalOpen(true);
                  }}
                     className="p-2.5 text-amber-600 hover:bg-amber-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-amber-100"
                     title="Quản lý ảnh"
                  >
               <ImageIcon size={18} />
               </button>

                    <button onClick={() => handleOpenModal(f)} className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(f.id)} className="p-2.5 text-red-500 hover:bg-red-100 rounded-xl transition-all"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editField ? "Cấu hình sân bóng" : "Tạo sân mới"}>
         <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Tên sân chi tiết (*)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Khu vực</label>
                <select value={formData.areaId} onChange={e => setFormData({...formData, areaId: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none text-sm font-bold border-slate-100">
                  <option value="">-- Chọn khu vực --</option>
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Loại sân</label>
                <select value={formData.fieldTypeId} onChange={e => setFormData({...formData, fieldTypeId: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none text-sm font-bold border-slate-100">
                  <option value="">-- Chọn loại sân --</option>
                  {fieldTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
            <Input label="Địa chỉ sân (*)" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            <div className="grid grid-cols-3 gap-4">
              <Input label="Giá thuê / Giờ" type="number" value={formData.pricePerHour} onChange={e => setFormData({...formData, pricePerHour: Number(e.target.value)})} />
              <Input label="Giờ mở" type="time" value={formData.openTime} onChange={e => setFormData({...formData, openTime: e.target.value})} />
              <Input label="Giờ đóng" type="time" value={formData.closeTime} onChange={e => setFormData({...formData, closeTime: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái sân</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl outline-none text-sm font-bold border-slate-100">
                <option value="ACTIVE" className="text-green-600 font-bold">ACTIVE (Sẵn sàng)</option>
                <option value="INACTIVE" className="text-yellow-600 font-bold">INACTIVE (Tạm dừng)</option>
                <option value="MAINTENANCE" className="text-red-600 font-bold">MAINTENANCE (Bảo trì)</option>
              </select>
            </div>
            <div className="pt-4">
               <Button type="submit">Lưu cấu hình sân</Button>
            </div>
         </form>
      </Modal>
      <FieldImagesModal 
        isOpen={isImgModalOpen}
        onClose={() => setIsImgModalOpen(false)}
        fieldId={selectedFieldForImg?.id}
        fieldName={selectedFieldForImg?.name}
      />
    </div>
  );
};

export default ManageFields;