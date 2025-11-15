import React from 'react';

interface DevPanelProps {
    addEnergy: () => void;
    addSpecificEnergy: (amount: number) => void;
    addAscension: () => void;
    unlockAllUpgrades: (levels: number) => void;
    unlockAllAchievements: () => void;
    resetAchievements: () => void;
    addSystemMessage: () => void;
    toggleDevMode: () => void;
    isDevModeActive: boolean;
    closePanel: () => void;
    toggleForceShowCursor: () => void;
    isCursorForced: boolean;
    fillCore: () => void;
    addShards: (amount: number) => void;
    unlockShop: () => void;
    unlockCore: () => void;
    unlockBank: () => void;
}

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="text-xs font-bold text-cyan-300 border-b border-cyan-500/30 pb-1 mb-2 uppercase">{title}</h4>
        <div className="flex flex-col gap-1">
            {children}
        </div>
    </div>
);


const DevPanel: React.FC<DevPanelProps> = ({
    addEnergy,
    addSpecificEnergy,
    addAscension,
    unlockAllUpgrades,
    unlockAllAchievements,
    resetAchievements,
    addSystemMessage,
    toggleDevMode,
    isDevModeActive,
    closePanel,
    toggleForceShowCursor,
    isCursorForced,
    fillCore,
    addShards,
    unlockShop,
    unlockCore,
    unlockBank,
}) => {
    const buttonStyle = "w-full text-left p-1.5 bg-gray-800/50 hover:bg-cyan-900/50 transition-colors rounded text-xs border border-transparent hover:border-cyan-500";

    return (
        <div className="fixed top-4 left-4 bg-black/70 backdrop-blur-sm border border-cyan-500/50 text-cyan-400 p-3 rounded-lg shadow-lg z-[9999] w-56 font-mono text-sm">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">DEV PANEL</h3>
                <button onClick={closePanel} className="text-lg hover:text-red-500 transition-colors">&times;</button>
            </div>
            <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                <Section title="Ressources">
                    <button onClick={addEnergy} className={buttonStyle}>Remplir Énergie</button>
                    <button onClick={() => addSpecificEnergy(1e6)} className={buttonStyle}>+1M Énergie</button>
                    <button onClick={() => addSpecificEnergy(1e9)} className={buttonStyle}>+1B Énergie</button>
                    <button onClick={() => addShards(10)} className={buttonStyle}>+10 Fragments</button>
                    <button onClick={fillCore} className={buttonStyle}>Remplir Cœur</button>
                </Section>
                <Section title="Progression">
                    <button onClick={addAscension} className={buttonStyle}>+1 Niv / +10 Pts Asc.</button>
                    <button onClick={() => unlockAllUpgrades(10)} className={buttonStyle}>+10 Niveaux Amélios</button>
                    <button onClick={unlockAllAchievements} className={buttonStyle}>Débloquer Succès</button>
                    <button onClick={resetAchievements} className={buttonStyle}>Réinit. Succès</button>
                </Section>
                <Section title="Déverrouillage">
                    <button onClick={unlockShop} className={buttonStyle}>Débloquer Boutique</button>
                    <button onClick={unlockCore} className={buttonStyle}>Débloquer Cœur</button>
                    <button onClick={unlockBank} className={buttonStyle}>Débloquer Banque</button>
                </Section>
                <Section title="Debug">
                    <button onClick={addSystemMessage} className={buttonStyle}>Msg. Système</button>
                    <button onClick={toggleDevMode} className={buttonStyle}>
                        {isDevModeActive ? 'Cacher' : 'Afficher'} Msgs Système
                    </button>
                    <button onClick={toggleForceShowCursor} className={buttonStyle}>
                        {isCursorForced ? 'Cacher' : 'Afficher'} Curseur
                    </button>
                </Section>
            </div>
        </div>
    );
};

export default DevPanel;