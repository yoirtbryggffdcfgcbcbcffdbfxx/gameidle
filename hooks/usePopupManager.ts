import { useState } from 'react';

export const usePopupManager = () => {
    const [activePopup, setActivePopup] = useState<string | null>(null);
    const [tutorialStep, setTutorialStep] = useState(0); // 0 = off, 1, 2, 3 for steps
    const [showHardResetConfirm, setShowHardResetConfirm] = useState(false);
    const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
    const [showAscensionConfirm, setShowAscensionConfirm] = useState(false);
    const [showAscensionTutorial, setShowAscensionTutorial] = useState(false);
    const [showBankInfoPopup, setShowBankInfoPopup] = useState(false);
    // FIX: Add missing state for Core and Bank tutorials to resolve property access errors.
    const [showCoreTutorial, setShowCoreTutorial] = useState(false);
    const [showBankTutorial, setShowBankTutorial] = useState(false);

    return {
        activePopup,
        tutorialStep,
        showHardResetConfirm,
        showNewGameConfirm,
        showAscensionConfirm,
        showAscensionTutorial,
        showBankInfoPopup,
        showCoreTutorial,
        showBankTutorial,
        setActivePopup,
        setTutorialStep,
        setShowHardResetConfirm,
        setShowNewGameConfirm,
        setShowAscensionConfirm,
        setShowAscensionTutorial,
        setShowBankInfoPopup,
        setShowCoreTutorial,
        setShowBankTutorial,
    };
};