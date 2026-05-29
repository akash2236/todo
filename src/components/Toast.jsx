import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="toast-icon success" size={16} />;
      case 'warning':
        return <AlertCircle className="toast-icon warning" size={16} />;
      case 'info':
      default:
        return <Info className="toast-icon info" size={16} />;
    }
  };

  return (
    <div className={`toast-item ${toast.type || 'info'}`}>
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{toast.message}</span>
      </div>
      
      <button className="toast-close-btn" onClick={onClose} aria-label="Dismiss alert">
        <X size={14} />
      </button>
    </div>
  );
}
