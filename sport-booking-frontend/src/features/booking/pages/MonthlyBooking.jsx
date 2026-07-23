import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CalendarCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { fieldService } from '../../field/services/fieldService';
import { bookingService } from '../services/bookingService';
import { formatPrice } from '../../../shared/utils/formatDate';
import { AuthContext } from '../../../context/AuthContext';

// ISO: 1=Thứ 2 ... 7=Chủ nhật
const DOW = [
  { v: 1, l: 'T2' }, { v: 2, l: 'T3' }, { v: 3, l: 'T4' }, { v: 4, l: 'T5' },
  { v: 5, l: 'T6' }, { v: 6, l: 'T7' }, { v: 7, l: 'CN' },
];

const buildMonthOptions = () => {
  const now = new Date();
  const opts = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    opts.push({ month: d.getMonth() + 1, year: d.getFullYear(), label: `Tháng ${d.getMonth() + 1}/${d.getFullYear()}` });
  }
  return opts;
};

const slotsOfField = (field) => {
  if (!field) return [];
  const interval = field.slotInterval || 60;
  const [oh, om] = (field.openTime || '06:00:00').split(':').map(Number);
  const [ch, cm] = (field.closeTime || '22:00:00').split(':').map(Number);
  const out = [];
  for (let m = oh * 60 + om; m + interval <= ch * 60 + cm; m += interval) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  }
  return out;
};

