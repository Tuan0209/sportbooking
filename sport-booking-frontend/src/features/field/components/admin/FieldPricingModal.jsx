import React, { useState, useEffect } from 'react';
import { fieldService } from '../../services/fieldService';
import { formatPrice, formatTime } from '../../../../shared/utils/formatDate';
import { Plus, Trash2, Edit2, Clock, Calendar, AlertCircle, Save, X, Loader2, Coins } from 'lucide-react';
import Modal from '../../../../shared/components/Modal';
import Input from '../../../../shared/components/Input';
import Button from '../../../../shared/components/Button';

const DAYS = [
  { val: null, label: 'Tất cả các ngày' },
  { val: 1, label: 'Thứ 2' }, { val: 2, label: 'Thứ 3' },
  { val: 3, label: 'Thứ 4' }, { val: 4, label: 'Thứ 5' },
  { val: 5, label: 'Thứ 6' }, { val: 6, label: 'Thứ 7' },
  { val: 0, label: 'Chủ Nhật' },
];

const FieldPricingModal = ({ isOpen, onClose, field }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  const [formData, setFormData] = useState({
    startTime: '17:00',
    endTime: '22:00',
    price: '',
    dayOfWeek: '',
    startDate: '',
    endDate: '',
    priority: 1
  });

  useEffect(() => {
    if (isOpen && field?.id) fetchSlots();
  }, [isOpen, field]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await fieldService.getPriceSlots(field.id);
      if (res.data.code === 0) setSlots(res.data.result);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setFormData({
      startTime: slot.startTime.slice(0, 5),
      endTime: slot.endTime.slice(0, 5),
      price: slot.price,
      dayOfWeek: slot.dayOfWeek === null ? '' : slot.dayOfWeek,
      startDate: slot.startDate || '',
      endDate: slot.endDate || '',
      priority: slot.priority
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...formData,
      fieldId: field.id,
      startTime: `${formData.startTime}:00`,
      endTime: `${formData.endTime}:00`,
      dayOfWeek: formData.dayOfWeek === '' ? null : Number(formData.dayOfWeek),
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
    };

    try {
      if (editingSlot) await fieldService.updatePriceSlot(editingSlot.id, payload);
      else await fieldService.createPriceSlot(payload);
      
      setShowForm(false);
      setEditingSlot(null);
      fetchSlots();
    } catch (err) { alert(err.response?.data?.message || "Lỗi lưu khung giá"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa khung giá này?")) return;
    try {
      await fieldService.deletePriceSlot(id);
      fetchSlots();
    } catch (e) { alert("Lỗi xóa"); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Khung giá: ${field?.name}`} size="xl">
      <div className="space-y-6">
        {/* FIELD INFO SUMMARY */}
        <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Giá cơ bản</p>
            <p className="text-xl font-black text-indigo-600">{formatPrice(field?.pricePerHour)}/h</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Giờ hoạt động</p>
            <p className="text-sm font-bold text-slate-600 flex items-center justify-end gap-1.5">
              <Clock size={14} className="text-indigo-400"/> {formatTime(field?.openTime)} - {formatTime(field?.closeTime)}
            </p>
          </div>
        </div>

        {/* ACTIONS & LIST */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Coins size={14}/> Danh sách khung giá tùy chỉnh
            </h4>
            {!showForm && (
              <button 
                onClick={() => { setEditingSlot(null); setFormData({startTime: '17:00', endTime: '22:00', price: '', dayOfWeek: '', startDate: '', endDate: '', priority: 1}); setShowForm(true); }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <Plus size={14}/> Thêm khung giá
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] border-2 border-indigo-100 space-y-5 animate-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Giờ bắt đầu" type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required />
                <Input label="Giờ kết thúc" type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Giá áp dụng (đ)" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Độ ưu tiên (Priority)</label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} min="0" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ngày trong tuần</label>
                <select value={formData.dayOfWeek} onChange={e => setFormData({...formData, dayOfWeek: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm">
                  {DAYS.map(d => <option key={d.val} value={d.val === null ? '' : d.val}>{d.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Áp dụng từ ngày" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                <Input label="Đến hết ngày" type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all">
                  {loading ? <Loader2 size={16} className="animate-spin"/> : <><Save size={16}/> Lưu khung giá</>}
                </button>
                <button type="button" onClick={() => {setShowForm(false); setEditingSlot(null);}} className="px-6 bg-slate-100 text-slate-500 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                  Hủy
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden min-h-[200px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khung giờ</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Áp dụng</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ưu tiên</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {slots.length > 0 ? slots.map(slot => (
                    <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                          <Clock size={12} className="text-indigo-400"/>
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-emerald-600 text-sm">
                        {formatPrice(slot.price)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter italic">
                             {slot.dayOfWeek === null ? 'Toàn bộ tuần' : DAYS.find(d => d.val === slot.dayOfWeek)?.label}
                          </span>
                          {slot.startDate && (
                            <span className="text-[9px] font-bold text-indigo-400 flex items-center gap-1">
                               <Calendar size={10}/> {slot.startDate} → {slot.endDate || '...'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-black text-slate-400 border border-slate-200">P{slot.priority}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(slot)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={14}/></button>
                          <button onClick={() => handleDelete(slot.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center">
                         <div className="flex flex-col items-center gap-2 text-slate-300 italic text-sm">
                            <AlertCircle size={32} strokeWidth={1}/>
                            Chưa có khung giá tùy chỉnh nào cho sân này.
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FieldPricingModal;