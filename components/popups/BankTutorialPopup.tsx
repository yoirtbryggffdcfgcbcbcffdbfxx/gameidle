
import React from 'react';
import Popup from './Popup';

interface BankTutorialPopupProps {
    onClose: () => void;
}

const BankTutorialPopup: React.FC<BankTutorialPopupProps> = ({ onClose }) => {
    return (
        <Popup title="⏳ Anomalie Temporelle Détectée" onClose={onClose} widthClass="w-96">
            <div className="space-y-3 text-sm font-mono">
                <p className="text-gray-300">Architecte, votre production d'énergie courbe l'espace-temps. Cela nous permet de construire un <strong className="text-green-400">Coffre Temporel</strong>.</p>
                <p className="text-gray-300">Ce module permet deux opérations critiques :</p>
                <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
                    <li><strong className="text-green-400">Stase :</strong> Stockez l'énergie hors du temps pour générer des intérêts passifs.</li>
                    <li><strong className="text-cyan-400">Paradoxe (Prêt) :</strong> Empruntez de l'énergie à votre "Moi" du futur pour une expansion immédiate.</li>
                </ul>
                <p className="text-[10px] opacity-60 italic border-t border-gray-800 pt-2">"Le temps est une monnaie comme une autre."</p>
                <button onClick={onClose} className="w-full bg-green-900/50 border border-green-500 hover:bg-green-800 text-green-300 mt-3 px-4 py-2 rounded uppercase tracking-widest transition-all">Synchroniser</button>
            </div>
        </Popup>
    );
};

export default BankTutorialPopup;
