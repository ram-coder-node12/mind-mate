import { useState, useCallback } from 'react';

/**
 * useToast — lightweight global toast notification hook.
 * Returns { toasts, showToast, dismissToast }
 * Types: 'success' | 'error' | 'warning' | 'info'
 */
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
};

export default useToast;
