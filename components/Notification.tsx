import React from 'react';

interface NotificationProps {
    message: string;
    show: boolean;
}

const Notification: React.FC<NotificationProps> = ({ message, show }) => {
    if (!show) return null;
    
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#ff4444] px-4 py-2 rounded-md font-bold z-50 [text-shadow:1px_1px_#000] animate-pop">
            {message}
        </div>
    );
};

export default Notification;
