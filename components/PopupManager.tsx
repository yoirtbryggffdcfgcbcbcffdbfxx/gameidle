import React from 'react';

// Import all controller components
import AscensionConfirmationController from './popups/controllers/AscensionConfirmationController';
import HardResetConfirmationController from './popups/controllers/HardResetConfirmationController';
import QuantumPathConfirmationController from './popups/controllers/QuantumPathConfirmationController';
import TutorialPopupsController from './popups/controllers/TutorialPopupsController';
import DevPanelController from './popups/controllers/DevPanelController';
import BankInfoPopupController from './popups/controllers/BankInfoPopupController';
import MobileMenuPopup from './popups/MobileMenuPopup';
import QuantumPathResetConfirmationController from './popups/controllers/QuantumPathResetConfirmationController';

const PopupManager: React.FC = () => {
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

            {/* Mobile-specific UI */}
            <MobileMenuPopup />
        </>
    );
};

export default PopupManager;