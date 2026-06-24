import React, { useEffect, useState } from 'react';
import { voucherService } from '../../services/voucherService';
import { formatPrice } from '../../../../shared/utils/formatDate';
import { Plus, Edit, Trash2, Loader2, RefreshCw, Tag } from 'lucide-react';

const EMPTY_FORM = {
  code: '',
  description: '',
  discountType: 'PERCENT',
  discountValue: '',
  minOrder: '',
  maxDiscount: '',
  usageLimit: '',
  status: 'ACTIVE',
};

const ManageVouchers = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    voucherService.adminList()
      .then((res) => { if (res.data.code === 0) setItems(res.data.result || []); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (v) => {
    setEditing(v);
    setForm({
      code: v.code || '',
      description: v.description || '',
      discountType: v.discountType || 'PERCENT',
      discountValue: v.discountValue ?? '',
      minOrder: v.minOrder ?? '',
      maxDiscount: v.maxDiscount ?? '',
      usageLimit: v.usageLimit ?? '',
      status: v.status || 'ACTIVE',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: form.code.trim(),
        description: form.description.trim(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue) || 0,
        minOrder: Number(form.minOrder) || 0,
        maxDiscount: Number(form.maxDiscount) || 0,
        usageLimit: Number(form.usageLimit) || 0,
        status: form.status,
      };
      const res = editing
        ? await voucherService.adminUpdate(editing.id, payload)
        : await voucherService.adminCreate(payload);
      if (res.data.code === 0) {
        closeModal();
        load();
      } else {
        alert(res.data.message || 'Lưu voucher thất bại.');
      }
    } catch (err) {
      alert('Lưu voucher thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (v) => {
    if (!window.confirm(`Xoá voucher "${v.code}"?`)) return;
    try {
      const res = await voucherService.adminDelete(v.id);
      if (res.data.code === 0) {
        setItems((prev) => prev.filter((i) => i.id !== v.id));
      } else {
        alert(res.data.message || 'Xoá voucher thất bại.');
      }
    } catch (err) {
      alert('Xoá voucher thất bại.');
    }
  };

  return (
    <div className="animate-fade-up">
      {/* HEADER */}
      <div className="stadium pitch-lines rounded-3xl px-8 py-7 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">Quản lý Voucher</h1>
          <p className="text-white/60 text-sm font-medium mt-1">Mã giảm giá cho khách đặt sân</p>
        </div>
        <div className="flex items-center gap-2 w-fit">
          <button onClick={load} className="bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all">
            <RefreshCw size={18} /> Tải lại
          </button>
          <button onClick={openCreate} className="bg-white text-pitch px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-glow hover:bg-chalk">
            <Plus size={18} /> Thêm voucher
          </button>
        </div>
      </div>

      {/* BẢNG */}
      <div className="bg-white rounded-2xl shadow-card border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-chalk border-b border-line">
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Mã</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Loại giảm</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Đơn tối thiểu</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Lượt dùng</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={6} className="py-16 text-center"><Loader2 className="animate-spin text-pitch mx-auto" size={28} /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-muted">Chưa có voucher nào.</td></tr>
              ) : items.map((v) => (
                <tr key={v.id} className="hover:bg-chalk transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-pitch-soft text-pitch shrink-0">
                        <Tag size={16} />
                      </span>
                      <div>
                        <p className="font-bold text-ink text-sm">{v.code}</p>
                        {v.description && <p className="text-[11px] text-muted">{v.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-display font-extrabold text-pitch">
                    {v.discountType === 'PERCENT' ? `${v.discountValue}%` : formatPrice(v.discountValue)}
                  </td>
                  <td className="px-6 py-4 text-sm text-ink">{formatPrice(v.minOrder)}</td>
                  <td className="px-6 py-4 text-center text-sm text-ink">
                    {v.usedCount ?? 0}/{v.usageLimit || '∞'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${v.status === 'ACTIVE' ? 'bg-pitch-soft text-pitch border-pitch/20' : 'bg-chalk text-muted border-line'}`}>
                      {v.status === 'ACTIVE' ? 'Hoạt động' : 'Tắt'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(v)}
                        className="inline-flex items-center gap-1 bg-pitch text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-glow hover:bg-pitch-deep"
                      >
                        <Edit size={14} /> Sửa
                      </button>
                      <button
                        onClick={() => remove(v)}
                        className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-red-100"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={closeModal}>
          <div className="absolute inset-0 bg-ink/60 backdrop-blur" />
          <form
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-card p-7 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-display text-xl font-extrabold text-ink mb-5">
              {editing ? 'Sửa voucher' : 'Thêm voucher'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Mã voucher</label>
                <input
                  name="code"
                  value={form.code}
                  onChange={onChange}
                  required
                  placeholder="VD: SALE50"
                  className="w-full bg-chalk border border-line rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Mô tả</label>
                <input
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="Mô tả ngắn"
                  className="w-full bg-chalk border border-line rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Loại giảm</label>
                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={onChange}
                    className="w-full bg-chalk border border-line rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                  >
                    <option value="PERCENT">Phần trăm (%)</option>
                    <option value="AMOUNT">Số tiền (đ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Giá trị giảm</label>
                  <input
                    type="number"
                    name="discountValue"
                    value={form.discountValue}
                    onChange={onChange}
                    min="0"
                    className="w-full bg-chalk border border-line rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Đơn tối thiểu</label>
                  <input
                    type="number"
                    name="minOrder"
                    value={form.minOrder}
                    onChange={onChange}
                    min="0"
                    className="w-full bg-chalk border border-line rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Giảm tối đa</label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={form.maxDiscount}
                    onChange={onChange}
                    min="0"
                    className="w-full bg-chalk border border-line rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Giới hạn lượt</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={form.usageLimit}
                    onChange={onChange}
                    min="0"
                    className="w-full bg-chalk border border-line rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Trạng thái</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={onChange}
                    className="w-full bg-chalk border border-line rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Tắt</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-7">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="px-5 py-2.5 rounded-2xl font-semibold text-ink border border-line hover:bg-chalk transition-all disabled:opacity-50"
              >
                Huỷ
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-pitch text-white px-6 py-2.5 rounded-2xl font-semibold shadow-glow hover:bg-pitch-deep transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : null} Lưu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageVouchers;
