
import React from 'react';
import { GameProvider, useGameSelector, useGameDispatch } from './lib/context';
import { useGameLoop } from './hooks/useGameLoop';
import { useDeviceLayout } from './hooks/useDeviceLayout';
import { selectEffectiveProduction } from './lib/selectors';

// Layout Components
import { GameBackground } from './layout/GameBackground';
import { GameHeader } from './layout/GameHeader';
import { GameplayPanel } from './layout/GameplayPanel';
import { ManagementPanel } from './layout/ManagementPanel';
import { VisualEffectsLayer } from './features/ui/components/VisualEffectsLayer';
import { MobileNavBar } from './layout/MobileNavBar';

interface RefactorGameProps {
    onBack: () => void;
}

const GameLayout: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const dispatch = useGameDispatch();
    const effectiveProduction = useGameSelector(selectEffectiveProduction);
    const { isMobile, activeMobileTab } = useGameSelector(state => ({
        isMobile: state.ui.isMobile,
        activeMobileTab: state.ui.activeMobileTab
    }));

    // Activation des systèmes globaux
    useGameLoop(dispatch, effectiveProduction);
    useDeviceLayout();

    return (
        <div className="fixed inset-0 bg-[#0a0a1a] text-white font-mono flex flex-col overflow-hidden">
            <GameBackground />
            <VisualEffectsLayer />

            <GameHeader onBack={onBack} />

            <div className="relative z-10 flex-grow flex flex-col md:flex-row overflow-hidden">
                {/* Logique d'affichage conditionnelle pour Mobile vs Desktop */}
                {isMobile ? (
                    <>
                        <div className={`flex-grow flex flex-col overflow-hidden ${activeMobileTab === 'REACTOR' ? 'block' : 'hidden'}`}>
                            <GameplayPanel />
                        </div>
                        <div className={`flex-grow flex flex-col overflow-hidden ${activeMobileTab === 'FORGE' ? 'block' : 'hidden'}`}>
                            <ManagementPanel />
                        </div>
                    </>
                ) : (
                    // Desktop : Affichage Split Screen
                    <>
                        <GameplayPanel />
                        <ManagementPanel />
                    </>
                )}
            </div>

            {/* Barre de navigation uniquement sur mobile */}
            {isMobile && <MobileNavBar />}
        </div>
    );
};

const RefactorGame: React.FC<RefactorGameProps> = ({ onBack }) => {
    return (
        <GameProvider>
            <GameLayout onBack={onBack} />
        </GameProvider>
    );
};

export default RefactorGame;
