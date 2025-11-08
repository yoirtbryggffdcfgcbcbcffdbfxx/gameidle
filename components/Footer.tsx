// FIX: This file was created to resolve module not found errors.
import React from 'react';

interface FooterProps {
    onMenuClick: (popup: 'ascension' | 'achievements' | 'settings' | 'core') => void;
    ascensionCount: number;
}

const Footer: React.FC<FooterProps> = ({ onMenuClick, ascensionCount }) => {
    return (
        <footer className="grid grid-cols-4 items-center p-1 border-t border-[var(--border-color)] bg-[var(--bg-main)]">
            <div className="text-xs opacity-80 text-center">
                Asc.: <span className="font-bold text-yellow-400">{ascensionCount}</span>
            </div>
            <button onClick={() => onMenuClick('ascension')} className="p-2 text-xs md:text-sm rounded-md hover:bg-white/10 transition-colors">✨ Ascension</button>
            <button onClick={() => onMenuClick('core')} className="p-2 text-xs md:text-sm rounded-md hover:bg-white/10 transition-colors">⚛️ Réacteur</button>
            <button onClick={() => onMenuClick('achievements')} className="p-2 text-xs md:text-sm rounded-md hover:bg-white/10 transition-colors">🏆 Succès</button>
            {/* Hiding settings to make space, can be re-added if layout changes */}
            {/* <button onClick={() => onMenuClick('settings')} className="p-2 rounded-md hover:bg-white/10 transition-colors">⚙️</button> */}
        </footer>
    );
};

export default Footer;