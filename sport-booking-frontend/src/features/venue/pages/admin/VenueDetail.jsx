import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { venueService } from '../../services/venueService';
import { 
  ChevronLeft, LayoutGrid, Image as ImageIcon, 
  Info, Calendar, MapPin, Clock, Plus , Globe
} from 'lucide-react';
import VenueFieldList from '../../components/admin/VenueFieldList'; // Component mới
import VenueImagesSection from '../../components/admin/VenueImagesSection'; // Tái cấu trúc từ modal

const VenueDetail = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [activeTab, setActiveTab] = useState('fields');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVenueData();
  }, [venueId]);

  const fetchVenueData = async () => {
    setLoading(true);
    try {
      const res = await venueService.getVenueById(venueId);
      if (res.data.code === 0) setVenue(res.data.result);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-400 animate-pulse">Đang tải workspace...</div>;
  if (!venue) return <div className="p-10 text-center">Không tìm thấy dữ liệu cơ sở.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER: Breadcrumb & Summary */}
      <div className="flex items-center gap-4 text-slate-400 mb-2">
        <button onClick={() => navigate('/admin/venues')} className="hover:text-indigo-600 flex items-center gap-1 transition-colors">
          <ChevronLeft size={18} /> Quay lại danh sách
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-start">
        <div className="w-24 h-24 shrink-0 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-md">
          <img src={venue.thumbnailUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-black text-slate-800 tracking-tight">{venue.name}</h1>
             <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">{venue.status}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500 italic">
            <span className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-500" /> {venue.address}</span>
            <span className="flex items-center gap-1.5"><Globe size={16} className="text-indigo-500" /> {venue.areaName}</span>
            <span className="flex items-center gap-1.5"><Clock size={16} className="text-indigo-500" /> {venue.openTime?.slice(0,5)} - {venue.closeTime?.slice(0,5)}</span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-2 p-1.5 bg-slate-100/50 w-fit rounded-2xl border border-slate-100">
        <TabBtn active={activeTab === 'fields'} icon={<LayoutGrid size={18}/>} label="Quản lý Sân" onClick={() => setActiveTab('fields')} />
        <TabBtn active={activeTab === 'images'} icon={<ImageIcon size={18}/>} label="Hình ảnh" onClick={() => setActiveTab('images')} />
        <TabBtn active={activeTab === 'info'} icon={<Info size={18}/>} label="Thông tin & Thống kê" onClick={() => setActiveTab('info')} />
      </div>

      {/* TAB CONTENT */}
      <div className="transition-all">
        {activeTab === 'fields' && <VenueFieldList venueId={venueId} venueName={venue.name}  initialFields={venue.fields} onRefresh={fetchVenueData} />}
        {activeTab === 'images' && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <VenueImagesSection venueId={venueId} venueName={venue.name} onRefresh={fetchVenueData} />
          </div>
        )}
        {activeTab === 'info' && <div className="p-10 text-slate-400 italic">Chức năng thống kê đang được phát triển...</div>}
      </div>
    </div>
  );
};

const TabBtn = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon} {label}
  </button>
);

export default VenueDetail;