import React from 'react';
import Popup from './Popup';

interface BankInfoPopupProps {
    onClose: () => void;
}

const BankInfoPopup: React.FC<BankInfoPopupProps> = ({ onClose }) => {
    return (
        <Popup title="Manuel de la Banque Quantique" onClose={onClose} widthClass="w-[500px]">
            <div className="space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                
                <div className="bg-black/20 p-3 rounded-lg">
                    <h3 className="text-lg text-yellow-400 mb-2">🐷 Compte Épargne</h3>
                    <p className="mb-2">Déposez votre énergie pour la mettre en sécurité et gagner des intérêts passifs. Le taux d'intérêt s'améliore avec le niveau de votre banque.</p>
                    <p className="text-xs text-cyan-400 border-l-2 border-cyan-400 pl-2">
                        <strong>Astuce :</strong> Lorsque vous retirez de l'épargne, les fonds sont <strong className="text-white">automatiquement utilisés pour rembourser un prêt en cours</strong> avant d'être ajoutés à votre énergie. C'est un excellent moyen de rembourser un prêt d'un seul coup !
                    </p>
                </div>

                <div className="bg-black/20 p-3 rounded-lg">
                    <h3 className="text-lg text-cyan-400 mb-2">💰 Prêts Quantiques</h3>
                    <p className="mb-2">Besoin d'un boost immédiat ? Contractez un prêt. Mais attention, les intérêts peuvent être élevés.</p>
                    <ul className="list-disc list-inside text-xs space-y-1 pl-2">
                        <li><strong>Limite d'emprunt :</strong> Vous ne pouvez emprunter que jusqu'à <strong className="text-white">10% de votre capacité d'énergie maximale</strong>.</li>
                        <li><strong>Apport (Collatéral) :</strong> Vous devez posséder au moins <strong className="text-white">10% du montant total à rembourser</strong> (prêt + intérêts) pour que le prêt soit approuvé.</li>
                        <li><strong>Remboursement Passif :</strong> <strong className="text-white">50% de votre production d'énergie par seconde</strong> est automatiquement utilisée pour rembourser le prêt.</li>
                    </ul>
                     <p className="text-xs text-yellow-400 border-l-2 border-yellow-400 pl-2 mt-3">
                        <strong>Stratégie :</strong> Utilisez les prêts pour surmonter des paliers d'amélioration très coûteux que vous ne pourriez pas atteindre autrement. Un prêt bien placé peut décupler votre production et se rembourser rapidement.
                    </p>
                </div>

                <div className="bg-black/20 p-3 rounded-lg">
                    <h3 className="text-lg text-purple-400 mb-2">📈 Améliorations de la Banque</h3>
                    <p>Investissez dans votre banque pour débloquer de meilleurs taux d'intérêt pour l'épargne et réduire les coûts des prêts. C'est un investissement à long terme.</p>
                    <p className="text-xs text-red-400 border-l-2 border-red-400 pl-2">
                        <strong>Important :</strong> Vous ne pouvez <strong className="text-white">PAS</strong> améliorer la banque si vous avez un prêt en cours. Planifiez vos améliorations avant de vous endetter.
                    </p>
                </div>

                <button onClick={onClose} className="w-full bg-blue-600 text-white mt-3 px-4 py-2 rounded">J'ai tout compris !</button>
            </div>
        </Popup>
    );
};

export default BankInfoPopup;