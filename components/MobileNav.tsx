import React from 'react';

interface MobileNavProps {
    activeTab: 'core' | 'upgrades';
    setActiveTab: (tab: 'core' | 'upgrades') => void;
    onMenuClick: () => void;
    canAscend: boolean;
    ascensionLevel: number;
}

const NavButton = ({ icon, label, onClick, isActive, id }: { icon: string; label: string; onClick: () => void; isActive: boolean; id?: string; }) => (
    <button id={id} onClick={onClick} className={`flex flex-col items-center justify-center gap-1 p-1 w-full text-xs rounded-lg transition-colors ${isActive ? 'text-cyan-300' : 'text-gray-400 hover:bg-white/5'}`}>
        <span className="text-2xl">{icon}</span>
        <span>{label}</span>
    </button>
);


const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, onMenuClick, canAscend, ascensionLevel }) => {
    const menuButtonClasses = canAscend
        ? 'text-yellow-300 bg-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.7)] animate-pulse'
        : 'text-gray-400 hover:bg-white/5';

    return (
        <nav className="bg-black/50 p-1 flex items-center justify-around gap-2 w-full mt-auto border-t border-gray-700">
             <NavButton icon="⚡" label="Cœur" onClick={() => setActiveTab('core')} isActive={activeTab === 'core'} />
             <NavButton id="mobile-upgrades-tab" icon="🚀" label="Améliorations" onClick={() => setActiveTab('upgrades')} isActive={activeTab === 'upgrades'} />
            <button onClick={onMenuClick} className={`flex flex-col items-center justify-center gap-1 p-1 w-full text-xs rounded-lg transition-colors relative ${menuButtonClasses}`}>
                <span className="text-2xl">☰</span>
                <span>Menu</span>
            </button>
        </nav>
    );
};

export default MobileNav;