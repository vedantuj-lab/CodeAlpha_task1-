import React from 'react';
import { useGallery } from '../context/GalleryContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGallery();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        let bg = 'bg-[#1E201E] text-white';
        let icon = <Info className="w-5 h-5 text-sky-400 shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-[#287A52] text-white';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-[#B42318] text-white';
          icon = <AlertCircle className="w-5 h-5 text-rose-200 shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-[#9A6700] text-white';
          icon = <AlertTriangle className="w-5 h-5 text-amber-200 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`${bg} px-4 py-3 rounded-xl shadow-xl flex items-start gap-3 pointer-events-auto border border-white/10 animate-toast-in`}
          >
            {icon}
            <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-0.5 rounded transition"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
