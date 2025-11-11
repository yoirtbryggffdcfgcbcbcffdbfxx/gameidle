import React from 'react';
import Popup from './Popup';

interface ShopTutorialPopupProps {
    onClose: () => void;
}

const ShopTutorialPopup: React.FC<ShopTutorialPopupProps> = ({ onClose }) => {
    return (
        <Popup title="🛍️ Boutique Débloquée !" onClose={onClose} widthClass="w-72">
            <div className="space-y-2 text-xs">
                <p>Félicitations ! Vous avez débloqué la <strong className="text-yellow-400">Boutique</strong>.</p>
                <p className="opacity-90">Achetez-y des améliorations permanentes qui persistent même après une Ascension.</p>
                <p className="text-[10px] opacity-70">Prochain objectif : le <strong className="text-cyan-400">Cœur Quantique</strong> !</p>
                <button onClick={onClose} className="w-full bg-blue-600 text-white mt-2 px-3 py-1.5 rounded text-xs">Compris !</button>
            </div>
        </Popup>
    );
};

export default ShopTutorialPopup;