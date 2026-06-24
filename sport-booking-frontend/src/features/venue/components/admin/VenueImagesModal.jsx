import React, { useState, useEffect } from 'react';
import { venueService } from '../../services/venueService';
import { Upload, Trash2, Plus, Loader2, Camera } from 'lucide-react';
import Modal from '../../../../shared/components/Modal';

// Thêm prop onRefresh vào đây
const VenueImagesModal = ({ isOpen, onClose, venueId, venueName, onRefresh }) => {
  const [images, setImages] = useState([]);
  const [loadingType, setLoadingType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // Hiệu ứng chờ tổng thể

  useEffect(() => {
    if (isOpen && venueId) fetchImages();
  }, [isOpen, venueId]);

  const fetchImages = async () => {
    const res = await venueService.getImages(venueId);
    if (res.data.code === 0) setImages(res.data.result);
  };

  const handleUpload = async (type, e) => {
    const files = e.target.files;
    if (!files?.length) return;
    
    setLoadingType(type);
    setIsProcessing(true); // Bắt đầu hiệu ứng chờ

    try {
      if (type === 'cover' || type === 'thumbnail') {
        const existing = images.find(img => img.type === type);
        await venueService[`upload${type.charAt(0).toUpperCase() + type.slice(1)}`](venueId, files[0], !!existing);
      } else {
        await venueService.uploadGallery(venueId, files);
      }
      
      // Quan trọng: Gọi hàm tải lại danh sách ở trang cha sau khi upload thành công
      if (onRefresh) await onRefresh();
      
      await fetchImages(); // Tải lại ảnh trong Modal
    } catch (err) {
      alert("Lỗi upload: " + (err.response?.data?.message || "Không xác định"));
    } finally {
      setLoadingType(null);
      setIsProcessing(false); // Tắt hiệu ứng chờ
      e.target.value = null;
    }
  };

  const handleDelete = async (imgId) => {
    if (!window.confirm("Xóa ảnh này?")) return;
    setIsProcessing(true);
    try {
      await venueService.deleteImage(imgId);
      if (onRefresh) await onRefresh();
      await fetchImages();
    } catch (e) {
      alert("Lỗi khi xóa!");
    } finally {
      setIsProcessing(false);
    }
  };

  const cover = images.find(i => i.type === 'cover');
  const thumb = images.find(i => i.type === 'thumbnail');
  const gallery = images.filter(i => i.type === 'gallery');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Ảnh cơ sở: ${venueName}`} size="xl">
      <div className="relative space-y-8 py-2">
        
        {/* Lớp phủ Hiệu ứng chờ tải ảnh */}
        {isProcessing && (
          <div className="absolute inset-0 z-[70] bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-2xl animate-in fade-in">
             <div className="w-12 h-12 border-4 border-pitch border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-pitch font-semibold text-xs uppercase tracking-wide">Đang xử lý ảnh...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageCard title="Ảnh Bìa (Cover)" img={cover} onUpload={(e) => handleUpload('cover', e)} loading={loadingType === 'cover'} />
          <ImageCard title="Ảnh Đại Diện (Thumb)" img={thumb} onUpload={(e) => handleUpload('thumbnail', e)} loading={loadingType === 'thumbnail'} circle />
        </div>

        <div className="pt-4 border-t border-line">
          <div className="flex justify-between items-center mb-4">
            <label className="text-[11px] font-semibold text-muted uppercase tracking-wide">Bộ sưu tập</label>
            <label className="cursor-pointer bg-pitch text-white px-5 py-2.5 rounded-2xl text-[11px] font-semibold hover:bg-pitch-deep transition-all flex items-center gap-2 shadow-glow">
               {loadingType === 'gallery' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
               THÊM NHIỀU ẢNH <input type="file" multiple hidden onChange={(e) => handleUpload('gallery', e)} />
            </label>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
             {gallery.map(img => (
               <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-line shadow-sm">
                  <img src={img.imageUrl} className="w-full h-full object-cover" alt="gallery" />
                  <button onClick={() => handleDelete(img.id)} className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Component phụ cho Card Ảnh
const ImageCard = ({ title, img, onUpload, loading, circle }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-semibold text-muted uppercase tracking-wide">{title}</label>
    <div className={`relative h-40 bg-chalk border-2 border-dashed border-line flex items-center justify-center overflow-hidden transition-all ${circle ? 'rounded-[3rem] w-40 mx-auto md:mx-0' : 'rounded-3xl'}`}>
      {img ? (
        <img src={img.imageUrl} className="w-full h-full object-cover shadow-inner" alt={title}/>
      ) : (
        <div className="flex flex-col items-center gap-1 opacity-40">
           <Camera size={32} className="text-muted"/>
           <span className="text-[10px] font-semibold text-muted">Trống</span>
        </div>
      )}
      <div className="absolute inset-0 bg-ink/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
        {loading ? (
          <Loader2 className="animate-spin text-white" size={24}/>
        ) : (
          <label className="cursor-pointer bg-white p-3 rounded-2xl shadow-card hover:scale-110 transition-all flex flex-col items-center gap-1">
            <Upload size={20} className="text-pitch"/>
            <span className="text-[10px] font-semibold text-pitch uppercase">Tải lên</span>
            <input type="file" hidden onChange={onUpload} accept="image/*"/>
          </label>
        )}
      </div>
    </div>
  </div>
);

export default VenueImagesModal;