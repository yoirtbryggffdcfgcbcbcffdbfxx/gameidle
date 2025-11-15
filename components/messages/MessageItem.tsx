import React from 'react';
import { Notification } from '../../types';
import { formatDuration } from '../../utils/helpers';

interface MessageItemProps {
    notification: Notification;
}

const ICONS: Record<Notification['type'], string> = {
    achievement: '🏆',
    error: '❌',
    info: 'ℹ️',
    system: '⚙️'
};

const BORDER_COLORS: Record<Notification['type'], string> = {
    achievement: 'border-yellow-400',
    error: 'border-red-500',
    info: 'border-cyan-400',
    system: 'border-gray-500'
};

const MessageItem: React.FC<MessageItemProps> = ({ notification }) => {
    const { type, title, message, timestamp, read, achievement } = notification;

    const timeAgo = formatDuration(Math.floor((Date.now() - timestamp) / 1000));

    const itemClasses = `
        w-full p-2 rounded-lg border-l-4 shadow-lg transition-opacity duration-500
        bg-black/20 ${BORDER_COLORS[type]} ${read ? 'opacity-60' : 'opacity-100'}
    `;

    return (
        <div className={itemClasses}>
            <div className="flex items-start">
                <span className="text-lg mr-2">{ICONS[type]}</span>
                <div className="flex-grow">
                    <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-xs leading-tight text-white">{title || message}</h4>
                        <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{timeAgo}</span>
                    </div>
                    {title && <p className="text-white text-[10px] leading-tight mt-0.5">{message}</p>}
                    {achievement && (
                        <p className="text-[10px] text-gray-300 mt-0.5 leading-tight">{achievement.description}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageItem;