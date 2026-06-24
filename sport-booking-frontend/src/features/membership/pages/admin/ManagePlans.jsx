import React, { useEffect, useState } from 'react';
import { membershipService } from '../../services/membershipService';
import { Plus, Edit, Trash2, Loader2, RefreshCw, Crown } from 'lucide-react';
import { formatPrice } from '../../../../shared/utils/formatDate';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  durationDays: '',
  discountPercent: '',
  benefits: '',
  status: 'ACTIVE',
};

const ManagePlans = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    membershipService.adminList()
      .then((res) => { if (res.data.code === 0) setItems(res.data.result || []); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (plan) => {
    setEditId(plan.id);
    setForm({
      name: plan.name || '',
      description: plan.description || '',
      price: plan.price ?? '',
      durationDays: plan.durationDays ?? '',
      discountPercent: plan.discountPercent ?? '',
      benefits: Array.isArray(plan.benefits) ? plan.benefits.join('\n') : '',
      status: plan.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const onChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      const benefitsStr = form.benefits
        .split('\n')
        .map((b) => b.trim())
        .filter(Boolean)
        .join(' | ');
      const data = {
        name: form.name,
        description: form.description,
        price: Number(form.price) || 0,
        durationDays: Number(form.durationDays) || 0,
        discountPercent: Number(form.discountPercent) || 0,
        benefits: benefitsStr,
        status: form.status,
      };
      const res = editId
        ? await membershipService.adminUpdate(editId, data)
        : await membershipService.adminCreate(data);
      if (res.data.code === 0) {
        setShowModal(false);
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

  const remove = async (plan) => {
    if (!window.confirm(`Xoá gói "${plan.name}"?`)) return;
    try {
      const res = await membershipService.adminDelete(plan.id);
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
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">Quản lý Gói thành viên</h1>
          <p className="text-white/60 text-sm font-medium mt-1">Các gói hội viên &amp; quyền lợi</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all w-fit">
            <RefreshCw size={18} /> Tải lại
          </button>
          <button onClick={openCreate} className="bg-pitch text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-glow hover:bg-pitch-deep transition-all w-fit">
            <Plus size={18} /> Thêm gói
          </button>
        </div>
      </div>

      {/* BẢNG */}
      <div className="bg-white rounded-2xl shadow-card border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-chalk border-b border-line">
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide">Tên gói</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-right">Giá</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Thời hạn</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Giảm giá</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Quyền lợi</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wide text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr><td colSpan={7} className="py-16 text-center"><Loader2 className="animate-spin text-pitch mx-auto" size={28} /></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-muted">Chưa có gói thành viên nào.</td></tr>
              ) : items.map((plan) => (
                <tr key={plan.id} className="hover:bg-chalk transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-500">
                        <Crown size={18} />
                      </span>
                      <div>
                        <p className="font-bold text-ink text-sm">{plan.name}</p>
                        {plan.description && <p className="text-[11px] text-muted line-clamp-1 max-w-[220px]">{plan.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-display font-extrabold text-pitch">{formatPrice(plan.price)}</td>
                  <td className="px-6 py-4 text-center text-sm text-ink">{plan.durationDays} ngày</td>
                  <td className="px-6 py-4 text-center text-sm text-ink">{plan.discountPercent}%</td>
                  <td className="px-6 py-4 text-center text-sm text-muted">{(plan.benefits?.length || 0)} quyền lợi</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${plan.status === 'ACTIVE' ? 'bg-pitch-soft text-pitch' : 'bg-chalk text-muted'}`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(plan)}
                        className="inline-flex items-center gap-1 bg-pitch-soft text-pitch text-xs font-semibold px-3 py-2 rounded-xl hover:bg-pitch hover:text-white transition-colors"
                      >
                        <Edit size={14} /> Sửa
                      </button>
                      <button
                        onClick={() => remove(plan)}
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
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur" onClick={() => !saving && setShowModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-7">
            <h2 className="font-display text-xl font-extrabold text-ink mb-5 flex items-center gap-2">
              <Crown size={20} className="text-amber-500" />
              {editId ? 'Sửa gói thành viên' : 'Thêm gói thành viên'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Tên gói</label>
                <input
                  value={form.name}
                  onChange={onChange('name')}
                  className="w-full bg-chalk border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                  placeholder="VD: Gói Vàng"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={onChange('description')}
                  rows={2}
                  className="w-full bg-chalk border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch resize-none"
                  placeholder="Mô tả ngắn về gói"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Giá (đ)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={onChange('price')}
                    className="w-full bg-chalk border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Thời hạn (ngày)</label>
                  <input
                    type="number"
                    value={form.durationDays}
                    onChange={onChange('durationDays')}
                    className="w-full bg-chalk border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Giảm giá (%)</label>
                  <input
                    type="number"
                    value={form.discountPercent}
                    onChange={onChange('discountPercent')}
                    className="w-full bg-chalk border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Quyền lợi</label>
                <textarea
                  value={form.benefits}
                  onChange={onChange('benefits')}
                  rows={4}
                  className="w-full bg-chalk border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch resize-none"
                  placeholder="Mỗi quyền lợi 1 dòng"
                />
                <p className="text-[11px] text-muted mt-1">Mỗi quyền lợi viết trên một dòng riêng.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={onChange('status')}
                  className="w-full bg-chalk border border-line rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pitch"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="px-5 py-3 rounded-2xl font-semibold text-ink bg-chalk hover:bg-line transition-colors disabled:opacity-50"
              >
                Huỷ
              </button>
              <button
                onClick={save}
                disabled={saving || !form.name.trim()}
                className="bg-pitch text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-glow hover:bg-pitch-deep transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : null}
                {editId ? 'Cập nhật' : 'Tạo gói'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePlans;
