import React from 'react';

interface DevPanelProps {
    addEnergy: () => void;
    addAscension: () => void;
    unlockAllUpgrades: () => void;
    unlockAllAchievements: () => void;
    resetAchievements: () => void;
    closePanel: () => void;
}

const DevPanel: React.FC<DevPanelProps> = ({ 
    addEnergy, 
    addAscension, 
    unlockAllUpgrades,
    unlockAllAchievements, 
    resetAchievements,
    closePanel
}) => {
    const buttonStyle = "w-full text-left p-1.5 bg-gray-700 hover:bg-gray-600 transition-colors my-0.5 rounded text-xs";

    return (
        <div className="fixed top-2 left-2 bg-black/80 border border-green-500 text-green-400 p-2 rounded-lg shadow-lg z-[9999] w-48 font-mono">
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm">DEV PANEL</h3>
                <button onClick={closePanel} className="text-sm hover:text-red-500">X</button>
            </div>
            <div className="flex flex-col">
                <button onClick={addEnergy} className={buttonStyle}>Max Énergie pour Ascension</button>
                <button onClick={addAscension} className={buttonStyle}>+10 Ascension Pts</button>
                <button onClick={unlockAllUpgrades} className={buttonStyle}>+10 All Upgrades</button>
                <button onClick={unlockAllAchievements} className={buttonStyle}>Unlock All Achievements</button>
                <button onClick={resetAchievements} className={buttonStyle}>Reset Achievements</button>
            </div>
        </div>
    );
};

export default DevPanel;