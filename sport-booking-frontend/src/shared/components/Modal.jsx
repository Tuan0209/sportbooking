import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Content */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg z-10 overflow-hidden animate-fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-chalk rounded-full text-muted hover:text-ink transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
