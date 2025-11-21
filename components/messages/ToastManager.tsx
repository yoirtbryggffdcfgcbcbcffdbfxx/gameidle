import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../../contexts/GameContext';

const ToastManager: React.FC = () => {
    const { gameState, popups } = useGameContext();
    const { messageLog } = gameState;
    const { isMessageCenterOpen, setIsMessageCenterOpen } = popups;

    const [newMessages, setNewMessages] = useState<number>(0);
    const [isVisible, setIsVisible] = useState(false);
    const prevLogLengthRef = useRef(messageLog.length);
    const timerRef = useRef<number | null>(null);

    // 1. Gestion de l'arrivée de nouveaux messages
    useEffect(() => {
        if (messageLog.length > prevLogLengthRef.current) {
            const newCount = messageLog.length - prevLogLengthRef.current;
            setNewMessages(prev => prev + newCount);
            setIsVisible(true);

            // Si un timer existait déjà, on le réinitialise
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            
            timerRef.current = window.setTimeout(() => {
                setIsVisible(false);
                // Réinitialiser le compteur après l'animation
                setTimeout(() => setNewMessages(0), 300);
            }, 4000); 
        }
        
        prevLogLengthRef.current = messageLog.length;
    }, [messageLog]);

    // 2. Gestion de l'ouverture du panneau
    useEffect(() => {
        if (isMessageCenterOpen) {
            setIsVisible(false);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            setNewMessages(0);
        }
    }, [isMessageCenterOpen]);

    // 3. Cleanup global pour éviter les timers fantômes
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleToastClick = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsVisible(false);
        setNewMessages(0);
        setIsMessageCenterOpen(true);
    };

    const animationClass = isVisible ? 'animate-toast-in' : 'animate-toast-out';

    // Rendu conditionnel strict : si pas visible et pas de message, on ne rend rien
    // sauf si l'animation de sortie est en cours (gérée par le délai de 300ms plus haut)
    if (newMessages === 0 && !isVisible) {
        return null;
    }

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[6000] pointer-events-none">
            <button
                onClick={handleToastClick}
                className={`w-64 p-2 rounded-lg border-l-4 shadow-2xl overflow-hidden pointer-events-auto
                            border-cyan-400 bg-gradient-to-br from-blue-900 to-black ${animationClass}`}
            >
                <div className="flex items-center">
                    <span className="text-lg mr-2">📨</span>
                    <div className="text-left">
                        <h4 className="font-bold text-xs leading-tight text-cyan-400">Nouveau Message</h4>
                        <p className="text-white text-xs leading-tight mt-0.5">
                            {newMessages > 1 ? `Vous avez ${newMessages} nouveaux messages.` : 'Vous avez un nouveau message.'}
                        </p>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default ToastManager;