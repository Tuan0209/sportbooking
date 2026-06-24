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

  if (loading) return <div className="p-10 text-center font-semibold text-muted animate-pulse">Đang tải dữ liệu...</div>;
  if (!venue) return <div className="p-10 text-center text-muted">Không tìm thấy dữ liệu cơ sở.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER: Breadcrumb & Summary */}
      <div className="flex items-center gap-4 text-muted mb-2">
        <button onClick={() => navigate('/admin/venues')} className="hover:text-pitch flex items-center gap-1 transition-colors font-medium">
          <ChevronLeft size={18} /> Quay lại danh sách
        </button>
      </div>

      <div className="stadium pitch-lines rounded-3xl p-8 shadow-card flex flex-col md:flex-row gap-8 items-start">
        <div className="w-24 h-24 shrink-0 rounded-3xl overflow-hidden border border-white/15 shadow-card">
          <img src={venue.thumbnailUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
             <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">{venue.name}</h1>
             <span className="px-3 py-1 bg-lime/15 text-lime rounded-full text-[11px] font-semibold uppercase tracking-wide border border-lime/25">{venue.status}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-white/70">
            <span className="flex items-center gap-1.5"><MapPin size={16} className="text-lime" /> {venue.address}</span>
            <span className="flex items-center gap-1.5"><Globe size={16} className="text-lime" /> {venue.areaName}</span>
            <span className="flex items-center gap-1.5"><Clock size={16} className="text-lime" /> {venue.openTime?.slice(0,5)} - {venue.closeTime?.slice(0,5)}</span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-2 p-1.5 bg-chalk w-fit rounded-2xl border border-line">
        <TabBtn active={activeTab === 'fields'} icon={<LayoutGrid size={18}/>} label="Quản lý Sân" onClick={() => setActiveTab('fields')} />
        <TabBtn active={activeTab === 'images'} icon={<ImageIcon size={18}/>} label="Hình ảnh" onClick={() => setActiveTab('images')} />
        <TabBtn active={activeTab === 'info'} icon={<Info size={18}/>} label="Thông tin & Thống kê" onClick={() => setActiveTab('info')} />
      </div>

      {/* TAB CONTENT */}
      <div className="transition-all">
        {activeTab === 'fields' && <VenueFieldList venueId={venueId} venueName={venue.name}  initialFields={venue.fields} onRefresh={fetchVenueData} />}
        {activeTab === 'images' && (
          <div className="bg-white p-8 rounded-2xl border border-line shadow-card">
             <VenueImagesSection venueId={venueId} venueName={venue.name} onRefresh={fetchVenueData} />
          </div>
        )}
        {activeTab === 'info' && <div className="p-10 text-muted">Chức năng thống kê đang được phát triển...</div>}
      </div>
    </div>
  );
};

const TabBtn = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${active ? 'bg-white text-pitch shadow-card' : 'text-muted hover:text-ink'}`}>
    {icon} {label}
  </button>
);

export default VenueDetail;