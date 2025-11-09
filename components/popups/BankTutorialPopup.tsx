import React from 'react';
import Popup from './Popup';

interface BankTutorialPopupProps {
    onClose: () => void;
}

const BankTutorialPopup: React.FC<BankTutorialPopupProps> = ({ onClose }) => {
    return (
        <Popup title="💰 Conglomérat Bancaire Intergalactique" onClose={onClose} widthClass="w-96">
            <div className="space-y-3 text-sm">
                <p>Félicitations ! Votre production d'énergie a attiré l'attention du <strong className="text-yellow-400">Conglomérat Bancaire</strong>.</p>
                <p>Vous avez maintenant accès à la section <strong className="text-cyan-400">Banque</strong>. Utilisez-la pour épargner votre énergie et gagner des intérêts, ou pour contracter des prêts pour une croissance rapide.</p>
                <p className="text-xs opacity-80">La gestion financière est une nouvelle clé de votre succès. Utilisez-la sagement.</p>
                <button onClick={onClose} className="w-full bg-blue-600 text-white mt-3 px-4 py-2 rounded">J'ai compris !</button>
            </div>
        </Popup>
    );
};

export default BankTutorialPopup;
