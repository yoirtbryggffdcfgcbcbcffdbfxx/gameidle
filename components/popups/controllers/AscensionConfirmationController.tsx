import React from 'react';
import { useGameContext } from '../../../contexts/GameContext';
import ConfirmationPopup from '../ConfirmationPopup';

const AscensionConfirmationController: React.FC = () => {
    const { uiState, popups, handlers, computedState, playSfx } = useGameContext();

    if (!uiState.showAscensionConfirm) {
        return null;
    }

    return (
        <ConfirmationPopup
            show={true}
            title="Confirmer l'Ascension"
            message={`Vous êtes sur le point de réinitialiser votre progression pour gagner ${computedState.ascensionGain} point d'ascension. Continuer ?`}
            onConfirm={handlers.onConfirmAscension}
            onCancel={() => { playSfx('click'); popups.setShowAscensionConfirm(false); }}
        />
    );
};

export default AscensionConfirmationController;