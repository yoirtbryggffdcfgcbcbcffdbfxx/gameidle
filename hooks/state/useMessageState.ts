
import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GameState, Notification, Achievement } from '../../types';

type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;

export const useMessageState = (setGameState: SetGameStateFn) => {
    
    const addMessage = useCallback((
        message: string,
        type: Notification['type'],
        options: { title?: string; achievement?: Achievement } = {}
    ) => {
        setGameState(prev => {
            const newMessage: Notification = {
                id: uuidv4(),
                timestamp: Date.now(),
                read: false,
                message,
                type,
                title: options.title,
                achievement: options.achievement
            };
            // Garder les 100 derniers messages
            const newMessageLog = [newMessage, ...prev.messageLog].slice(0, 100);
            return { ...prev, messageLog: newMessageLog };
        });
    }, [setGameState]);

    const markAllMessagesAsRead = useCallback(() => {
        setGameState(prev => {
            if (prev.messageLog.every(m => m.read)) return prev;
            const newLog = prev.messageLog.map(m => ({ ...m, read: true }));
            return { ...prev, messageLog: newLog };
        });
    }, [setGameState]);

    return {
        actions: {
            addMessage,
            markAllMessagesAsRead
        }
    };
};
