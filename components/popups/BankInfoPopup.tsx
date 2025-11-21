
import React, { useRef } from 'react';
import Popup from './Popup';
import { useDragToScroll } from '../../hooks/ui/useDragToScroll';

interface BankInfoPopupProps {
    onClose: () => void;
}

const BankInfoPopup: React.FC<BankInfoPopupProps> = ({ onClose }) => {
    const scrollableRef = useRef<HTMLDivElement>(null);
    useDragToScroll(scrollableRef);

    return (
        <Popup title="Manuel du Coffre Temporel" onClose={onClose} widthClass="w-[500px]">
            <div ref={scrollableRef} className="space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar scroll-contain font-mono">
                
                <div className="bg-black/40 p-3 rounded border-l-2 border-green-500">
                    <h3 className="text-lg text-green-400 mb-2 flex items-center gap-2">
                        <span>📦 Module de Stase (Épargne)</span>
                    </h3>
                    <p className="mb-2 text-gray-300 text-xs">Placez votre énergie en "Stase" hors du flux temporel normal. Elle y croît grâce à l'accumulation d'entropie positive.</p>
                    <p className="text-[10px] text-green-300 pl-2 bg-green-900/20 p-1 rounded">
                        <strong>Protocole Auto :</strong> Un retrait de stase rembourse <strong className="text-white">PRIORITAIREMENT</strong> toute dette temporelle active.
                    </p>
                </div>

                <div className="bg-black/40 p-3 rounded border-l-2 border-cyan-400">
                    <h3 className="text-lg text-cyan-400 mb-2 flex items-center gap-2">
                        <span>⚡ Paradoxe Temporel (Prêts)</span>
                    </h3>
                    <p className="mb-2 text-gray-300 text-xs">Matérialisez de l'énergie du futur pour l'utiliser maintenant. Cela crée un Paradoxe qui doit être résolu.</p>
                    <ul className="list-disc list-inside text-[10px] space-y-1 pl-1 text-gray-400">
                        <li><strong>Ancrage (Apport) :</strong> Vous devez posséder <strong className="text-white">20%</strong> de la somme pour stabiliser la faille.</li>
                        <li><strong>Coût Entropique :</strong> Le montant à rendre inclut une "taxe de stabilité" (intérêts).</li>
                        <li><strong>Résolution Auto :</strong> <strong className="text-white">50%</strong> de votre production actuelle est siphonée pour combler la faille (remboursement).</li>
                    </ul>
                </div>

                <div className="bg-black/40 p-3 rounded border-l-2 border-yellow-400">
                    <h3 className="text-lg text-yellow-400 mb-2 flex items-center gap-2">
                         <span>🏗️ Structure (Améliorations)</span>
                    </h3>
                    <p className="text-gray-300 text-xs">Renforcez la matrice de confinement pour améliorer les rendements de stase et réduire le coût des paradoxes.</p>
                    <p className="text-[10px] text-red-400 mt-2">
                        <strong>Restriction :</strong> Impossible d'améliorer la structure si une faille (prêt) est active.
                    </p>
                </div>

                <button onClick={onClose} className="w-full bg-cyan-700 hover:bg-cyan-600 text-white mt-3 px-4 py-3 rounded font-bold uppercase tracking-widest text-xs transition-colors">Fermer le Manuel</button>
            </div>
        </Popup>
    );
};

export default BankInfoPopup;
