"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { X, Check, AlertTriangle, Info } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  variant: ToastVariant;
  message: string;
}

interface ToastContextType {
  addToast: (variant: ToastVariant, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const icons = {
  success: <Check size={16} className="text-[#22C55E]" />,
  error: <AlertTriangle size={16} className="text-[#EF4444]" />,
  info: <Info size={16} className="text-[#4338CA]" />,
};

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((variant: ToastVariant, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, variant, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 px-4 py-3 bg-white border-[1.5px] border-[#ADB5BD] rounded-[12px] shadow-lg min-w-[280px] animate-[slideIn_300ms_ease-out]"
          >
            {icons[toast.variant]}
            <span className="text-[13px] text-[#343A40] flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="cursor-pointer">
              <X size={14} className="text-[#ADB5BD]" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export { ToastProvider, useToast };
export type { ToastVariant };
