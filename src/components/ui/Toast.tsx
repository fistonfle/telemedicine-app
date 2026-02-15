import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ToastType = "info" | "success" | "error";
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}
type ToastFn = (msg: string) => void;
interface ToastAPI extends ToastFn {
  success: ToastFn;
  error: ToastFn;
}

const ToastContext = createContext<ToastAPI | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev: Toast[]) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== id));
    }, 4000);
    return id;
  }, []);

  const toast = useCallback((msg: string) => addToast(msg, "info"), [addToast]) as ToastAPI;
  toast.success = (msg: string) => addToast(msg, "success");
  toast.error = (msg: string) => addToast(msg, "error");

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t: Toast) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border min-w-[280px] max-w-md ${
              t.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : t.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            {t.type === "error" && (
              <span className="material-icons text-red-500">error</span>
            )}
            {t.type === "success" && (
              <span className="material-icons text-emerald-500">check_circle</span>
            )}
            <span className="text-sm font-medium flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
