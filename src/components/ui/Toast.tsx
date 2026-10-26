import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = { success: '#10B981', error: '#EF4444', info: '#4F46E5' };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#fff',
        border: `2px solid ${colors[type]}`,
        borderRadius: '12px',
        padding: '12px 20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '260px',
        animation: 'fadeInUp 0.3s ease',
      }}
    >
      <span style={{ fontSize: '18px' }}>
        {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
      </span>
      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{message}</span>
    </div>
  );
};

export default Toast;
