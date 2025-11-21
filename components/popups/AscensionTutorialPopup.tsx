
import React from 'react';
import Popup from './Popup';

interface AscensionTutorialPopupProps {
    onClose: () => void;
}

const AscensionTutorialPopup: React.FC<AscensionTutorialPopupProps> = ({ onClose }) => {
    return (
        <Popup title="✨ Limite de Réalité Atteinte" onClose={onClose} widthClass="w-80">
            <div className="space-y-3 text-sm font-mono">
                <p className="text-gray-300">Simulation terminée. L'univers actuel a atteint sa capacité maximale d'entropie.</p>
                <p className="text-gray-300">Le protocole <strong className="text-purple-400">Transcendance (Ascension)</strong> est disponible. Nous devons faire s'effondrer cette réalité pour en extraire les <strong className="text-yellow-400">Points de Données</strong> essentiels.</p>
                <div className="bg-purple-900/20 p-2 rounded border border-purple-500/30 text-xs">
                    <p className="text-purple-300">Cela réinitialisera l'univers, mais vos Points de Données (Ascension) permettront de reconfigurer les constantes physiques pour la prochaine itération.</p>
                </div>
                <button onClick={onClose} className="w-full bg-purple-600 hover:bg-purple-500 text-white mt-2 px-4 py-2 rounded shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all">Compris</button>
            </div>
        </Popup>
    );
};

export default AscensionTutorialPopup;
