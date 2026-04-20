import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

const colors = {
  success: 'var(--success)',
  error: 'var(--danger)',
  warning: 'var(--warning)',
  info: 'var(--secondary)',
};

const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      zIndex: 9999,
      maxWidth: '380px',
      width: '100%',
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="fade-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '1rem 1.25rem',
            background: 'var(--card-bg)',
            border: `1px solid ${colors[toast.type]}40`,
            borderLeft: `4px solid ${colors[toast.type]}`,
            borderRadius: '12px',
            boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${colors[toast.type]}10`,
            color: 'var(--text-main)',
          }}
        >
          <span style={{ color: colors[toast.type], flexShrink: 0 }}>
            {icons[toast.type]}
          </span>
          <p style={{ flex: 1, fontSize: '0.9rem', lineHeight: '1.4' }}>{toast.message}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{ color: 'var(--text-muted)', flexShrink: 0, padding: '2px' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
