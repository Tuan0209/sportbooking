import React, { useState, useEffect } from 'react';
import { venueService } from '../../services/venueService';
import { Upload, Trash2, Plus, Loader2, Camera } from 'lucide-react';

const VenueImagesSection = ({ venueId, venueName, onRefresh }) => {
  const [images, setImages] = useState([]);
  const [loadingType, setLoadingType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (venueId) fetchImages();
  }, [venueId]);

  const fetchImages = async () => {
    try {
      const res = await venueService.getImages(venueId);
      if (res.data.code === 0) setImages(res.data.result);
    } catch (e) { console.error(e); }
  };

  const handleUpload = async (type, e) => {
    const files = e.target.files;
    if (!files?.length) return;
    
    setLoadingType(type);
    setIsProcessing(true);

    try {
      if (type === 'cover' || type === 'thumbnail') {
        const existing = images.find(img => img.type === type);
        await venueService[`upload${type.charAt(0).toUpperCase() + type.slice(1)}`](venueId, files[0], !!existing);
      } else {
        await venueService.uploadGallery(venueId, files);
      }
      
      if (onRefresh) await onRefresh();
      await fetchImages();
    } catch (err) {
      alert("Lỗi upload ảnh!");
    } finally {
      setLoadingType(null);
      setIsProcessing(false);
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
    } catch (e) { alert("Lỗi khi xóa!"); }
    finally { setIsProcessing(false); }
  };

  const cover = images.find(i => i.type === 'cover');
  const thumb = images.find(i => i.type === 'thumbnail');
  const gallery = images.filter(i => i.type === 'gallery');

  return (
    <div className="relative space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Hiệu ứng Loading toàn cục */}
      {isProcessing && (
        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-3xl">
           <Loader2 className="w-10 h-10 text-pitch animate-spin mb-2" />
           <span className="text-[11px] font-semibold text-pitch uppercase tracking-wide">Đang cập nhật...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI: ẢNH BÌA */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-[11px] font-semibold text-muted uppercase tracking-wide flex items-center gap-2">
            Ảnh bìa cơ sở <span className="h-px flex-1 bg-line"></span>
          </h4>
          <div className="relative h-64 bg-chalk rounded-3xl overflow-hidden border-2 border-dashed border-line flex items-center justify-center group">
            {cover ? (
              <>
                <img src={cover.imageUrl} className="w-full h-full object-cover" alt="cover" />
                <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                  <label className="cursor-pointer bg-white p-3 rounded-2xl shadow-card hover:scale-110 transition-transform">
                    <Upload size={20} className="text-pitch"/>
                    <input type="file" hidden onChange={(e) => handleUpload('cover', e)} accept="image/*"/>
                  </label>
                  <button onClick={() => handleDelete(cover.id)} className="bg-red-600 text-white p-3 rounded-2xl shadow-card hover:scale-110 transition-transform">
                    <Trash2 size={20}/>
                  </button>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2 text-muted hover:text-pitch transition-colors">
                <Plus size={32}/><span className="text-xs font-semibold">Tải ảnh bìa lên</span>
                <input type="file" hidden onChange={(e) => handleUpload('cover', e)} accept="image/*"/>
              </label>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: ẢNH ĐẠI DIỆN */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-semibold text-muted uppercase tracking-wide flex items-center gap-2">
            Logo hiển thị <span className="h-px flex-1 bg-line"></span>
          </h4>
          <div className="relative aspect-square max-w-[260px] mx-auto bg-chalk rounded-[4rem] overflow-hidden border-2 border-dashed border-line flex items-center justify-center group">
            {thumb ? (
              <>
                <img src={thumb.imageUrl} className="w-full h-full object-cover" alt="thumb" />
                <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                  <label className="cursor-pointer bg-white p-3 rounded-2xl shadow-card hover:scale-110 transition-transform">
                    <Upload size={20} className="text-pitch"/>
                    <input type="file" hidden onChange={(e) => handleUpload('thumbnail', e)} accept="image/*"/>
                  </label>
                  <button onClick={() => handleDelete(thumb.id)} className="bg-red-600 text-white p-3 rounded-2xl shadow-card hover:scale-110 transition-transform">
                    <Trash2 size={20}/>
                  </button>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2 text-muted hover:text-pitch transition-colors">
                <Camera size={32}/><span className="text-xs font-semibold">Logo</span>
                <input type="file" hidden onChange={(e) => handleUpload('thumbnail', e)} accept="image/*"/>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* GALLERY SECTION */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-semibold text-muted uppercase tracking-wide flex items-center gap-2 flex-1">
            Bộ sưu tập Gallery <span className="h-px flex-1 bg-line ml-2"></span>
          </h4>
          <label className="cursor-pointer bg-pitch text-white px-6 py-2 rounded-2xl text-[11px] font-semibold hover:bg-pitch-deep transition-all shadow-glow ml-4">
            + THÊM GALLERY <input type="file" multiple hidden onChange={(e) => handleUpload('gallery', e)} />
          </label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {gallery.map(img => (
            <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-line shadow-sm hover:shadow-card-hover transition-all">
              <img src={img.imageUrl} className="w-full h-full object-cover" alt="gallery" />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg"
              >
                <Trash2 size={14}/>
              </button>
            </div>
          ))}
          {gallery.length === 0 && (
            <div className="col-span-full py-20 text-center bg-chalk rounded-3xl border-2 border-dashed border-line">
               <p className="text-muted font-semibold text-sm">Chưa có hình ảnh trong bộ sưu tập</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueImagesSection;