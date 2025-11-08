import React from 'react';

type PopupType = 'prestige' | 'achievements' | 'settings';

interface FooterProps {
    onMenuClick: (popup: PopupType) => void;
}

const Footer: React.FC<FooterProps> = ({ onMenuClick }) => {
    return (
        <footer className="fixed bottom-0 left-0 w-full flex justify-around bg-black/50 py-2 backdrop-blur-sm">
            <button onClick={() => onMenuClick('prestige')} className="px-3 py-2 rounded-md bg-purple-600 hover:bg-purple-500 transition-colors">✨ Prestige</button>
            <button onClick={() => onMenuClick('achievements')} className="px-3 py-2 rounded-md bg-yellow-600 hover:bg-yellow-500 transition-colors">🏆 Succès</button>
            <button onClick={() => onMenuClick('settings')} className="px-3 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">⚙ Paramètres</button>
        </footer>
    );
};

export default Footer;
