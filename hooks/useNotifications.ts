import { useState, useCallback, useRef } from 'react';
import { Notification, Achievement } from '../types';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const notificationIdCounter = useRef(0);

    // FIX: Changed id parameter type from number to string to match Notification.id type.
    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const addNotification = useCallback((
        message: string,
        type: Notification['type'],
        options: { title?: string; achievement?: Achievement } = {}
    ) => {
        const id = notificationIdCounter.current++;
        const newNotification: Notification = {
            // FIX: Convert numeric id to a string to match the Notification type.
            id: String(id),
            // FIX: Add missing timestamp and read properties to satisfy the Notification type.
            timestamp: Date.now(),
            read: false,
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