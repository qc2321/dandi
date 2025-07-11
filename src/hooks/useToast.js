import { useState, useCallback } from "react";

export const useToast = () => {
    const [toast, setToast] = useState({ show: false, message: '', color: 'green' });

    const showToast = useCallback((message, color = 'green') => {
        setToast({ show: true, message, color });
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, show: false }));
    }, []);

    const showSuccessToast = useCallback((message) => {
        showToast(message, 'green');
    }, [showToast]);

    const showErrorToast = useCallback((message) => {
        showToast(message, 'red');
    }, [showToast]);

    const showAutoHideToast = useCallback((message, color = 'green', duration = 2000) => {
        showToast(message, color);
        setTimeout(() => hideToast(), duration);
    }, [showToast, hideToast]);

    return {
        toast,
        showToast,
        hideToast,
        showSuccessToast,
        showErrorToast,
        showAutoHideToast,
    };
}; 