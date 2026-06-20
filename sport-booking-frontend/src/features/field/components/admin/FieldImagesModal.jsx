import React, { useState, useEffect } from 'react';
import { fieldService } from '../../services/fieldService';
import { Upload, Trash2, Plus, Loader2 } from 'lucide-react';
import Modal from '../../../../shared/components/Modal';

const FieldImagesModal = ({ isOpen, onClose, fieldId, fieldName }) => {
  const [images, setImages] = useState([]);
  const [loadingType, setLoadingType] = useState(null);

  useEffect(() => {
    if (isOpen && fieldId) fetchImages();
  }, [isOpen, fieldId]);

  const fetchImages = async () => {
    try {
      const res = await fieldService.getImages(fieldId);
      if (res.data.code === 0) {
        setImages(res.data.result);
      }
    } catch (e) { console.error("Lấy ảnh thất bại:", e); }
  };

  const handleUpload = async (type, e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoadingType(type);

    // 1. Tạo Preview tạm thời
    const fileArray = Array.from(files);
    const tempPreviews = fileArray.map(file => ({
      id: `temp-${Math.random()}`,
      imageUrl: URL.createObjectURL(file),
      type: type,
      isTemp: true
    }));

    if (type === 'gallery') {
      setImages(prev => [...prev, ...tempPreviews]);
    } else {
      setImages(prev => prev.filter(img => img.type !== type).concat(tempPreviews));
    }

    // 2. Gọi API Upload
    try {
      if (type === 'cover' || type === 'thumbnail') {
        // Tìm xem đã có ảnh thật (không phải ảnh tạm) loại này chưa để dùng PUT
        const existing = images.find(img => img.type === type && !img.isTemp);
        await fieldService[`upload${type.charAt(0).toUpperCase() + type.slice(1)}`](fieldId, files[0], !!existing);
      } else {
        await fieldService.uploadGallery(fieldId, files);
      }
      
      // Đợi một chút để server ổn định rồi load lại dữ liệu thật
      setTimeout(fetchImages, 800);
    } catch (err) {
      alert("Lỗi khi tải ảnh lên!");
      fetchImages(); 
    } finally {
      setLoadingType(null);
      e.target.value = null; // Reset input file
    }
  };

  const handleDelete = async (img) => {
    const typeName = img.type === 'cover' ? "ảnh nền" : img.type === 'thumbnail' ? "ảnh đại diện" : "ảnh trong bộ sưu tập";
    if (!window.confirm(`Bạn có chắc muốn xóa ${typeName} này?`)) return;

    try {
      await fieldService.deleteImage(img.id);
      // Cập nhật lại state sau khi xóa thành công
      setImages(prev => prev.filter(item => item.id !== img.id));
      // Không cần fetch lại toàn bộ nếu chỉ xóa 1 cái để tránh flicker
    } catch (e) {
      alert("Lỗi khi xóa ảnh!");
    }
  };

  // Helper hiển thị link ảnh chuẩn
  const getSrc = (img) => img.imageUrl || img.image_url || "";

  const cover = images.find(img => img.type === 'cover');
  const thumbnail = images.find(img => img.type === 'thumbnail');
  const gallery = images.filter(img => img.type === 'gallery');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Quản lý ảnh: ${fieldName}`} size="xl">
      <div className="space-y-8 p-2">
        
        {/* ROW 1: COVER & THUMBNAIL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Cover Image Section */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
              Ảnh Cover (Nền) <span>{cover && "(1)"}</span>
            </label>
            <div className="relative h-48 bg-slate-50 rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center group">
              {cover ? (
                <>
                  <img src={getSrc(cover)} className="w-full h-full object-cover" alt="cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4 backdrop-blur-[2px]">
                    <label className="cursor-pointer bg-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform flex flex-col items-center gap-1">
                      <Upload size={20} className="text-indigo-600"/>
                      <span className="text-[9px] font-black text-indigo-600 uppercase">Thay thế</span>
                      <input type="file" hidden onChange={(e) => handleUpload('cover', e)} accept="image/*"/>
                    </label>
                    <button 
                      onClick={() => handleDelete(cover)}
                      className="bg-rose-500 p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform flex flex-col items-center gap-1 text-white"
                    >
                      <Trash2 size={20}/>
                      <span className="text-[9px] font-black uppercase">Xóa bỏ</span>
                    </button>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 text-slate-400 hover:text-indigo-500 transition-colors">
                  <div className="p-4 bg-white rounded-2xl shadow-sm"><Plus size={28}/></div>
                  <span className="text-[10px] font-black uppercase tracking-tighter">Upload Cover</span>
                  <input type="file" hidden onChange={(e) => handleUpload('cover', e)} accept="image/*"/>
                </label>
              )}
              {loadingType === 'cover' && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>}
            </div>
          </div>

          {/* Thumbnail Image Section */}
          <div className="space-y-3 text-center md:text-left">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
              Ảnh Thumbnail (Đại diện) <span>{thumbnail && "(1)"}</span>
            </label>
            <div className="relative h-48 w-48 mx-auto md:mx-0 bg-slate-50 rounded-[3rem] overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center group">
              {thumbnail ? (
                <>
                  <img src={getSrc(thumbnail)} className="w-full h-full object-cover" alt="thumb" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-[1px]">
                    <label className="cursor-pointer bg-white p-2.5 rounded-xl shadow-lg flex flex-col items-center gap-1">
                      <Upload size={18} className="text-indigo-600"/>
                      <input type="file" hidden onChange={(e) => handleUpload('thumbnail', e)} accept="image/*"/>
                    </label>
                    <button onClick={() => handleDelete(thumbnail)} className="bg-rose-500 p-2.5 rounded-xl shadow-lg text-white">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 text-slate-400">
                  <div className="p-4 bg-white rounded-2xl shadow-sm"><Plus size={28}/></div>
                  <span className="text-[10px] font-black uppercase">Upload Thumb</span>
                  <input type="file" hidden onChange={(e) => handleUpload('thumbnail', e)} accept="image/*"/>
                </label>
              )}
              {loadingType === 'thumbnail' && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>}
            </div>
          </div>
        </div>

        {/* GALLERY SECTION */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Bộ sưu tập (Gallery)</label>
            <label className={`cursor-pointer bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 ${loadingType === 'gallery' ? 'opacity-50 pointer-events-none' : ''}`}>
              <Plus size={16} /> THÊM NHIỀU ẢNH 
              <input type="file" multiple hidden onChange={(e) => handleUpload('gallery', e)} accept="image/*"/>
            </label>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {gallery.map(img => (
              <div key={img.id} className="relative aspect-square bg-slate-50 rounded-3xl overflow-hidden group border-2 border-white shadow-sm hover:shadow-md transition-all">
                <img src={getSrc(img)} className="w-full h-full object-cover" alt="gallery" />
                {!img.isTemp ? (
                  <button 
                    onClick={() => handleDelete(img)}
                    className="absolute top-2 right-2 p-2 bg-rose-500/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                ) : (
                  <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                    <Loader2 className="animate-spin text-indigo-600" />
                  </div>
                )}
              </div>
            ))}
            
            {gallery.length === 0 && !loadingType && (
              <div className="col-span-full py-16 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 text-sm font-medium italic">Bộ sưu tập đang trống</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
           <button 
            onClick={() => { if(window.confirm("Xác nhận xóa sạch ảnh của sân này?")) fieldService.deleteAllImages(fieldId).then(fetchImages) }} 
            className="text-[10px] text-rose-500 font-black uppercase tracking-widest hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
           >
             Xoá toàn bộ ảnh
           </button>
           <p className="text-[10px] text-slate-400 font-bold italic opacity-60">* Các thay đổi được lưu tự động lên hệ thống</p>
        </div>
      </div>
    </Modal>
  );
};

export default FieldImagesModal;