import React, { useEffect } from 'react';
import './Toast.css';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="site-toast-container" role="status" aria-live="polite">
      <div className={`site-toast ${isSuccess ? 'site-toast--success' : 'site-toast--error'}`}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isSuccess ? '#22c55e' : '#ef4444'}
          strokeWidth="2"
          aria-hidden="true"
        >
          {isSuccess ? (
            <polyline points="20 6 9 17 4 12" />
          ) : (
            <>
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </>
          )}
        </svg>
        <div className="site-toast-message">{toast.message}</div>
        <button
          onClick={onClose}
          className="site-toast-close"
          aria-label="Close message"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default Toast;
