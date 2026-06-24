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
    case 'ACTIVE': return 'bg-pitch-soft text-pitch border-pitch/20';
    case 'INACTIVE': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'MAINTENANCE': return 'bg-red-50 text-red-600 border-red-200';
    default: return 'bg-chalk text-muted border-line';
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
    <div className="bg-white rounded-2xl shadow-card border border-line overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-line flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-display font-bold text-ink uppercase tracking-wide text-sm flex items-center gap-2">
            <LayoutGrid size={18} className="text-pitch"/>
            Danh sách sân chi tiết ({initialFields?.length || 0})
          </h3>
          <p className="text-[12px] text-muted font-medium mt-1">
            Quản lý đơn vị sân thuộc cơ sở {venueName}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-pitch text-white px-6 py-2.5 rounded-2xl font-semibold text-[12px] uppercase tracking-wide flex items-center gap-2 hover:bg-pitch-deep shadow-glow transition-all active:scale-95"
        >
          <Plus size={16} /> Thêm sân vào cơ sở
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-chalk border-b border-line">
            <tr>
              <th className="px-8 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Tên Sân</th>
              <th className="px-8 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Loại hình</th>
              <th className="px-8 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Giá thuê</th>
              <th className="px-8 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Hoạt động</th>
              <th className="px-8 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">
  Slot
</th>
              <th className="px-8 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Trạng thái</th>
              <th className="px-8 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {initialFields && initialFields.length > 0 ? initialFields.map((f) => (
              <tr key={f.id} className="hover:bg-chalk transition-colors group">
                <td className="px-8 py-4 font-bold text-ink text-sm">{f.name}</td>
                <td className="px-8 py-4 text-center font-semibold text-muted text-xs uppercase tracking-wide">
                  {f.fieldTypeName}
                </td>
                <td className="px-8 py-4 text-center">
                   <span className="text-pitch font-bold text-sm">{formatPrice(f.pricePerHour)}/h</span>
                </td>
                <td className="px-8 py-4 text-center text-[12px] font-semibold text-muted">
                  {formatTime(f.openTime)} - {formatTime(f.closeTime)}
                </td>
                <td className="px-8 py-4 text-center">
  <span className="px-3 py-1 bg-pitch-soft text-pitch rounded-full text-[11px] font-semibold">
    {f.slotInterval || 30}p
  </span>
</td>
                <td className="px-8 py-4 text-center">
                   <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase border tracking-wide ${getStatusStyles(f.status)}`}>
                     {f.status}
                   </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                onClick={() => { setPricingField(f); setIsPricingModalOpen(true); }}
                className="p-2.5 text-pitch hover:bg-pitch-soft rounded-xl transition-all border border-transparent hover:border-pitch/15"
                title="Quản lý khung giá"
              >
                <DollarSign size={16}/>
              </button>
                    <button
                      onClick={() => handleOpenModal(f)}
                      className="p-2.5 text-ink hover:bg-chalk rounded-xl transition-all border border-transparent hover:border-line"
                    >
                      <Edit size={16}/>
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-20 text-center text-muted font-semibold text-sm">
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
              <label className="text-[11px] font-semibold text-muted uppercase tracking-wide flex items-center gap-2">
                <LayoutGrid size={14}/> Loại hình sân
              </label>
              <select
                value={formData.fieldTypeId}
                onChange={e => setFormData({...formData, fieldTypeId: e.target.value})}
                className="w-full px-4 py-3 bg-chalk border border-line rounded-xl outline-none text-sm font-semibold text-ink focus:ring-2 focus:ring-pitch transition-all"
                required
              >
                <option value="">-- Chọn loại sân --</option>
                {fieldTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-muted uppercase tracking-wide flex items-center gap-2">
                <Activity size={14}/> Trạng thái sân
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 bg-chalk border border-line rounded-xl outline-none text-sm font-semibold text-ink focus:ring-2 focus:ring-pitch transition-all"
              >
                <option value="ACTIVE">ACTIVE (Sẵn sàng)</option>
                <option value="INACTIVE">INACTIVE (Tạm dừng)</option>
                <option value="MAINTENANCE">MAINTENANCE (Bảo trì)</option>
              </select>
            </div>
          </div>

          <div className="p-5 bg-pitch-soft rounded-3xl border border-pitch/15 space-y-4">
            <div className="flex items-center gap-2 text-pitch font-semibold text-[11px] uppercase tracking-wide">
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
  <label className="text-[11px] font-semibold text-muted uppercase tracking-wide">
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
        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border active:scale-95
          ${
            formData.slotInterval === slot
              ? 'bg-pitch text-white border-pitch shadow-glow'
              : 'bg-white text-ink border-line hover:bg-pitch-soft'
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