const MonthlyBooking = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [venue, setVenue] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const [fieldId, setFieldId] = useState('');
  const [slots, setSlots] = useState([]); // ["19:00"]
  const [days, setDays] = useState([]);   // [1,3,5]
  const monthOptions = useMemo(buildMonthOptions, []);
  const [monthIdx, setMonthIdx] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  useEffect(() => {
    fieldService.getFieldsByVenue(venueId).then((res) => {
      if (res.data.code === 0 && res.data.result) {
        setVenue(res.data.result);
        const fs = res.data.result.fields || [];
        setFields(fs);
        if (fs[0]) setFieldId(fs[0].id);
      }
    }).finally(() => setLoading(false));
  }, [venueId]);

  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
    }
  }, [user]);

  const field = fields.find((f) => f.id === fieldId);
  const timeSlots = useMemo(() => slotsOfField(field), [field]);
  const slotPrice = field ? Number(field.pricePerHour) * ((field.slotInterval || 60) / 60) : 0;
  const pricePerDay = slots.length * slotPrice;

  // Đếm số buổi sẽ tạo (client-side preview)
  const previewCount = useMemo(() => {
    if (!days.length) return 0;
    const { month, year } = monthOptions[monthIdx];
    const last = new Date(year, month, 0).getDate();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let c = 0;
    for (let d = 1; d <= last; d++) {
      const date = new Date(year, month - 1, d);
      const iso = date.getDay() === 0 ? 7 : date.getDay();
      if (date >= today && days.includes(iso)) c++;
    }
    return c;
  }, [days, monthIdx, monthOptions]);

  const toggle = (arr, setArr, v) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const canSubmit = fieldId && slots.length > 0 && days.length > 0 && customerName && customerPhone && previewCount > 0;

  const handleSubmit = async () => {
  if (!canSubmit) return;
  setSubmitting(true);

  try {

    const { month, year } = monthOptions[monthIdx];

    const res = await bookingService.createMonthly({
      fieldId,
      slots,
      daysOfWeek: days,
      month,
      year,
      customerName,
      customerPhone,
      pricePerDay,
      paymentMethod: 'PAYOS',
    });

    if (res.data.code === 0) {

      const result = res.data.result;

      if (result.paymentId) {
        navigate(`/payment/${result.paymentId}`);
        return;
      }

      setResult(result);

    }

  } catch (e) {

    alert('Tạo vé tháng thất bại, vui lòng thử lại.');

  } finally {

    setSubmitting(false);

  }
};

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-chalk"><Loader2 className="animate-spin text-pitch" size={34} /></div>;
  }

  return (
    <div className="min-h-screen bg-chalk pb-32">
      {/* HEADER */}
      <div className="stadium pitch-lines text-white">
        <div className="h-14 px-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition">
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-[18px] font-display font-bold tracking-tight">Đặt vé tháng</h1>
            <p className="text-[11px] text-white/70">{venue?.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-5">
        {/* CHỌN SÂN */}
        <Section title="Chọn sân">
          <div className="flex flex-wrap gap-2">
            {fields.map((f) => (
              <button
                key={f.id}
                onClick={() => { setFieldId(f.id); setSlots([]); }}
                className={`px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${fieldId === f.id ? 'bg-pitch text-white border-pitch shadow-glow' : 'bg-white text-ink border-line hover:border-pitch'}`}
              >
                {f.name}
                <span className="block text-[10px] font-medium opacity-70">{formatPrice(Number(f.pricePerHour))}/giờ</span>
              </button>
            ))}
          </div>
        </Section>

        {/* CHỌN KHUNG GIỜ */}
        <Section title="Khung giờ (chọn 1 hoặc nhiều)">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {timeSlots.map((t) => (
              <button
                key={t}
                onClick={() => toggle(slots, setSlots, t)}
                className={`py-2 rounded-xl text-[13px] font-semibold border transition-all ${slots.includes(t) ? 'bg-pitch text-white border-pitch shadow-glow' : 'bg-white text-ink border-line hover:border-pitch'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </Section>

        {/* CHỌN THỨ */}
        <Section title="Các thứ trong tuần">
          <div className="flex gap-2">
            {DOW.map((d) => (
              <button
                key={d.v}
                onClick={() => toggle(days, setDays, d.v)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${days.includes(d.v) ? 'bg-pitch text-white border-pitch shadow-glow' : 'bg-white text-ink border-line hover:border-pitch'}`}
              >
                {d.l}
              </button>
            ))}
          </div>
        </Section>

        {/* CHỌN THÁNG */}
        <Section title="Tháng áp dụng">
          <div className="flex gap-2">
            {monthOptions.map((m, i) => (
              <button
                key={i}
                onClick={() => setMonthIdx(i)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${monthIdx === i ? 'bg-pitch text-white border-pitch shadow-glow' : 'bg-white text-ink border-line hover:border-pitch'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </Section>

        {/* THÔNG TIN LIÊN HỆ */}
        <Section title="Thông tin liên hệ">
          <div className="space-y-3">
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Họ và tên"
              className="w-full px-4 py-3 bg-white border border-line rounded-xl text-sm text-ink focus:outline-none focus:border-pitch focus:ring-2 focus:ring-pitch/20"
            />
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Số điện thoại"
              className="w-full px-4 py-3 bg-white border border-line rounded-xl text-sm text-ink focus:outline-none focus:border-pitch focus:ring-2 focus:ring-pitch/20"
            />
          </div>
        </Section>

        {/* TÓM TẮT */}
        <div className="bg-white border border-line rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Số buổi dự kiến</span>
            <span className="font-bold text-ink">{previewCount} buổi</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted">Giá mỗi buổi</span>
            <span className="font-bold text-ink">{formatPrice(pricePerDay)}</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
            <span className="font-semibold text-ink">Tạm tính cả tháng</span>
            <span className="font-display text-xl font-extrabold text-pitch">{formatPrice(pricePerDay * previewCount)}</span>
          </div>
        </div>
      </div>

      {/* THANH ĐÁY */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-line px-4 py-3 shadow-[0_-10px_30px_rgba(6,35,26,0.08)]">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={`w-full h-12 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${canSubmit && !submitting ? 'bg-pitch text-white shadow-glow hover:bg-pitch-deep' : 'bg-chalk text-muted border border-line'}`}
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <CalendarCheck size={18} />}
            {submitting ? 'Đang tạo...' : `Đặt vé tháng (${previewCount} buổi)`}
          </button>
        </div>
      </div>

      {/* KẾT QUẢ */}
      {result && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setResult(null)} />
          <div className="bg-white w-full max-w-sm rounded-4xl shadow-card-hover relative overflow-hidden animate-fade-up">
            <div className="p-7 text-center">
              <div className="w-16 h-16 rounded-full bg-pitch-soft flex items-center justify-center text-pitch mx-auto mb-4">
                <CheckCircle2 size={34} />
              </div>
              <h3 className="font-display text-xl font-extrabold text-ink">Đặt vé tháng thành công</h3>
              <p className="text-muted text-sm mt-2">
                Đã tạo <span className="font-bold text-ink">{result.createdCount}</span> buổi · Tổng{' '}
                <span className="font-bold text-pitch">{formatPrice(result.totalPrice)}</span>
              </p>
              {result.skippedDates?.length > 0 && (
                <p className="text-amber-600 text-xs mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  {result.skippedDates.length} ngày bị bỏ qua do trùng lịch.
                </p>
              )}
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 border-t border-line bg-chalk">
              <button onClick={() => setResult(null)} className="py-3 text-sm font-bold text-muted rounded-2xl border border-line bg-white">Đặt tiếp</button>
              <button onClick={() => navigate('/dashboard')} className="py-3 bg-pitch text-white rounded-2xl font-semibold shadow-glow hover:bg-pitch-deep transition">Về trang chủ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white border border-line rounded-2xl shadow-card p-5">
    <h2 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-3">{title}</h2>
    {children}
  </div>
);

export default MonthlyBooking;
