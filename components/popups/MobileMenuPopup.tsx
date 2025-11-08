import React from 'react';

type PopupType = 'ascension' | 'achievements' | 'settings' | 'core';

interface MobileMenuPopupProps {
    onClose: () => void;
    onMenuClick: (popup: PopupType) => void;
    canAscend: boolean;
    ascensionLevel: number;
}

const MenuButton = ({ icon, label, onClick, highlight = false, disabled = false }: { icon: string; label: string; onClick: () => void; highlight?: boolean; disabled?: boolean }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className={`flex items-center gap-4 p-4 w-full text-lg rounded-lg transition-all relative
        ${disabled 
            ? 'bg-white/5 text-gray-500 cursor-not-allowed'
            : 'bg-white/10 text-white hover:bg-white/20'
        }
        ${highlight ? 'text-yellow-300 bg-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse' : ''}`}
    >
        <span className="text-3xl w-8 text-center">{icon}</span>
        <span>{label}</span>
    </button>
);

const MobileMenuPopup: React.FC<MobileMenuPopupProps> = ({ onClose, onMenuClick, canAscend, ascensionLevel }) => {
    const showAscensionButton = canAscend || ascensionLevel > 0;
    const showCoreButton = ascensionLevel > 0;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col p-4 z-[1000] animate-fade-in-fast">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl text-cyan-300">Menu</h2>
                <button onClick={onClose} className="text-4xl text-white hover:text-red-500 transition-colors">&times;</button>
            </div>
            
            <div className="flex flex-col gap-3">
                <MenuButton icon="✨" label="Ascension" onClick={() => onMenuClick('ascension')} highlight={canAscend} disabled={!showAscensionButton} />
                <MenuButton icon="⚛️" label="Réacteur" onClick={() => onMenuClick('core')} disabled={!showCoreButton} />
                <MenuButton icon="🏆" label="Succès" onClick={() => onMenuClick('achievements')} />
                <MenuButton icon="⚙️" label="Paramètres" onClick={() => onMenuClick('settings')} />
            </div>
        </div>
    );
};

export default MobileMenuPopup;