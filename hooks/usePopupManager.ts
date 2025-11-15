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
    const [showShopTutorial, setShowShopTutorial] = useState(false);
    const [showDevPanel, setShowDevPanel] = useState(false);
    // FIX: Add state for the quantum path confirmation popup to centralize popup state management.
    const [showQuantumPathConfirm, setShowQuantumPathConfirm] = useState(false);
    const [showQuantumPathResetConfirm, setShowQuantumPathResetConfirm] = useState(false);
    const [activeMobilePopup, setActiveMobilePopup] = useState<'achievements' | 'shop' | 'settings' | null>(null);
    const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);
    const [isDevModeActive, setIsDevModeActive] = useState(false);
    const [forceShowCursor, setForceShowCursor] = useState(false);


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
        showShopTutorial,
        showDevPanel,
        showQuantumPathConfirm,
        showQuantumPathResetConfirm,
        activeMobilePopup,
        isMessageCenterOpen,
        isDevModeActive,
        forceShowCursor,
        setActivePopup,
        setTutorialStep,
        setShowHardResetConfirm,
        setShowNewGameConfirm,
        setShowAscensionConfirm,
        setShowAscensionTutorial,
        setShowBankInfoPopup,
        setShowCoreTutorial,
        setShowBankTutorial,
        setShowShopTutorial,
        setShowDevPanel,
        setShowQuantumPathConfirm,
        setShowQuantumPathResetConfirm,
        setActiveMobilePopup,
        setIsMessageCenterOpen,
        setIsDevModeActive,
        setForceShowCursor,
    };
};