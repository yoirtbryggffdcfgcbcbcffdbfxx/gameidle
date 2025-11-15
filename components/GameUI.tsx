import React, { useEffect } from 'react';

// Hooks
import { useGameContext } from '../contexts/GameContext';

// Components
import FlowingParticle from './ui/FlowingParticle';
import FloatingText from './ui/FloatingText';
import PopupManager from './PopupManager';
import ViewManager from './ViewManager';
import MessageCenterButton from './messages/MessageCenterButton';
import MessageCenter from './messages/MessageCenter';
import ToastManager from './messages/ToastManager';

const GameUI: React.FC = () => {
    const { 
        uiState, 
        removeParticle, 
        removeFloatingText,
    } = useGameContext();

    const { settings, particles, floatingTexts, forceShowCursor } = uiState;

    useEffect(() => {
        document.body.classList.toggle('force-show-cursor', forceShowCursor);
    }, [forceShowCursor]);
    
    return (
        <>
            {/* Global effects render on top of everything */}
            {particles.map(p => <FlowingParticle key={p.id} {...p} animSpeed={settings.animSpeed} onComplete={removeParticle} />)}
            {floatingTexts.map(ft => <FloatingText key={ft.id} {...ft} onComplete={removeFloatingText} />)}
            
            {/* New Message System */}
            <MessageCenterButton />
            <MessageCenter />
            <ToastManager />

            {/* ViewManager now handles which main interface is shown */}
            <ViewManager />
            
            {/* PopupManager is truly global and renders on top of views */}
            <PopupManager />
        </>
    );
};

export default GameUI;