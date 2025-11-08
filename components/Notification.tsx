import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Notification as NotificationType } from '../types';

interface NotificationToastProps {
    notification: NotificationType;
    onDismiss: (id: number) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    // FIX: Initialize useRef with an argument (undefined) to resolve "Expected 1 arguments, but got 0" and add `useCallback` to imports.
    const dismissTimer = useRef<number | undefined>(undefined);
    const duration = notification.type === 'achievement' ? 5000 : 3000;
    const remainingTime = useRef(duration);
    const startTime = useRef(Date.now());

    const handleDismiss = () => {
        setIsExiting(true);
        // Delay dismissal to allow for exit animation
        setTimeout(() => onDismiss(notification.id), 300);
    };

    const pauseTimer = useCallback(() => {
        clearTimeout(dismissTimer.current);
        const elapsed = Date.now() - startTime.current;
        remainingTime.current -= elapsed;
        setIsPaused(true);
    }, []);

    const resumeTimer = useCallback(() => {
        if (isPaused) {
            startTime.current = Date.now();
            dismissTimer.current = window.setTimeout(handleDismiss, remainingTime.current);
            setIsPaused(false);
        }
    }, [isPaused]);

    useEffect(() => {
        startTime.current = Date.now();
        dismissTimer.current = window.setTimeout(handleDismiss, remainingTime.current);

        return () => {
            clearTimeout(dismissTimer.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const styles = {
        achievement: { icon: '🏆', borderColor: 'border-yellow-400', bgColor: 'bg-gradient-to-br from-gray-800 to-black', titleColor: 'text-yellow-400', progressColor: 'bg-yellow-400' },
        error: { icon: '❌', borderColor: 'border-red-500', bgColor: 'bg-gradient-to-br from-red-900 to-black', titleColor: 'text-red-400', progressColor: 'bg-red-500' },
        info: { icon: 'ℹ️', borderColor: 'border-cyan-400', bgColor: 'bg-gradient-to-br from-blue-900 to-black', titleColor: 'text-cyan-400', progressColor: 'bg-cyan-400' }
    };

    const style = styles[notification.type];
    const animationClass = isExiting ? 'animate-toast-out' : 'animate-toast-in';
    const title = notification.title || (notification.type === 'error' ? 'Erreur' : 'Info');
    
    return (
        <div
            className={`relative w-full p-2 rounded-lg border-l-4 shadow-2xl overflow-hidden ${style.borderColor} ${style.bgColor} ${animationClass}`}
            onMouseEnter={pauseTimer}
            onMouseLeave={resumeTimer}
        >
            <div className="flex items-start">
                <span className="text-lg mr-2">{style.icon}</span>
                <div>
                    <h4 className={`font-bold text-xs ${style.titleColor}`}>{title}</h4>
                    <p className="text-white text-xs leading-tight">{notification.type === 'achievement' ? notification.achievement?.name : notification.message}</p>
                    {notification.type === 'achievement' && (
                        <p className="text-[10px] text-gray-300 mt-0.5 leading-tight">{notification.achievement?.description}</p>
                    )}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black/50">
                <div
                    className={`h-full ${style.progressColor} animate-progress-shrink`}
                    style={{ animationDuration: `${duration / 1000}s`, animationPlayState: isPaused ? 'paused' : 'running' }}
                ></div>
            </div>
        </div>
    );
};


interface NotificationCenterProps {
    notifications: NotificationType[];
    removeNotification: (id: number) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, removeNotification }) => {
    return (
        <div className="fixed top-4 right-4 z-[2500] w-64 space-y-2 pointer-events-none">
            {notifications.map(notification => (
                 <div key={notification.id} className="pointer-events-auto">
                    <NotificationToast notification={notification} onDismiss={removeNotification} />
                </div>
            ))}
        </div>
    );
};

export default NotificationCenter;