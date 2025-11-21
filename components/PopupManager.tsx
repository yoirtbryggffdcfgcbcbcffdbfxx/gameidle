
import React from 'react';
import { useGameContext } from '../contexts/GameContext';

// Import all controller components
import AscensionConfirmationController from './popups/controllers/AscensionConfirmationController';
import HardResetConfirmationController from './popups/controllers/HardResetConfirmationController';
import QuantumPathConfirmationController from './popups/controllers/QuantumPathConfirmationController';
import TutorialPopupsController from './popups/controllers/TutorialPopupsController';
import DevPanelController from './popups/controllers/DevPanelController';
import BankInfoPopupController from './popups/controllers/BankInfoPopupController';
import MobileMenuPopup from './popups/MobileMenuPopup';
import QuantumPathResetConfirmationController from './popups/controllers/QuantumPathResetConfirmationController';
import GiftPopup from './popups/GiftPopup';

const PopupManager: React.FC = () => {
    const { uiState, popups } = useGameContext();
    
    return (
        <>
            {/* Confirmation Popups */}
            <AscensionConfirmationController />
            <HardResetConfirmationController />
            <QuantumPathConfirmationController />
            <QuantumPathResetConfirmationController />
            
            {/* Tutorial & Info Popups */}
            <TutorialPopupsController />
            <BankInfoPopupController />
            
            {/* Utility Popups */}
            <DevPanelController />
            
            {/* Gift Popup */}
            {uiState.showGiftPopup && <GiftPopup onClose={() => popups.setShowGiftPopup(false)} />}

            {/* Mobile-specific UI */}
            <MobileMenuPopup />
        </>
    );
};

export default PopupManager;
