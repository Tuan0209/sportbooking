import React, { useState, useEffect } from 'react';
import { fieldService } from '../../../field/services/fieldService';
import { 
  Plus, Edit, Trash2, Clock, DollarSign, 
  Activity, LayoutGrid, Loader2 
} from 'lucide-react';
import { formatPrice, formatTime } from '../../../../shared/utils/formatDate';
import Modal from '../../../../shared/components/Modal';
import Input from '../../../../shared/components/Input';
import Button from '../../../../shared/components/Button';

import FieldPricingModal from '../../../field/components/admin/FieldPricingModal';

// Helper style trạng thái sân
const getStatusStyles = (status) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
    case 'INACTIVE': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'MAINTENANCE': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const VenueFieldList = ({ venueId, venueName, initialFields, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldTypes, setFieldTypes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  // Modal quản lý khung giá (price slots)
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingField, setPricingField] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    fieldTypeId: '',
    pricePerHour: '',
    openTime: '06:00',
    closeTime: '22:00',
    status: 'ACTIVE',
    slotInterval: 30

  });

  // Lấy danh sách loại sân khi mở modal
  useEffect(() => {
    if (isModalOpen) {
      fieldService.getAllFieldTypes().then(res => {
        if (res.data.code === 0) setFieldTypes(res.data.result);
      });
    }
  }, [isModalOpen]);

  const handleOpenModal = (field = null) => {
    if (field) {
      setSelectedField(field);
      setFormData({
        name: field.name,
        fieldTypeId: field.fieldTypeId,
        pricePerHour: field.pricePerHour,
        openTime: field.openTime?.slice(0, 5),
        closeTime: field.closeTime?.slice(0, 5),
        status: field.status,
        slotInterval: field.slotInterval || 30
      });
    } else {
      setSelectedField(null);
      setFormData({
        name: '',
        fieldTypeId: '',
        pricePerHour: '',
        openTime: '06:00',
        closeTime: '22:00',
        status: 'ACTIVE',
        slotInterval: 30
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    console.log("Submitting field data:", formData);
    // Format thời gian sang HH:mm:ss cho Backend
    const payload = {
      ...formData,
      venueId: venueId,
      openTime: `${formData.openTime}:00`,
      closeTime: `${formData.closeTime}:00`,
      pricePerHour: Number(formData.pricePerHour)
    };

    try {
      let res;
      if (selectedField) {
        res = await fieldService.updateField(selectedField.id, payload);
      } else {
        res = await fieldService.createField(payload);
      }

      if (res.data.code === 0) {
        setIsModalOpen(false);
        onRefresh(); // Tải lại dữ liệu cơ sở từ trang VenueDetail
      }
    } catch (err) {
      alert(err.response?.data?.message || "Thao tác thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sân này khỏi cơ sở?")) {
      try {
        const res = await fieldService.deleteField(id);
        if (res.data.code === 0) onRefresh();
      } catch (err) {
        alert("Không thể xóa sân lúc này");
      }
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2">
            <LayoutGrid size={18} className="text-indigo-600"/>
            Danh sách sân chi tiết ({initialFields?.length || 0})
          </h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase mt-1 tracking-tighter italic">
            Quản lý đơn vị sân thuộc cơ sở {venueName}
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          <Plus size={16} /> Thêm sân vào cơ sở
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tên Sân</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Loại hình</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Giá thuê</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Hoạt động</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
  Slot
</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Trạng thái</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {initialFields && initialFields.length > 0 ? initialFields.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 font-black text-slate-700 text-sm">{f.name}</td>
                <td className="px-8 py-5 text-center font-bold text-slate-500 text-xs uppercase italic tracking-tighter">
                  {f.fieldTypeName}
                </td>
                <td className="px-8 py-5 text-center">
                   <span className="text-emerald-600 font-black text-sm">{formatPrice(f.pricePerHour)}/h</span>
                </td>
                <td className="px-8 py-5 text-center text-[12px] font-bold text-slate-500 italic">
                  {formatTime(f.openTime)} - {formatTime(f.closeTime)}
                </td>
                <td className="px-8 py-5 text-center">
  <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-xl text-[11px] font-black">
    {f.slotInterval || 30}p
  </span>
</td>
                <td className="px-8 py-5 text-center">
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${getStatusStyles(f.status)}`}>
                     {f.status}
                   </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                onClick={() => { setPricingField(f); setIsPricingModalOpen(true); }}
                className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100 shadow-sm"
                title="Quản lý khung giá"
              >
                <DollarSign size={16}/>
              </button> 
                    <button 
                      onClick={() => handleOpenModal(f)} 
                      className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100 shadow-sm"
                    >
                      <Edit size={16}/>
                    </button>
                    <button 
                      onClick={() => handleDelete(f.id)} 
                      className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100 shadow-sm"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-20 text-center text-slate-300 font-bold italic text-sm">
                  Cơ sở này chưa có sân chi tiết nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM THÊM/SỬA SÂN */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedField ? "Cấu hình đơn vị sân" : `Thêm sân vào: ${venueName}`}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Tên sân chi tiết (*)" 
            placeholder="Ví dụ: Sân số 1 (Trong nhà)"
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid size={14}/> Loại hình sân
              </label>
              <select 
                value={formData.fieldTypeId} 
                onChange={e => setFormData({...formData, fieldTypeId: e.target.value})} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              >
                <option value="">-- Chọn loại sân --</option>
                {fieldTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={14}/> Trạng thái sân
              </label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="ACTIVE">ACTIVE (Sẵn sàng)</option>
                <option value="INACTIVE">INACTIVE (Tạm dừng)</option>
                <option value="MAINTENANCE">MAINTENANCE (Bảo trì)</option>
              </select>
            </div>
          </div>

          <div className="p-5 bg-indigo-50/30 rounded-3xl border border-indigo-100/50 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
               <DollarSign size={14}/> Cấu hình giá & thời gian
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <Input 
                label="Giá thuê/Giờ" 
                type="number"
                placeholder="200000"
                value={formData.pricePerHour} 
                onChange={e => setFormData({...formData, pricePerHour: e.target.value})}
                required
              />
              <Input 
                label="Giờ mở" 
                type="time" 
                value={formData.openTime} 
                onChange={e => setFormData({...formData, openTime: e.target.value})}
                required
              />
              <Input 
                label="Giờ đóng" 
                type="time" 
                value={formData.closeTime} 
                onChange={e => setFormData({...formData, closeTime: e.target.value})}
                required
              />
            </div>
          </div>
           <div className="space-y-2">
  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
    Slot Interval
  </label>

  <div className="flex flex-wrap gap-2">
    {[15, 30, 45, 60, 90, 120].map((slot) => (
      <button
        type="button"
        key={slot}
        onClick={() =>
          setFormData({
            ...formData,
            slotInterval: slot
          })
        }
        className={`px-4 py-2 rounded-xl text-xs font-black transition-all border active:scale-95
          ${
            formData.slotInterval === slot
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-indigo-50'
          }`}
      >
        {slot}p
      </button>
    ))}
  </div>
</div>
          <div className="pt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin mx-auto"/> : (selectedField ? "Lưu cấu hình sân" : "Xác nhận thêm sân")}
            </Button>
          </div>
        </form>
      </Modal>
      <FieldPricingModal 
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        field={pricingField}
      />
    </div>
  );
};

export default VenueFieldList;