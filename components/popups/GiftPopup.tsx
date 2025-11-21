
import React from 'react';
import Popup from './Popup';
import { useGameContext } from '../../contexts/GameContext';
import FeatherIcon from '../ui/FeatherIcon';
import { calculateGiftChance } from '../../utils/helpers';

interface GiftPopupProps {
    onClose: () => void;
}

const GiftPopup: React.FC<GiftPopupProps> = ({ onClose }) => {
    const { gameState, handlers, memoizedFormatNumber } = useGameContext();
    const { activeGift, upgrades } = gameState;
    const { onClaimGift } = handlers;

    const giftUpgrade = upgrades.find(u => u.id === 'boost_gift_1');
    const isGiftActive = activeGift !== null;
    
    const chancePercentage = giftUpgrade ? calculateGiftChance(giftUpgrade.owned) : 0;
    // Une vérification toutes les secondes => 100 / chance = nombre de secondes moyen
    const secondsEstimate = chancePercentage > 0 ? (100 / chancePercentage).toFixed(0) : '∞';

    const handleClaim = () => {
        onClaimGift();
        onClose();
    };

    return (
        <Popup title="Cadeau Quantique" onClose={onClose} widthClass="w-80">
            <div className="flex flex-col items-center text-center p-2">
                <div className={`mb-4 p-4 rounded-full border-2 ${isGiftActive ? 'bg-cyan-900/20 border-cyan-400 animate-pulse' : 'bg-gray-800/50 border-gray-600'}`}>
                    <FeatherIcon className={`w-12 h-12 ${isGiftActive ? 'text-cyan-400' : 'text-gray-500'}`} />
                </div>

                {isGiftActive ? (
                    <>
                        <p className="text-sm text-white mb-2">Une anomalie temporelle bienveillante !</p>
                        <p className="text-xs text-cyan-300 mb-4">
                            Contient une fraction de l'énergie stockée lors de son apparition.
                            <br />
                            <span className="font-bold text-lg mt-2 block text-yellow-400">15% du Stock ("Lucky")</span>
                        </p>
                        <div className="bg-black/30 p-2 rounded w-full mb-4 border border-white/10">
                             <p className="text-[10px] text-gray-400 uppercase">Valeur du contenu</p>
                             <p className="text-xl font-mono font-bold text-cyan-400">
                                 {memoizedFormatNumber(Math.floor(activeGift.value * 0.15))} ⚡
                             </p>
                        </div>
                        <button 
                            onClick={handleClaim}
                            className="w-full py-3 rounded bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all"
                        >
                            Réclamer
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-sm text-gray-400 mb-4">Aucun cadeau n'est apparu pour le moment.</p>
                        {giftUpgrade && giftUpgrade.owned > 0 ? (
                            <div className="text-xs text-yellow-400/70 space-y-1">
                                <p>Niveau actuel: <strong className="text-white">{giftUpgrade.owned}</strong></p>
                                <p>Probabilité: <strong className="text-white">{chancePercentage.toFixed(2)}%</strong> / sec</p>
                                <p>Estimation: Environ un cadeau toutes les <strong className="text-white">{secondsEstimate}</strong> secondes.</p>
                            </div>
                        ) : (
                            <p className="text-xs text-red-400/70">
                                Vous devez acheter le "Condensateur de Chance" dans la Forge (Booster) pour trouver des cadeaux.
                            </p>
                        )}
                        <button onClick={onClose} className="mt-4 text-xs text-gray-500 hover:text-white underline">Fermer</button>
                    </>
                )}
            </div>
        </Popup>
    );
};

export default GiftPopup;
