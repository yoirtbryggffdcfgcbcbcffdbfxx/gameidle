import React from 'react';
import { useGameContext } from '../../../contexts/GameContext';
import AscensionTutorialPopup from '../AscensionTutorialPopup';
import CoreTutorialPopup from '../CoreTutorialPopup';
import BankTutorialPopup from '../BankTutorialPopup';
import ShopTutorialPopup from '../ShopTutorialPopup';
import { BANK_UNLOCK_TOTAL_ENERGY } from '../../../data/bank';

const TutorialPopupsController: React.FC = () => {
    const { gameState, uiState, popups } = useGameContext();
    const { energy } = gameState;
    const { showAscensionTutorial, showCoreTutorial, showBankTutorial, showShopTutorial } = uiState;
    const { setShowAscensionTutorial, setShowCoreTutorial, setShowBankTutorial, setShowShopTutorial } = popups;

    const showBankSection = energy >= BANK_UNLOCK_TOTAL_ENERGY;

    return (
        <>
            {showAscensionTutorial && <AscensionTutorialPopup onClose={() => setShowAscensionTutorial(false)} />}
            {showShopTutorial && <ShopTutorialPopup onClose={() => setShowShopTutorial(false)} />}
            {showCoreTutorial && <CoreTutorialPopup onClose={() => setShowCoreTutorial(false)} />}
            {showBankTutorial && showBankSection && <BankTutorialPopup onClose={() => setShowBankTutorial(false)} />}
        </>
    );
};

export default TutorialPopupsController;