import React from 'react';
import { Camera, Wallet, ShieldCheck, Mail, Phone } from 'lucide-react';

const ProfileHeader = ({ user }) => {
  return (
    <div className="relative mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Background Hero Gradient */}
      <div className="h-48 w-full bg-gradient-to-br from-[#f3a638] to-[#f7b733] rounded-b-[3rem] shadow-lg shadow-orange-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-20 -mb-20 blur-2xl"></div>
      </div>

      {/* Profile Info Overlay */}
      <div className="absolute -bottom-16 left-0 right-0 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-end md:items-center gap-6 bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-xl border border-white/50">
          {/* Avatar */}
          <div className="relative group shrink-0 mx-auto md:mx-0">
            <div className="w-28 h-28 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden bg-slate-100">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-indigo-300">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all">
              <Camera size={18} />
            </button>
          </div>

          {/* Identity */}
          <div className="flex-1 text-center md:text-left space-y-1">
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center justify-center md:justify-start gap-2">
              {user?.name}
              <ShieldCheck size={20} className="text-blue-500 fill-blue-50" />
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest italic">
              <span className="flex items-center gap-1.5"><Mail size={14} /> {user?.email}</span>
              {user?.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {user.phone}</span>}
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-tr from-slate-900 to-slate-800 p-5 rounded-3xl shadow-xl shadow-slate-200 border border-slate-700 min-w-[180px]">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Wallet size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Số dư ví</span>
            </div>
            <div className="text-2xl font-black text-white tracking-tighter">
              {user?.coinBalance?.toLocaleString() || 0}
              <small className="text-[10px] ml-1.5 text-yellow-400 font-bold uppercase not-italic">Coin</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;