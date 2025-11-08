import React from 'react';
import Popup from './Popup';

interface CoreTutorialPopupProps {
    onClose: () => void;
}

const CoreTutorialPopup: React.FC<CoreTutorialPopupProps> = ({ onClose }) => {
    return (
        <Popup title="⚛️ Le Cœur Quantique S'éveille !" onClose={onClose} widthClass="w-96">
            <div className="space-y-3 text-sm">
                <p>En concentrant une telle quantité d'énergie, vous avez stabilisé une singularité de poche : le <strong className="text-cyan-400">Cœur Quantique</strong>.</p>
                <p>Il se charge passivement avec le temps. Une fois plein, activez-le pour <strong className="text-purple-400">surcharger votre production d'énergie</strong> pendant un court instant !</p>
                <p className="text-xs opacity-80">Utilisez-le stratégiquement pour franchir les paliers de coût les plus difficiles. Vous pourrez l'améliorer après votre première Ascension.</p>
                <button onClick={onClose} className="w-full bg-blue-600 text-white mt-3 px-4 py-2 rounded">Déchaîner la puissance !</button>
            </div>
        </Popup>
    );
};

export default CoreTutorialPopup;