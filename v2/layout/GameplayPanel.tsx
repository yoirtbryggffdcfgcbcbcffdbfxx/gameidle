import React from 'react';
import { QuantumReactor } from '../features/core/components/QuantumReactor';
import { PlasmaDisplay } from '../features/resources/components/PlasmaDisplay';
import { CoreButton } from '../features/clicker/components/CoreButton';
import Logo from '../../components/Logo';
import { Atmosphere } from './components/Atmosphere';

export const GameplayPanel: React.FC = React.memo(() => {
    return (
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-[#0a0a1a] to-black border-r border-white/5">
            
            {/* Composant décoratif isolé */}
            <Atmosphere />

            <div className="relative z-10 flex-grow flex flex-col items-center justify-between p-4 md:p-6 h-full">
                
                {/* TOP: Logo & Reactor */}
                <div className="flex flex-col items-center justify-center flex-grow min-h-0 relative w-full">
                    <div className="mb-4 scale-75 md:scale-90 opacity-90">
                        <Logo />
                    </div>

                    <div className="relative my-4">
                        {/* Halo local du réacteur */}
                        <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full animate-pulse-slow pointer-events-none"></div>
                        <QuantumReactor />
                    </div>
                </div>

                {/* BOTTOM: Control Deck */}
                <div className="w-full max-w-lg space-y-4 pt-4 border-t border-white/5 bg-gradient-to-t from-black/80 to-transparent rounded-t-xl px-4 pb-4">
                    <PlasmaDisplay />
                    <CoreButton />
                </div>
            </div>
        </div>
    );
});