import React, { useEffect, useState } from 'react';
import { serviceService } from '../../services/serviceService';
import { Plus, Edit, Trash2, Loader2, RefreshCw, Coffee } from 'lucide-react';
import { formatPrice } from '../../../../shared/utils/formatDate';

const EMPTY_FORM = { name: '', price: '', unit: '', status: 'ACTIVE' };

const ManageServices = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = () => {
    setLoading(true);
    serviceService.adminList()
      .then((res) => { if (res.data.code === 0) setItems(res.data.result || []); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, price: s.price, unit: s.unit, status: s.status });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!form.name.trim() || form.price === '' || !form.unit.trim()) {
      alert('Vui lòng nhập đầy đủ tên, giá và đơn vị.');
      return;
    }
    setSaving(true);
    const data = {
      name: form.name.trim(),
      price: Number(form.price),
      unit: form.unit.trim(),
      status: form.status,
    };
    try {
      const res = editing
        ? await serviceService.adminUpdate(editing.id, data)
        : await serviceService.adminCreate(data);
      if (res.data.code === 0) {
        closeModal();
        load();
      } else {
        alert(res.data.message || 'Lưu thất bại.');
      }
    } catch (e) {
      alert('Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Xoá dịch vụ "${s.name}"?`)) return;
    try {
      const res = await serviceService.adminDelete(s.id);
      if (res.data.code === 0) load();
      else alert(res.data.message || 'Xoá thất bại.');
    } catch (e) {
      alert('Xoá thất bại.');
    }
  };

  return (
    <div className="animate-fade-up">
      {/* HEADER */}
      <div className="stadium pitch-lines rounded-3xl px-8 py-7 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">Quản lý Dịch vụ</h1>
          <p className="text-white/60 text-sm font-medium mt-1">Dịch vụ kèm theo sân (nước, thuê vợt, trọng tài...)</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all w-fit">
            <RefreshCw size={18} /> Tải lại
          </button>
          <button onClick={openCreate} className="bg-pitch text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-glow hover:bg-pitch-deep transition-all w-fit">
            <Plus size={18} /> Thêm dịch vụ
          </button>
        </div>
      </div>

      {/* BẢNG */}
      <div className="bg-white rounded-2xl shadow-card border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-chalk border-b border-line">
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Tên dịch vụ</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-right">Giá</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Đơn vị</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={5} className="py-16 text-center"><Loader2 className="animate-spin text-pitch mx-auto" size={28} /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-muted">Chưa có dịch vụ nào.</td></tr>
              ) : items.map((s) => (
                <tr key={s.id} className="hover:bg-chalk transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-pitch-soft text-pitch">
                        <Coffee size={18} />
                      </span>
                      <p className="font-semibold text-ink text-sm">{s.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-display font-extrabold text-pitch">{formatPrice(s.price)}</span>
                    <span className="text-[11px] text-muted">/{s.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink">{s.unit}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${s.status === 'ACTIVE' ? 'bg-pitch-soft text-pitch' : 'bg-chalk text-muted'}`}>
                      {s.status === 'ACTIVE' ? 'Đang bán' : 'Ngừng bán'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="inline-flex items-center gap-1 bg-chalk text-ink text-xs font-semibold px-3 py-2 rounded-xl hover:bg-line transition-colors"
                      >
                        <Edit size={14} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(s)}
                        className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={14} /> Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TẠO / SỬA */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-card animate-fade-up overflow-hidden">
            <div className="px-7 pt-6 pb-4 border-b border-line">
              <h2 className="font-display text-xl font-extrabold text-ink">
                {editing ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
              </h2>
              <p className="text-muted text-xs font-medium mt-1">Dịch vụ kèm theo sân (nước, thuê vợt, trọng tài...)</p>
            </div>

            <div className="px-7 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Tên dịch vụ</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Nước suối, Thuê vợt, Trọng tài..."
                  className="w-full bg-chalk border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Giá (đ)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0"
                    className="w-full bg-chalk border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted mb-1.5">Đơn vị</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="VD: chai, cái, trận"
                    className="w-full bg-chalk border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-chalk border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                >
                  <option value="ACTIVE">Đang bán</option>
                  <option value="INACTIVE">Ngừng bán</option>
                </select>
              </div>
            </div>

            <div className="px-7 py-4 border-t border-line flex items-center justify-end gap-2">
              <button
                onClick={closeModal}
                disabled={saving}
                className="px-5 py-3 rounded-2xl font-semibold text-sm text-ink bg-chalk hover:bg-line transition-colors disabled:opacity-50"
              >
                Huỷ
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-3 rounded-2xl font-semibold text-sm text-white bg-pitch shadow-glow hover:bg-pitch-deep transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {editing ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
