import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

// 1. Create the Context
const ToastContext = createContext();

// 2. Custom Hook for easy usage
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// 3. The Provider Component
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ title, description, type = 'info', duration = 3000 }) => {
        const id = Math.random().toString(36).substring(2, 9);

        setToasts((prev) => [...prev, { id, title, description, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    // Helper methods exposed via the hook
    const toast = {
        success: (title, description) => addToast({ title, description, type: 'success' }),
        error: (title, description) => addToast({ title, description, type: 'error' }),
        info: (title, description) => addToast({ title, description, type: 'info' }),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast Container (Fixed Bottom Right) */}
            <div className="fixed bottom-0 right-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-4 sm:right-4 sm:top-auto sm:flex-col md:max-w-[420px] gap-3 pointer-events-none">
                {toasts.map((t) => (
                    <ToastCard key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// 4. The Individual Toast UI Component
function ToastCard({ toast, onDismiss }) {
    // Theme variants mapping
    const styles = {
        success: {
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
            border: 'border-emerald-500/20',
            bg: 'bg-emerald-500/10',
        },
        error: {
            icon: <AlertCircle className="w-5 h-5 text-red-500" />,
            border: 'border-red-500/20',
            bg: 'bg-red-500/10',
        },
        info: {
            icon: <Info className="w-5 h-5 text-zinc-400" />,
            border: 'border-zinc-800',
            bg: 'bg-zinc-900/90',
        }
    };

    const currentStyle = styles[toast.type] || styles.info;

    return (
        <div className={`
      pointer-events-auto relative flex w-full items-start justify-between space-x-4 overflow-hidden rounded-lg 
      border ${currentStyle.border} ${currentStyle.bg} p-4 pr-6 shadow-lg backdrop-blur-md
      transform transition-all duration-300 ease-in-out
      animate-in slide-in-from-bottom-5 fade-in-0 fill-mode-forwards
    `}>

            <div className="flex gap-3 w-full">
                <div className="shrink-0 mt-0.5">
                    {currentStyle.icon}
                </div>
                <div className="flex flex-col gap-1 w-full">
                    {toast.title && (
                        <h3 className="text-sm font-semibold text-zinc-50 leading-none tracking-tight">
                            {toast.title}
                        </h3>
                    )}
                    {toast.description && (
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            {toast.description}
                        </p>
                    )}
                </div>
            </div>

            <button
                onClick={onDismiss}
                className="absolute right-2 top-2 rounded-md p-1 text-zinc-500 hover:text-zinc-50 hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}