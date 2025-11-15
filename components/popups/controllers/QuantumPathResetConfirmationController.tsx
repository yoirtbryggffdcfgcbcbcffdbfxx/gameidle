import React from 'react';
import { useGameContext } from '../../../contexts/GameContext';
import ConfirmationPopup from '../ConfirmationPopup';
import { QUANTUM_PATHS } from '../../../data/quantumPaths';

const QuantumPathResetConfirmationController: React.FC = () => {
    const { uiState, popups, handlers, playSfx, gameState } = useGameContext();
    const { showQuantumPathResetConfirm } = uiState;

    if (!showQuantumPathResetConfirm) {
        return null;
    }

    const { chosenQuantumPath, quantumPathLevel } = gameState;
    
    let totalCostRefund = 0;
    if (chosenQuantumPath && quantumPathLevel > 0) {
        const pathData = QUANTUM_PATHS[chosenQuantumPath];
        totalCostRefund = pathData.upgrades
            .filter(u => u.level <= quantumPathLevel)
            .reduce((sum, u) => sum + u.cost, 0);
    }
    
    return (
        <ConfirmationPopup
            show={true}
            title="Réinitialiser la Voie Quantique ?"
            message={`Vous allez récupérer ${totalCostRefund} Fragment(s) Quantique(s). Cette action est irréversible pour cette Ascension. Continuer ?`}
            onConfirm={handlers.onConfirmResetQuantumPath}
            onCancel={() => { playSfx('click'); popups.setShowQuantumPathResetConfirm(false); }}
        />
    );
};

export default QuantumPathResetConfirmationController;