import React from 'react';
import { useGameSelector } from '../../../lib/context';

// Ce composant est maintenant autonome. Il n'a plus besoin de props.
export const EnergyDisplay: React.FC = React.memo(() => {
    // Sélection atomique de la donnée
    const energy = useGameSelector(state => Math.floor(state.resources.energy));

    return (
        <div className="p-4 bg-gray-900 border border-cyan-500 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.3)] text-center min-w-[200px]">
            <div className="text-xs text-cyan-400 uppercase tracking-widest mb-1">Énergie Quantique</div>
            <div className="text-3xl font-mono font-bold text-white">
                {energy.toLocaleString()} ⚡
            </div>
        </div>
    );
});