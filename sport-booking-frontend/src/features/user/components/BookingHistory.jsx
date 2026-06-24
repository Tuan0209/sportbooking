import React from 'react';
import { CalendarX2, MapPin, Clock3 } from 'lucide-react';

const STATUS_STYLE = {
  PENDING: {
    label: 'Chờ xác nhận',
    className: 'bg-amber/15 text-amber',
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    className: 'bg-pitch-soft text-pitch',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    className: 'bg-pitch-soft text-pitch',
  },
  CANCELLED: {
    label: 'Đã huỷ',
    className: 'bg-red-50 text-red-600',
  },
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLE[status] || {
    label: status || 'Không rõ',
    className: 'bg-line text-muted',
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${style.className}`}
    >
      {style.label}
    </span>
  );
};

const BookingHistory = ({ bookings }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-line shadow-card p-14 flex flex-col items-center justify-center text-center animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-pitch-soft flex items-center justify-center text-pitch mb-5">
          <CalendarX2 size={40} />
        </div>

        <h3 className="font-display text-xl font-extrabold tracking-tight text-ink">
          Chưa có lịch sử đặt sân
        </h3>

        <p className="text-muted mt-2 max-w-sm leading-relaxed">
          Bạn chưa đặt sân nào. Khám phá và đặt sân để xem lịch sử tại đây nhé!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-up">
      {bookings.map((booking, index) => (
        <div
          key={booking?.id ?? index}
          className="bg-white rounded-2xl border border-line shadow-card p-5 hover:shadow-card-hover transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-ink truncate">
                {booking?.fieldName || 'Sân bóng'}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <Clock3 size={14} />
                  {booking?.time || '--:--'} • {booking?.date || '--/--/----'}
                </span>

                {booking?.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {booking.location}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="font-display text-xl font-extrabold text-pitch">
                {booking?.price ?? 0}
              </p>

              <div className="mt-2">
                <StatusBadge status={booking?.status} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingHistory;
