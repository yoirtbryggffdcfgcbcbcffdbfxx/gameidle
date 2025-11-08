// FIX: This file was created to resolve module not found errors.
import React from 'react';

interface FooterProps {
    onMenuClick: (popup: 'prestige' | 'achievements' | 'settings') => void;
}

const Footer: React.FC<FooterProps> = ({ onMenuClick }) => {
    return (
        <footer className="flex justify-around items-center p-2 border-t border-[var(--border-color)] bg-[var(--bg-main)]">
            <button onClick={() => onMenuClick('prestige')} className="p-2 rounded-md hover:bg-white/10 transition-colors">✨ Prestige</button>
            <button onClick={() => onMenuClick('achievements')} className="p-2 rounded-md hover:bg-white/10 transition-colors">🏆 Succès</button>
            <button onClick={() => onMenuClick('settings')} className="p-2 rounded-md hover:bg-white/10 transition-colors">⚙️ Paramètres</button>
        </footer>
    );
};

export default Footer;
