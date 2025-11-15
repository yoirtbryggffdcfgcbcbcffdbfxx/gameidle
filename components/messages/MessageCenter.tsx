import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { useDragToScroll } from '../../hooks/ui/useDragToScroll';
import MessageItem from './MessageItem';
import { Notification } from '../../types';

const filterLabels: Record<'all' | Notification['type'], string> = {
    all: 'Tout',
    achievement: 'Succès',
    info: 'Info',
    error: 'Erreur',
    system: 'Système'
};

const MessageCenter: React.FC = () => {
    const { gameState, popups, handlers, computedState } = useGameContext();
    const { isMessageCenterOpen, isDevModeActive } = popups;
    const { unreadMessageCount } = computedState;
    const [activeFilter, setActiveFilter] = useState<'all' | Notification['type']>('all');
    const scrollableRef = useRef<HTMLDivElement>(null);
    useDragToScroll(scrollableRef);

    useEffect(() => {
        // Mark messages as read when the panel is opened
        if (isMessageCenterOpen && unreadMessageCount > 0) {
            handlers.markAllMessagesAsRead();
        }
    }, [isMessageCenterOpen, unreadMessageCount, handlers]);

    const panelClasses = `
        fixed top-0 bottom-0 z-[2900] w-full max-w-sm h-full bg-[var(--bg-popup)] shadow-2xl flex flex-col
        transition-transform duration-300 ease-in-out
        ${isMessageCenterOpen ? 'translate-x-0' : '-translate-x-full'}
    `;

    const availableFilters = useMemo(() => {
        const baseFilters: ('all' | Notification['type'])[] = ['all', 'achievement', 'info', 'error'];
        if (isDevModeActive) {
            baseFilters.push('system');
        }
        return baseFilters;
    }, [isDevModeActive]);

    const filteredMessages = useMemo(() => {
        let messages = gameState.messageLog;

        if (!isDevModeActive) {
            messages = messages.filter(msg => msg.type !== 'system');
        }

        if (activeFilter === 'all') {
            return messages;
        }

        return messages.filter(msg => msg.type === activeFilter);
    }, [gameState.messageLog, activeFilter, isDevModeActive]);

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[2800] transition-opacity duration-300 ${isMessageCenterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => popups.setIsMessageCenterOpen(false)}
            ></div>
            
            <div className={panelClasses}>
                <div className="flex-shrink-0 p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                    <h2 className="text-lg text-[var(--text-header)] font-bold">Centre de Messages</h2>
                    <button onClick={() => popups.setIsMessageCenterOpen(false)} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
                </div>

                {/* Filter Bar */}
                <div className="flex-shrink-0 p-2 border-b border-[var(--border-color)] flex flex-wrap gap-1">
                    {availableFilters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-2 py-1 text-xs rounded transition-colors ${
                                activeFilter === filter
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                        >
                            {filterLabels[filter]}
                        </button>
                    ))}
                </div>
                
                <div ref={scrollableRef} className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center text-gray-400 p-8">Aucun message pour ce filtre.</div>
                    ) : (
                        filteredMessages.map(msg => <MessageItem key={msg.id} notification={msg} />)
                    )}
                </div>
            </div>
        </>
    );
};

export default MessageCenter;