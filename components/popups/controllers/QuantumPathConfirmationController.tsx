import React from 'react';
import { useGameContext } from '../../../contexts/GameContext';
import ConfirmationPopup from '../ConfirmationPopup';
import { QUANTUM_PATHS } from '../../../data/quantumPaths';

const QuantumPathConfirmationController: React.FC = () => {
    const { uiState, popups, handlers, playSfx } = useGameContext();
    const { pathChoiceToConfirm, showQuantumPathConfirm } = uiState;

    if (!showQuantumPathConfirm || !pathChoiceToConfirm) {
        return null;
    }

    return (
        <ConfirmationPopup
            show={true}
            title={`Choisir la Voie du ${QUANTUM_PATHS[pathChoiceToConfirm].name} ?`}
            message="Ce choix est permanent pour cette Ascension et définira la manière dont votre Cœur Quantique évoluera. Êtes-vous sûr ?"
            onConfirm={handlers.onConfirmQuantumPath}
            onCancel={() => { playSfx('click'); popups.setShowQuantumPathConfirm(false); }}
        />
    );
};

export default QuantumPathConfirmationController;