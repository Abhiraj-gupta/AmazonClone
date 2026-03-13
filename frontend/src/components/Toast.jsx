import { useState, useCallback, useMemo } from "react";
import { ToastContext } from "./ToastContext";

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type, removing: false }]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, duration);
  }, []);

  const toast = useMemo(
    () => ({
      success: (msg) => addToast(msg, "success"),
      error: (msg) => addToast(msg, "error"),
      info: (msg) => addToast(msg, "info"),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const icons = {
  success: (
    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
};

function ToastItem({ toast }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg transition-all duration-300 ${
        toast.removing
          ? "translate-x-full opacity-0"
          : "translate-x-0 opacity-100"
      }`}
    >
      {icons[toast.type]}
      <span className="text-sm text-slate-700">{toast.message}</span>
    </div>
  );
}
