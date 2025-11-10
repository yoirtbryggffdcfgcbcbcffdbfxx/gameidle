import { useState, useCallback, useRef } from 'react';
import { Notification, Achievement } from '../types';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const notificationIdCounter = useRef(0);

    const removeNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const addNotification = useCallback((
        message: string,
        type: Notification['type'],
        options: { title?: string; achievement?: Achievement } = {}
    ) => {
        const id = notificationIdCounter.current++;
        const newNotification: Notification = {
            id,
            message,
            type,
            title: options.title,
            achievement: options.achievement,
        };
        // Add new notifications to the top of the list
        setNotifications(prev => [newNotification, ...prev].slice(0, 5)); // Limit to 5 notifications
    }, []);

    return { notifications, addNotification, removeNotification };
};
