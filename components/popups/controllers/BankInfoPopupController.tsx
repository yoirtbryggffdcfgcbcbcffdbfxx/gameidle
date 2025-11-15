import React from 'react';
import { useGameContext } from '../../../contexts/GameContext';
import BankInfoPopup from '../BankInfoPopup';

const BankInfoPopupController: React.FC = () => {
    const { uiState, popups } = useGameContext();

    if (!uiState.showBankInfoPopup) {
        return null;
    }

    return (
        <BankInfoPopup onClose={() => popups.setShowBankInfoPopup(false)} />
    );
};

export default BankInfoPopupController;