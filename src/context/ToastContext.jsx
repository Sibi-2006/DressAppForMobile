import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success',
        duration: 3000,
    });

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        // Hide first if already visible (prevents stacking)
        setToast({ visible: false, message: '', type, duration });
        setTimeout(() => {
            setToast({ visible: true, message, type, duration });
        }, 50);
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, visible: false }));
    }, []);

    // Shortcut helpers
    const toast_success = useCallback((msg, dur) => showToast(msg, 'success', dur), [showToast]);
    const toast_error = useCallback((msg, dur) => showToast(msg, 'error', dur), [showToast]);
    const toast_warning = useCallback((msg, dur) => showToast(msg, 'warning', dur), [showToast]);
    const toast_info = useCallback((msg, dur) => showToast(msg, 'info', dur), [showToast]);
    const toast_cart = useCallback((msg, dur) => showToast(msg, 'cart', dur), [showToast]);

    return (
        <ToastContext.Provider value={{
            showToast,
            hideToast,
            toast_success,
            toast_error,
            toast_warning,
            toast_info,
            toast_cart,
        }}>
            {children}
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onHide={hideToast}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be inside ToastProvider');
    return context;
};

export default ToastContext;
