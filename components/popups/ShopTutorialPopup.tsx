
import React from 'react';
import Popup from './Popup';

interface ShopTutorialPopupProps {
    onClose: () => void;
}

const ShopTutorialPopup: React.FC<ShopTutorialPopupProps> = ({ onClose }) => {
    return (
        <Popup title="📡 Liaison Uplink Établie" onClose={onClose} widthClass="w-80">
            <div className="space-y-3 text-sm font-mono text-cyan-300">
                <p>Architecte, j'ai réussi à percer le voile dimensionnel. Le <strong className="text-yellow-400">Nexus d'Approvisionnement</strong> est en ligne.</p>
                <p className="opacity-90 text-gray-300">Nous pouvons y télécharger des schémas structurels permanents. Ces améliorations sont encodées dans la structure même de la réalité et <strong className="text-white">persisteront après une Transcendance</strong>.</p>
                <p className="text-[10px] opacity-70 text-cyan-500 border-t border-cyan-900 pt-2 mt-2">
                    // NOTE : Les Fragments Quantiques peuvent également être synthétisés ici.
                </p>
                <button onClick={onClose} className="w-full bg-cyan-900/50 border border-cyan-500 hover:bg-cyan-800 text-cyan-300 mt-2 px-3 py-2 rounded text-xs uppercase tracking-widest transition-all">Accéder au Nexus</button>
            </div>
        </Popup>
    );
};

export default ShopTutorialPopup;
