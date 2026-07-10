import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const STYLES = {
  success: { icon: CheckCircle2, ring: 'border-pitch/30', bar: 'bg-pitch', iconColor: 'text-pitch' },
  error: { icon: XCircle, ring: 'border-red-200', bar: 'bg-red-500', iconColor: 'text-red-500' },
  info: { icon: Info, ring: 'border-line', bar: 'bg-ink-soft', iconColor: 'text-ink-soft' },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((message, type = 'success') => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map((t) => {
          const s = STYLES[t.type] || STYLES.info;
          const Icon = s.icon;
          return (
            <div
              key={t.id}
              className={`pointer-events-auto w-full bg-white rounded-2xl shadow-card-hover border ${s.ring} overflow-hidden flex items-stretch animate-fade-up`}
            >
              <div className={`w-1.5 shrink-0 ${s.bar}`} />
              <div className="flex items-center gap-3 px-4 py-3 flex-1 min-w-0">
                <Icon size={20} className={`${s.iconColor} shrink-0`} />
                <p className="text-sm font-medium text-ink flex-1 min-w-0">{t.message}</p>
                <button onClick={() => remove(t.id)} className="text-muted hover:text-ink transition shrink-0" aria-label="Đóng">
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  return ctx || { notify: () => {} };
};

export default ToastProvider;
