import React from 'react';

interface NavBarProps {
    onMenuClick: (popup: 'ascension' | 'achievements' | 'settings' | 'core') => void;
    ascensionLevel: number;
    canAscend: boolean;
}

const NavButton = ({ icon, label, onClick, highlight = false }: { icon: string; label: string; onClick: () => void; highlight?: boolean; }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 p-2 w-full text-xs rounded-lg hover:bg-white/10 transition-all relative ${highlight ? 'text-yellow-300 bg-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse' : ''}`}>
        <span className="text-2xl">{icon}</span>
        <span>{label}</span>
    </button>
);

const NavBar: React.FC<NavBarProps> = ({ onMenuClick, ascensionLevel, canAscend }) => {
    const showAscensionButton = canAscend || ascensionLevel > 0;
    const showCoreButton = ascensionLevel > 0;

    return (
        <nav className="h-screen bg-black/30 p-2 flex flex-col items-center justify-center gap-2 w-24">
            {showAscensionButton && (
                <NavButton icon="✨" label="Ascension" onClick={() => onMenuClick('ascension')} highlight={canAscend} />
            )}
            {showCoreButton && (
                <NavButton icon="⚛️" label="Réacteur" onClick={() => onMenuClick('core')} />
            )}
            <NavButton icon="🏆" label="Succès" onClick={() => onMenuClick('achievements')} />
            <NavButton icon="⚙️" label="Param." onClick={() => onMenuClick('settings')} />
        </nav>
    );
};

export default NavBar;