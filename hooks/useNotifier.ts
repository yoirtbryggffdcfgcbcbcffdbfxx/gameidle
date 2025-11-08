import { useState, useCallback, useRef } from 'react';
import { NotificationState } from '../types';

const priorities = {
    error: 2,
    default: 1,
};

export const useNotifier = () => {
    const [notification, setNotification] = useState<NotificationState>({ text: '', show: false, type: 'default' });
    const notificationTimer = useRef<number | null>(null);

    const showNotification = useCallback((text: string, type: NotificationState['type'] = 'default', duration = 3000) => {
        const currentType = notification.type || 'default';
        
        // If a notification is showing and the new one has lower priority, ignore it.
        if (notification.show && priorities[type] < priorities[currentType]) {
            return;
        }

        // Clear any existing timer to ensure the new notification shows for its full duration.
        if (notificationTimer.current) {
            clearTimeout(notificationTimer.current);
        }

        setNotification({ text, show: true, type });

        notificationTimer.current = window.setTimeout(() => {
            setNotification(n => ({ ...n, show: false }));
            notificationTimer.current = null;
        }, duration);
    }, [notification]);

    return { notification, showNotification };
};