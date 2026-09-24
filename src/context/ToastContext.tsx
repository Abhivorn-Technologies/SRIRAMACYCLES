'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface IToast {
  id: string;
  message: string;
  type: ToastType;
}

interface IToastContext {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<IToastContext | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {/* Toast Notification Container - Strictly Fixed at Bottom-Right */}
      <aside
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999999,
        }}
        className="flex flex-col items-end gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              role="alert"
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: isError
                  ? '1px solid rgba(244, 63, 94, 0.4)'
                  : isSuccess
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : '1px solid rgba(100, 116, 139, 0.4)',
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
              }}
              className="pointer-events-auto w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 transform translate-y-0 shadow-2xl"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                {isSuccess && (
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                )}
                {isError && (
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                  </div>
                )}
                {!isSuccess && !isError && (
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/40">
                    <Info className="w-5 h-5 text-sky-400" />
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span
                    style={{ color: isError ? '#f87171' : isSuccess ? '#34d399' : '#38bdf8' }}
                    className="text-[10px] font-black uppercase tracking-wider"
                  >
                    {isSuccess ? 'Success' : isError ? 'Required / Alert' : 'Information'}
                  </span>
                  <p
                    style={{ color: '#ffffff' }}
                    className="text-xs sm:text-sm font-semibold leading-snug break-words"
                  >
                    {toast.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0 ml-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
