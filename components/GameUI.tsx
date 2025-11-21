import React from 'react';

// Hooks
import { useGameContext } from '../contexts/GameContext';

// Components
import FlowingParticle from './ui/FlowingParticle';
import FloatingText from './ui/FloatingText';
import PopupManager from './PopupManager';
import ViewManager from './ViewManager';
import MessageCenterButton from './messages/MessageCenterButton';
import MessageCenter from './messages/MessageCenter';
// ToastManager is now in App.tsx to be global

const GameUI: React.FC = () => {
    const { 
        uiState, 
        removeParticle, 
        removeFloatingText,
    } = useGameContext();

    const { settings, particles, floatingTexts } = uiState;
    
    return (
        <>
            {/* Global effects render on top of everything */}
            {particles.map(p => <FlowingParticle key={p.id} {...p} animSpeed={settings.animSpeed} onComplete={removeParticle} />)}
            {floatingTexts.map(ft => <FloatingText key={ft.id} {...ft} onComplete={removeFloatingText} />)}
            
            {/* New Message System */}
            <MessageCenterButton />
            <MessageCenter />
            {/* ToastManager is rendered in App.tsx */}

            {/* ViewManager now handles which main interface is shown */}
            <ViewManager />
            
            {/* PopupManager is truly global and renders on top of views */}
            <PopupManager />
        </>
    );
};

export default GameUI;