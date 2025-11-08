import React from 'react';

interface GuidedTutorialProps {
    step: number;
}

const GuidedTutorial: React.FC<GuidedTutorialProps> = ({ step }) => {
    if (step === 0) return null;

    const getStepContent = () => {
        switch (step) {
            case 1:
                return {
                    text: "Bienvenue ! Cliquez sur 'Collecter' pour générer votre première énergie.",
                    style: { top: '85px', right: '1rem', transform: 'translateY(0)', width: '200px' }
                };
            case 2:
                return {
                    text: "Parfait ! Utilisez cette énergie pour acheter votre premier 'Petit Générateur'.",
                    style: { top: '120px', left: '50%', transform: 'translateX(-50%)', width: '250px' }
                };
            case 3:
                return {
                    text: "Excellent ! Il produit de l'énergie automatiquement. Continuez à améliorer pour devenir plus puissant !",
                    style: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px' }
                };
            default:
                return null;
        }
    };

    const content = getStepContent();
    if (!content) return null;

    return (
        <div 
            className="fixed bg-[var(--bg-popup)] text-[var(--text-main)] p-3 rounded-lg text-center shadow-2xl z-[2000] border-2 border-cyan-400 animate-popup-scale"
            style={content.style}
        >
            <p className="text-xs mb-2">{content.text}</p>
        </div>
    );
};

export default GuidedTutorial;