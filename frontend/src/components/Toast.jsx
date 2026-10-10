import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      <div className={`toast ${toast.type}`}>
        <span style={{ fontSize: '18px' }}>
          {toast.type === 'success' ? '✅' : '❌'}
        </span>
        <div style={{ flex: 1, wordBreak: 'break-word' }}>
          {toast.message}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            fontSize: '14px'
          }}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
