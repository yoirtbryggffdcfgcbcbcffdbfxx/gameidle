
import React from 'react';
import Popup from './Popup';

interface CoreTutorialPopupProps {
    onClose: () => void;
}

const CoreTutorialPopup: React.FC<CoreTutorialPopupProps> = ({ onClose }) => {
    return (
        <Popup title="⚛️ Singularité Stabilisée" onClose={onClose} widthClass="w-96">
            <div className="space-y-3 text-sm font-mono">
                <p className="text-gray-300">La densité énergétique locale a atteint le seuil critique. Une micro-singularité s'est formée : le <strong className="text-cyan-400">Cœur Quantique</strong>.</p>
                <p className="text-gray-300">Il accumule passivement de la matière noire. Une fois sa charge à 100%, vous pouvez initier une <strong className="text-purple-400">Surcharge Harmonique</strong>.</p>
                <div className="bg-black/30 p-2 rounded border-l-2 border-purple-500">
                    <p className="text-xs text-purple-300">EFFET : Multiplie massivement toute la production d'énergie pendant une courte durée.</p>
                </div>
                <p className="text-[10px] opacity-70">Utilisez cette puissance pour briser les barrières de coût les plus résistantes.</p>
                <button onClick={onClose} className="w-full bg-purple-900/50 border border-purple-500 hover:bg-purple-800 text-purple-200 mt-3 px-4 py-2 rounded uppercase tracking-widest transition-all">Initialiser Surcharge</button>
            </div>
        </Popup>
    );
};

export default CoreTutorialPopup;
