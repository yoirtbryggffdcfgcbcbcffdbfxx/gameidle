import React from 'react';
import Popup from './Popup';

interface CreditsPopupProps {
    onClose: () => void;
}

const CreditsPopup: React.FC<CreditsPopupProps> = ({ onClose }) => {
    return (
        <Popup title="Crédits" onClose={onClose}>
            <div className="text-center space-y-3">
                <div>
                    <h3 className="text-lg text-yellow-400">Concept & Design</h3>
                    <p>L'Architecte du Quantum</p>
                </div>
                <div>
                    <h3 className="text-lg text-cyan-400">Ingénierie & Développement</h3>
                    <p>L'Ingénieur IA Gemini</p>
                </div>
                <div>
                    <p className="text-xs opacity-70 mt-4">
                        Créé avec React, TypeScript & Tailwind CSS.
                    </p>
                </div>
            </div>
        </Popup>
    );
};

export default CreditsPopup;