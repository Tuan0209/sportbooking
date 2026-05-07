import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { venueService } from '../../services/venueService';
import { fieldService } from '../../../field/services/fieldService';
import { 
  Plus, Edit, Trash2, Search, MapPin, 
  Clock, Globe, Image as ImageIcon, LayoutGrid,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Activity
} from 'lucide-react';
import Modal from '../../../../shared/components/Modal';
import Input from '../../../../shared/components/Input';
import Button from '../../../../shared/components/Button';
import VenueMapPicker from '../../components/admin/VenueMapPicker';
import VenueImagesModal from '../../components/admin/VenueImagesModal';

const getStatusStyles = (status) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
    case 'INACTIVE': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'MAINTENANCE': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const ManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '', address: '', areaId: '', openTime: '06:00:00', closeTime: '22:00:00', 
    latitude: 0, longitude: 0, status: 'ACTIVE'
  });

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    let result = [...venues];
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(v => v.name.toLowerCase().includes(search) || v.address.toLowerCase().includes(search));
    }
    if (filterArea) result = result.filter(v => v.areaId === filterArea);
    if (filterStatus) result = result.filter(v => v.status === filterStatus);
    
    setFilteredVenues(result);
    setCurrentPage(1);
  }, [searchTerm, filterArea, filterStatus, venues]);

  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVenues.slice(indexOfFirstItem, indexOfLastItem);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resV, resA] = await Promise.all([venueService.getAllVenues(), fieldService.getAllAreas()]);
      if (resV.data.code === 0) setVenues(resV.data.result);
      if (resA.data.code === 0) setAreas(resA.data.result);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleOpenModal = (venue = null) => {
    setSelectedVenue(venue);
    setFormData(venue ? { 
      ...venue,
      areaId: venue.areaId // Đảm bảo areaId được map đúng
    } : { 
      name: '', address: '', areaId: '', openTime: '06:00:00', closeTime: '22:00:00', 
      latitude: 0, longitude: 0, status: 'ACTIVE' 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedVenue) await venueService.updateVenue(selectedVenue.id, formData);
      else await venueService.createVenue(formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err) { alert("Lỗi khi lưu dữ liệu!"); }
  };

  return (
    <div className="space-y-6 p-2 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic underline decoration-indigo-500 decoration-4">Quản lý Cơ sở</h1>
          <p className="text-slate-400 text-sm font-medium italic">Hiển thị {filteredVenues.length} kết quả</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95 transition-all">
          <Plus size={20} /> Thêm cơ sở mới
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Tìm kiếm nhanh..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-600" value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
          <option value="">-- Tất cả khu vực --</option>
          {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold text-slate-600" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">-- Trạng thái --</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
        </select>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Cơ sở</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Khu vực</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Số sân</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Hoạt động</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentItems.length > 0 ? currentItems.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                  
<td className="px-8 py-5">
  <div 
    className="flex items-center gap-4 cursor-pointer group/item" 
    onClick={() => navigate(`/admin/venues/${v.id}`)} // Điều hướng vào Detail
  >
    <img src={v.thumbnailUrl || '...'} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" />
    <div>
      <p className="font-black text-slate-800 text-[15px] group-hover/item:text-indigo-600 transition-colors">{v.name}</p>
      <p className="text-[10px] text-slate-400 italic">Nhấn để quản lý chi tiết →</p>
    </div>
  </div>
</td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase italic tracking-tighter border border-indigo-100/50">{v.areaName}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-black text-slate-700">{v.totalFields || 0} sân</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-bold text-slate-500 text-[12px]">
                    {v.openTime?.slice(0, 5)} - {v.closeTime?.slice(0, 5)}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest ${getStatusStyles(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setSelectedVenue(v); setIsImgModalOpen(true); }} className="p-2.5 text-amber-600 hover:bg-amber-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-amber-100" title="Quản lý ảnh"><ImageIcon size={18} /></button>
                      <button onClick={() => handleOpenModal(v)} className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-indigo-100" title="Sửa"><Edit size={18} /></button>
                      <button onClick={() => { if(window.confirm("Xóa cơ sở này?")) venueService.deleteVenue(v.id).then(fetchData) }} className="p-2.5 text-rose-500 hover:bg-rose-100 rounded-xl transition-all shadow-sm border border-transparent hover:border-rose-100" title="Xóa"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="py-20 text-center text-slate-400 font-bold italic text-sm">Không có dữ liệu hiển thị.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER PHÂN TRANG */}
        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 italic">Hiển thị</span>
            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-slate-200 rounded-lg text-xs font-black p-1.5 outline-none">
              {[5, 10, 20].map(size => <option key={size} value={size}>{size}</option>)}
            </select>
            <span className="text-xs font-bold text-slate-500 italic">dòng mỗi trang</span>
          </div>

          <div className="flex items-center gap-1">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-indigo-600 disabled:opacity-30 transition-all"><ChevronsLeft size={18} /></button>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-indigo-600 disabled:opacity-30 transition-all"><ChevronLeft size={18} /></button>
            <div className="flex items-center gap-1 mx-2">
               <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-black shadow-lg shadow-indigo-100">{currentPage}</span>
               <span className="text-xs font-bold text-slate-400 uppercase">/ {totalPages || 1}</span>
            </div>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-indigo-600 disabled:opacity-30 transition-all"><ChevronRight size={18} /></button>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(totalPages)} className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-indigo-600 disabled:opacity-30 transition-all"><ChevronsRight size={18} /></button>
          </div>
        </div>
      </div>

      {/* MODAL THÊM/SỬA */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedVenue ? "Cập nhật cơ sở" : "Tạo cơ sở mới"}>
         <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Tên cơ sở (*)" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Khu vực</label>
                <select value={formData.areaId} onChange={e => setFormData({ ...formData, areaId: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-xl outline-none text-sm font-bold border-slate-100">
                  <option value="">-- Chọn khu vực --</option>
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Activity size={12}/> Trạng thái
                </label>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full p-3 bg-slate-50 border rounded-xl outline-none text-sm font-bold border-slate-100">
                  <option value="ACTIVE" className="text-green-600 font-bold">ACTIVE (Hoạt động)</option>
                  <option value="INACTIVE" className="text-yellow-600 font-bold">INACTIVE (Tạm dừng)</option>
                  <option value="MAINTENANCE" className="text-red-600 font-bold">MAINTENANCE (Bảo trì)</option>
                </select>
              </div>
            </div>

            <VenueMapPicker address={formData.address} lat={formData.latitude} lng={formData.longitude} onSelect={(loc) => setFormData({ ...formData, address: loc.address, latitude: loc.latitude, longitude: loc.longitude })} />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Giờ mở cửa" type="time" value={formData.openTime} onChange={e => setFormData({ ...formData, openTime: e.target.value })} />
              <Input label="Giờ đóng cửa" type="time" value={formData.closeTime} onChange={e => setFormData({ ...formData, closeTime: e.target.value })} />
            </div>
            
            <div className="pt-4">
              <Button type="submit">Lưu thông tin cơ sở</Button>
            </div>
         </form>
      </Modal>

      <VenueImagesModal isOpen={isImgModalOpen} onClose={() => setIsImgModalOpen(false)} venueId={selectedVenue?.id} venueName={selectedVenue?.name} onRefresh={fetchData} />
    </div>
  );
};

export default ManageVenues;