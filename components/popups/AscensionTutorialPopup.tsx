import React from 'react';
import Popup from './Popup';

interface AscensionTutorialPopupProps {
    onClose: () => void;
}

const AscensionTutorialPopup: React.FC<AscensionTutorialPopupProps> = ({ onClose }) => {
    return (
        <Popup title="✨ Ascension Possible !" onClose={onClose} widthClass="w-80">
            <div className="space-y-2 text-xs">
                <p>Félicitations ! Vous avez atteint votre capacité d'énergie maximale.</p>
                <p>Vous pouvez maintenant faire une <strong className="text-purple-400">Ascension</strong>. Cela réinitialise votre progression mais vous octroie des <strong className="text-yellow-400">Points d'Ascension</strong> pour des bonus permanents.</p>
                <p className="text-[10px] opacity-80">Ouvrez le menu d'Ascension pour voir les conditions.</p>
                <button onClick={onClose} className="w-full bg-blue-600 text-white mt-2 px-4 py-2 rounded">Compris !</button>
            </div>
        </Popup>
    );
};

export default AscensionTutorialPopup;