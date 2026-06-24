import React from 'react';
import { CalendarCheck, Wallet, Heart, Star } from 'lucide-react';

const ProfileStats = ({ stats }) => {
  const items = [
    {
      icon: <CalendarCheck size={22} />,
      label: 'Trận đã đặt',
      value: stats?.totalBookings ?? 0,
    },
    {
      icon: <Wallet size={22} />,
      label: 'Đã chi tiêu',
      value: stats?.totalSpent ?? 0,
    },
    {
      icon: <Heart size={22} />,
      label: 'Sân yêu thích',
      value: stats?.favorites ?? 0,
    },
    {
      icon: <Star size={22} />,
      label: 'Đánh giá',
      value: stats?.rating ?? '0.0',
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 animate-fade-up">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-line shadow-card p-5 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-pitch-soft flex items-center justify-center text-pitch mb-4">
            {item.icon}
          </div>

          <p className="text-muted text-xs font-semibold uppercase tracking-wide">
            {item.label}
          </p>

          <h3 className="font-display text-2xl font-extrabold text-ink mt-1">
            {item.value}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
