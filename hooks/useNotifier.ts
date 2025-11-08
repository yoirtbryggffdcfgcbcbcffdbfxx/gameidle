import { useState, useCallback } from 'react';
import { NotificationState } from '../types';

export const useNotifier = () => {
    const [notification, setNotification] = useState<NotificationState>({ text: '', show: false, type: 'default' });

    const showNotification = useCallback((text: string, type: NotificationState['type'] = 'default', duration = 3000) => {
        setNotification({ text, show: true, type });
        setTimeout(() => setNotification(n => ({ ...n, show: false })), duration);
    }, []);

    return { notification, showNotification };
};