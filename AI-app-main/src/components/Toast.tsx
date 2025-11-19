'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after duration (default 5s)
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} hideToast={hideToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  hideToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, hideToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const config = {
    success: {
      icon: CheckCircle2,
      bgClass: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30',
      iconClass: 'text-green-400',
      textClass: 'text-green-100',
    },
    error: {
      icon: XCircle,
      bgClass: 'bg-gradient-to-br from-red-500/20 to-rose-500/20 border-red-500/30',
      iconClass: 'text-red-400',
      textClass: 'text-red-100',
    },
    warning: {
      icon: AlertCircle,
      bgClass: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
      iconClass: 'text-yellow-400',
      textClass: 'text-yellow-100',
    },
    info: {
      icon: Info,
      bgClass: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-cyan-500/30',
      iconClass: 'text-cyan-400',
      textClass: 'text-cyan-100',
    },
  };

  const { icon: Icon, bgClass, iconClass, textClass } = config[toast.type];

  return (
    <div
      className={`
        glass backdrop-blur-xl border rounded-xl shadow-2xl
        ${bgClass}
        pointer-events-auto
        transition-all duration-300 ease-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
      style={{
        animation: isExiting ? undefined : 'slideInRight 0.3s ease-out',
      }}
    >
      <div className="p-4 flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconClass}`} />
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${textClass}`}>{toast.message}</p>
          {toast.description && (
            <p className="text-sm text-neutral-300 mt-1">{toast.description}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-neutral-400 hover:text-neutral-200 transition-colors p-1 rounded-lg hover:bg-white/10"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Utility hooks for common toast patterns
export const useSuccessToast = () => {
  const { showToast } = useToast();
  return useCallback(
    (message: string, description?: string) => {
      showToast({ type: 'success', message, description });
    },
    [showToast]
  );
};

export const useErrorToast = () => {
  const { showToast } = useToast();
  return useCallback(
    (message: string, description?: string) => {
      showToast({ type: 'error', message, description });
    },
    [showToast]
  );
};

export const useWarningToast = () => {
  const { showToast } = useToast();
  return useCallback(
    (message: string, description?: string) => {
      showToast({ type: 'warning', message, description });
    },
    [showToast]
  );
};

export const useInfoToast = () => {
  const { showToast } = useToast();
  return useCallback(
    (message: string, description?: string) => {
      showToast({ type: 'info', message, description });
    },
    [showToast]
  );
};

// CSS animation (add to globals.css)
const slideInRightKeyframes = `
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
`;
