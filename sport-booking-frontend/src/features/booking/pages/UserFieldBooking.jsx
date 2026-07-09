
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Loader2,
  SlidersHorizontal
} from 'lucide-react';

import { fieldService } from '../../field/services/fieldService';
import { bookingService } from '../services/bookingService';
import { formatPrice } from '../../../shared/utils/formatDate';
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
const UserFieldBooking = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [fields, setFields] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [bookedSet, setBookedSet] = useState(new Set());
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()));

  const [loading, setLoading] = useState(true);
  const [zoomScale, setZoomScale] = useState(90);
  const timelineRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [tempDate, setTempDate] = useState(selectedDate);

  useEffect(() => {
    fetchData();
  }, [venueId, selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fieldService.getFieldsByVenue(venueId);
      if (res.data.code === 0 && res.data.result) {
        setVenue(res.data.result);
        setFields(res.data.result.fields || []);
      }
      // Lấy các khung giờ đã được đặt trong ngày để tô màu "Đã đặt"
      try {
        const booked = await bookingService.getBookedSlots(venueId, selectedDate);
        if (booked.data.code === 0) {
          setBookedSet(new Set((booked.data.result || []).map((b) => `${b.fieldId}|${b.startTime}`)));
        }
      } catch (err) {
        setBookedSet(new Set());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < offset; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    return days;
  }, [currentMonth]);

  const timeLabels = useMemo(() => {
    if (!venue) return [];
    const openH = parseInt(venue.openTime?.split(':')[0]) || 6;
    const closeH = parseInt(venue.closeTime?.split(':')[0]) || 23;
    const times = [];
    for (let m = openH * 60; m < closeH * 60; m += 30) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      times.push(`${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
    }
    return times;
  }, [venue]);

  const getSlotPrice = (field, time) => {
    const dayOfWeek = new Date(selectedDate).getDay();
    const activeSlot = field.priceSlots?.find((ps) => {
      const isDayMatch = ps.dayOfWeek === null || ps.dayOfWeek === dayOfWeek;
      const isTimeMatch = time >= ps.startTime.slice(0, 5) && time < ps.endTime.slice(0, 5);
      return isDayMatch && isTimeMatch;
    });
    const basePrice = activeSlot ? activeSlot.price : field.pricePerHour;
    return basePrice * ((field.slotInterval || 60) / 60);
  };

  const getSlotPriceDisplay = (field, time) => `${Math.floor(getSlotPrice(field, time) / 1000)}K`;

  const toggleSlot = (fieldId, time) => {
    const key = `${fieldId}|${time}`;
    setSelectedSlots((prev) => {
      const current = { ...prev };
      const activeKeys = Object.keys(current).filter((k) => current[k]);
      if (activeKeys.length > 0 && !activeKeys[0].startsWith(fieldId)) return { [key]: true };
      if (current[key]) delete current[key]; else current[key] = true;
      return current;
    });
  };

  const summary = useMemo(() => {
    const keys = Object.keys(selectedSlots);
    if (keys.length === 0) return null;

    const parsed = keys.map((key) => {
      const [fieldId, time] = key.split('|');
      return { fieldId, time };
    });

    const field = fields.find((f) => f.id === parsed[0].fieldId);
    if (!field) return null;

    const slotMinutes = field.slotInterval || 60;
    const sortedTimes = parsed.map((p) => p.time).sort();
    const ranges = [];
    let currentStart = sortedTimes[0];
    let currentEnd = sortedTimes[0];

    for (let i = 1; i < sortedTimes.length; i++) {
      const prev = sortedTimes[i - 1];
      const current = sortedTimes[i];
      const [ph, pm] = prev.split(':').map(Number);
      const [ch, cm] = current.split(':').map(Number);
      const prevMinutes = ph * 60 + pm;
      const currentMinutes = ch * 60 + cm;

      if (currentMinutes === prevMinutes + slotMinutes) {
        currentEnd = current;
      } else {
        const [eh, em] = currentEnd.split(':').map(Number);
        const endMinutes = eh * 60 + em + slotMinutes;
        ranges.push({
          start: currentStart,
          end: `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`
        });
        currentStart = current;
        currentEnd = current;
      }
    }

    const [eh, em] = currentEnd.split(':').map(Number);
    const endMinutes = eh * 60 + em + slotMinutes;
    ranges.push({
      start: currentStart,
      end: `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`
    });

    const totalPrice = sortedTimes.reduce((sum, t) => sum + getSlotPrice(field, t), 0);

    return {
      fieldId: field.id,
      fieldName: field.name,
      fieldTypeName: field.fieldTypeName,
      slots: sortedTimes,
      ranges,
      totalPrice,
      slotCount: sortedTimes.length,
      totalMinutes: sortedTimes.length * slotMinutes,
      startTime: ranges[0]?.start,
      endTime: ranges[ranges.length - 1]?.end
    };
  }, [selectedSlots, fields, selectedDate]);

  const selectionCount = summary?.slotCount || 0;

  const todayStr = formatLocalDate(new Date());
  const nowMinutes = (() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  })();

  const handleMouseDown = (e) => {
    if (!timelineRef.current) return;

    isDragging.current = true;
    startX.current = e.pageX - timelineRef.current.offsetLeft;
    scrollLeft.current = timelineRef.current.scrollLeft;
    timelineRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (timelineRef.current) {
      timelineRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (timelineRef.current) {
      timelineRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !timelineRef.current) return;
    e.preventDefault();

    const x = e.pageX - timelineRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    timelineRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleContinue = () => {
    if (!summary) return;
    const field = fields.find((f) => f.id === summary.fieldId);
    if (!field) return;

    navigate('/booking-confirm', {
      state: {
        venueName: venue?.name,
        venueAddress: venue?.address,
        venueLat: venue?.latitude,
        venueLng: venue?.longitude,
        fieldId: field.id,
        fieldName: field.name,
        fieldTypeName: field.fieldTypeName,
        bookingDate: selectedDate,
        slots: summary.slots,
        ranges: summary.ranges,
        totalPrice: summary.totalPrice,
        totalMinutes: summary.totalMinutes
      }
    });
  };

  return (
    <div className="h-screen flex flex-col bg-chalk overflow-hidden">
      <div className="stadium pitch-lines text-white shadow-card z-50">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition">
              <ChevronLeft size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="text-[18px] font-display font-bold tracking-tight truncate">{venue?.name || 'Đặt lịch'}</h1>
              <p className="text-[11px] text-white/70">Chọn khung giờ phù hợp</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate(`/monthly/${venueId}`)}
              className="bg-white/15 hover:bg-white/25 text-white rounded-2xl px-3 py-2 text-sm font-semibold transition-all active:scale-95 whitespace-nowrap"
            >
              Vé tháng
            </button>
            <div
              onClick={() => { setTempDate(selectedDate); setIsCalendarOpen(true); }}
              className="relative bg-white text-pitch rounded-2xl px-3 py-2 flex items-center gap-2 text-sm font-semibold shadow-card cursor-pointer active:scale-95 transition-all"
            >
              <CalendarIcon size={16} />
              {new Date(selectedDate).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-white border border-line"></div> Trống
          </div>
          <div className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-pitch"></div> Đang chọn
          </div>
          <div className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-line border border-white/30"></div> Không khả dụng
          </div>
          <div className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-amber"></div> Đã đặt
          </div>
        </div>
      </div>

      <div
        ref={timelineRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="flex-1 overflow-x-auto overflow-y-auto bg-chalk relative cursor-grab select-none scrollbar-thin"
      >
        {loading ? (
          <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-pitch" size={34} /></div>
        ) : (
          <div className="pb-40" style={{ width: `${timeLabels.length * zoomScale + 120}px` }}>
            <div className="flex sticky top-0 z-40 bg-white border-b border-line w-max">
              <div className="w-24 shrink-0 bg-white border-r border-line"></div>
              {timeLabels.map((time) => (
                <div key={time} style={{ width: `${zoomScale}px` }} className="shrink-0 h-10 border-r border-line flex items-center justify-center bg-white">
                  <span className="text-[10px] font-semibold text-muted">{time}</span>
                </div>
              ))}
            </div>
            {fields.map((field) => (
              <div key={field.id} className="flex h-[72px] border-b border-line bg-chalk">
                <div className="w-24 shrink-0 sticky left-0 z-30 bg-white border-r border-line px-2 flex flex-col justify-center text-center">
                  <span className="text-[13px] font-semibold text-ink truncate">{field.name}</span>
                  <span className="text-[10px] text-muted mt-1">{field.slotInterval} phút</span>
                </div>
                <div className="flex p-1 gap-1">
                  {timeLabels.map((time) => {
                    const totalMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
                    const isStep = totalMinutes % (field.slotInterval || 60) === 0;
                    if (!isStep) return null;
                    const width = ((field.slotInterval || 60) / 30) * zoomScale;
                    const isSelected = selectedSlots[`${field.id}|${time}`];
                    const isClosed = time < field.openTime?.slice(0, 5) || time >= field.closeTime?.slice(0, 5);
                    const isBooked = bookedSet.has(`${field.id}|${time}`);
                    const isPast = selectedDate < todayStr || (selectedDate === todayStr && totalMinutes <= nowMinutes);
                    const isNotAvailable = field.status !== 'ACTIVE' || isClosed || isBooked || isPast;
                    return (
                      <div
                        key={time}
                        onClick={() => !isNotAvailable && toggleSlot(field.id, time)}
                        style={{ width: `${width - 4}px` }}
                        className={`h-[64px] shrink-0 rounded-xl border relative transition-all duration-150 flex items-center justify-center ${isBooked ? 'bg-amber-50 border-amber-200 text-amber-600 cursor-not-allowed' : isNotAvailable ? 'bg-chalk border-line text-muted line-through cursor-not-allowed' : isSelected ? 'bg-pitch border-pitch text-white shadow-glow' : 'bg-white border-line text-ink hover:border-pitch hover:bg-pitch-soft cursor-pointer'}`}>
                        {isSelected ? (
                          <span className="text-white text-[11px] font-bold">{getSlotPriceDisplay(field, time)}</span>
                        ) : isBooked ? (
                          <span className="text-[9px] font-bold uppercase tracking-wide">Đã đặt</span>
                        ) : !isNotAvailable ? (
                          <span className="text-[10px] font-medium text-muted">{getSlotPriceDisplay(field, time)}</span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isCalendarOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCalendarOpen(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-4xl shadow-card-hover relative overflow-hidden">
            <div className="p-6 border-b border-line flex items-center justify-between">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 hover:bg-chalk rounded-full text-ink"><ChevronLeft size={20} /></button>
              <h3 className="text-sm font-display font-bold text-ink uppercase tracking-widest">
                tháng {currentMonth.getMonth() + 1} năm {currentMonth.getFullYear()}
              </h3>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 hover:bg-chalk rounded-full text-ink"><ChevronRight size={20} /></button>
            </div>
            <div className="p-4 text-center">
              <div className="grid grid-cols-7 mb-2">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
                  <div key={d} className="text-[10px] font-bold text-muted py-2 uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, idx) => {
                  if (!date) return <div key={idx} />;
                  const ds = formatLocalDate(date);
                  const isSel = ds === tempDate;
                  return (
                    <button
                      key={idx}
                      onClick={() => setTempDate(ds)}
                      className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all ${isSel ? 'bg-pitch text-white shadow-glow' : 'text-ink-soft hover:bg-pitch-soft'}`}>
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 border-t border-line bg-chalk">
              <button onClick={() => setIsCalendarOpen(false)} className="py-3 text-sm font-bold text-muted rounded-2xl border border-line bg-white">Hủy</button>
              <button onClick={() => { setSelectedDate(tempDate); setIsCalendarOpen(false); }} className="py-3 bg-pitch text-white rounded-2xl font-semibold shadow-glow hover:bg-pitch-deep transition">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed right-4 bottom-28 bg-white border border-line rounded-2xl shadow-card p-4 z-50 w-52">
        <div className="flex items-center gap-2 mb-3"><SlidersHorizontal size={15} className="text-muted" /><span className="text-xs font-medium text-muted">Zoom timeline</span></div>
        <input type="range" min="60" max="180" value={zoomScale} onChange={(e) => setZoomScale(Number(e.target.value))} className="w-full accent-pitch" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-line px-4 py-3 shadow-[0_-10px_30px_rgba(6,35,26,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] text-muted font-medium">Đã chọn</p>
            {summary ? (
              <>
                <p className="text-[15px] font-display font-bold text-ink truncate">{summary.startTime} - {summary.endTime}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[12px] text-muted">{summary.fieldName}</span>
                  <span className="w-1 h-1 rounded-full bg-line"></span>
                  <span className="text-[12px] text-muted">{Math.floor(summary.totalMinutes / 60)}h{summary.totalMinutes % 60 > 0 ? `${summary.totalMinutes % 60}p` : ''}</span>
                  <span className="w-1 h-1 rounded-full bg-line"></span>
                  <span className="text-[14px] font-display font-extrabold text-pitch">{formatPrice(summary.totalPrice)}</span>
                </div>
              </>
            ) : (
              <p className="text-sm font-medium text-muted">Chưa chọn khung giờ</p>
            )}
          </div>
          <button onClick={handleContinue} disabled={selectionCount === 0} className={`h-12 px-6 rounded-2xl text-sm font-semibold transition-all shrink-0 ${selectionCount > 0 ? 'bg-pitch text-white shadow-glow hover:bg-pitch-deep' : 'bg-chalk text-muted border border-line'}`}>Tiếp tục</button>
        </div>
      </div>
    </div>
  );
};

export default UserFieldBooking;