import React from 'react';
import { useGameContext } from '../../../contexts/GameContext';
import ConfirmationPopup from '../ConfirmationPopup';

const HardResetConfirmationController: React.FC = () => {
    const { uiState, popups, handlers, playSfx } = useGameContext();

    if (!uiState.showHardResetConfirm) {
        return null;
    }

    return (
        <ConfirmationPopup
            show={true}
            title="Confirmer la réinitialisation"
            message="Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible."
            onConfirm={handlers.onConfirmHardReset}
            onCancel={() => { playSfx('click'); popups.setShowHardResetConfirm(false); }}
        />
    );
};

export default HardResetConfirmationController;