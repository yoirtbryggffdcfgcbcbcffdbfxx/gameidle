import React, { useEffect, useState } from 'react';
import { NotificationState } from '../types';

interface NotificationProps extends NotificationState {}

const notificationStyles = {
    default: 'bg-gray-700 text-white',
    error: 'bg-red-600 text-white',
};

const notificationIcons = {
    default: 'ℹ️',
    error: '❌',
};

// FIX: Destructured the `text` prop instead of `message` to align with the `NotificationState` type.
const Notification: React.FC<NotificationProps> = ({ text, show, type = 'default' }) => {
    const [render, setRender] = useState(false);

    useEffect(() => {
        if (show) {
            setRender(true);
        } else {
            // Wait for animation to finish before unmounting
            const timer = setTimeout(() => setRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!render) return null;

    const baseClasses = "fixed top-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg font-bold z-[100] [text-shadow:1px_1px_#000] flex items-center gap-3 shadow-2xl transition-all duration-300";
    const animationClass = show ? 'transform-none opacity-100' : '-translate-y-20 opacity-0';
    const typeClasses = notificationStyles[type] || notificationStyles.default;
    const icon = notificationIcons[type] || notificationIcons.default;

    return (
        <div className={`${baseClasses} ${typeClasses} ${animationClass}`}>
            <span className="text-xl">{icon}</span>
            <span>{text}</span>
        </div>
    );
};

export default Notification;