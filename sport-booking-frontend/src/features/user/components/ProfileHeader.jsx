import React from 'react';
import { Camera, Wallet, ShieldCheck, Mail, Phone } from 'lucide-react';

const ProfileHeader = ({ user }) => {
  return (
    <div className="relative mb-24 animate-fade-up">
      {/* Cover — sân vận động về đêm */}
      <div className="stadium pitch-lines h-48 w-full rounded-b-4xl shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pitch/20 rounded-full -ml-20 -mb-20 blur-2xl"></div>
      </div>

      {/* Profile Info Overlay */}
      <div className="absolute -bottom-20 left-0 right-0 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-end md:items-center gap-6 bg-white p-6 rounded-3xl shadow-card-hover border border-line">
          {/* Avatar */}
          <div className="relative group shrink-0 mx-auto md:mx-0">
            <div className="w-28 h-28 rounded-3xl border-4 border-white shadow-glow overflow-hidden bg-pitch-soft">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display text-3xl font-extrabold text-pitch">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-pitch text-white rounded-xl shadow-glow hover:bg-pitch-deep active:scale-95 transition-all">
              <Camera size={18} />
            </button>
          </div>

          {/* Identity */}
          <div className="flex-1 text-center md:text-left space-y-1.5">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink flex items-center justify-center md:justify-start gap-2">
              {user?.name}
              <ShieldCheck size={20} className="text-pitch" />
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-sm font-medium text-muted">
              <span className="flex items-center gap-1.5"><Mail size={14} /> {user?.email}</span>
              {user?.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {user.phone}</span>}
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-ink p-5 rounded-2xl shadow-card border border-ink-soft min-w-[180px]">
            <div className="flex items-center gap-2 text-white/60 mb-1">
              <Wallet size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Số dư ví</span>
            </div>
            <div className="font-display text-2xl font-extrabold text-white tracking-tight">
              {user?.coinBalance?.toLocaleString() || 0}
              <small className="text-[10px] ml-1.5 text-lime font-bold uppercase">Coin</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
