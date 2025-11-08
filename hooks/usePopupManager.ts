import { useState } from 'react';

export const usePopupManager = () => {
    const [activePopup, setActivePopup] = useState<string | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showHardResetConfirm, setShowHardResetConfirm] = useState(false);
    const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
    const [showPrestigeConfirm, setShowPrestigeConfirm] = useState(false);

    return {
        activePopup,
        showTutorial,
        showHardResetConfirm,
        showNewGameConfirm,
        showPrestigeConfirm,
        setActivePopup,
        setShowTutorial,
        setShowHardResetConfirm,
        setShowNewGameConfirm,
        setShowPrestigeConfirm,
    };
};