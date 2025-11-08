import { useState, useCallback } from 'react';

export const useNotifier = () => {
    const [notification, setNotification] = useState({ text: '', show: false });

    const showNotification = useCallback((text: string, duration = 1200) => {
        setNotification({ text, show: true });
        setTimeout(() => setNotification({ text: '', show: false }), duration);
    }, []);

    return { notification, showNotification };
};
