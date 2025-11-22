import React from 'react';
import { useGameSelector } from '../../../lib/context';
import { UpgradeCard } from './UpgradeCard';
import { selectVisibleUpgrades } from '../selectors';

export const UpgradeList: React.FC = React.memo(() => {
    // Le composant ne sait plus COMMENT filtrer, il demande juste les upgrades filtrés.
    const upgrades = useGameSelector(selectVisibleUpgrades);

    if (upgrades.length === 0) {
        return (
            <div className="w-full py-10 text-center text-gray-500 text-xs font-mono border border-dashed border-gray-800 rounded">
                AUCUN SYSTÈME DANS CETTE CATÉGORIE
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto pr-1">
            {upgrades.map(u => (
                <UpgradeCard key={u.id} u={u} />
            ))}

            {/* Spacer pour le scroll */}
            <div className="h-12"></div>
        </div>
    );
});