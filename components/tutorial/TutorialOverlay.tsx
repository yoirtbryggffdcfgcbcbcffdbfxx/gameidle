
import React from 'react';

interface TutorialOverlayProps {
    highlightBox: DOMRect | null;
    isGlobal?: boolean;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ highlightBox, isGlobal }) => {
    const padding = 6;

    // Si pas de cible ou étape globale, pas de viseur tactique nécessaire
    if (!highlightBox || isGlobal) return null;

    const { top, left, width, height } = highlightBox;

    // Styles pour les "coins" du viseur (Brackets)
    const bracketSize = 15;
    const bracketThickness = 2;
    const bracketColor = '#00f5d4'; // Cyan core color

    const commonBracketStyle: React.CSSProperties = {
        position: 'absolute',
        width: `${bracketSize}px`,
        height: `${bracketSize}px`,
        borderColor: bracketColor,
        borderStyle: 'solid',
        filter: 'drop-shadow(0 0 5px rgba(0, 245, 212, 0.8))',
    };

    return (
        <div 
            className="fixed inset-0 z-[1999] pointer-events-none overflow-hidden"
        >
            {/* Container animé qui suit la cible */}
            <div 
                className="absolute transition-all duration-300 ease-out animate-tutorial-pulse"
                style={{
                    top: top - padding,
                    left: left - padding,
                    width: width + padding * 2,
                    height: height + padding * 2,
                }}
            >
                {/* Coin Haut-Gauche */}
                <div style={{ 
                    ...commonBracketStyle, 
                    top: 0, 
                    left: 0, 
                    borderWidth: `${bracketThickness}px 0 0 ${bracketThickness}px` 
                }} />
                
                {/* Coin Haut-Droite */}
                <div style={{ 
                    ...commonBracketStyle, 
                    top: 0, 
                    right: 0, 
                    borderWidth: `${bracketThickness}px ${bracketThickness}px 0 0` 
                }} />
                
                {/* Coin Bas-Droite */}
                <div style={{ 
                    ...commonBracketStyle, 
                    bottom: 0, 
                    right: 0, 
                    borderWidth: 0,
                    borderRightWidth: `${bracketThickness}px`,
                    borderBottomWidth: `${bracketThickness}px`
                }} />
                
                {/* Coin Bas-Gauche */}
                <div style={{ 
                    ...commonBracketStyle, 
                    bottom: 0, 
                    left: 0, 
                    borderWidth: 0,
                    borderLeftWidth: `${bracketThickness}px`,
                    borderBottomWidth: `${bracketThickness}px`
                }} />

                {/* Background subtil pour le contraste du texte interne si besoin */}
                <div className="absolute inset-0 bg-cyan-500/5 rounded-sm"></div>
                
                {/* Scanline interne au viseur */}
                <div className="absolute inset-0 overflow-hidden opacity-30">
                     <div className="w-full h-[2px] bg-cyan-400 absolute top-0 animate-[scan-line_1.5s_linear_infinite]"></div>
                </div>
            </div>

            {/* Lignes de connexion vers les bords de l'écran (Effet Sniper) */}
            <div className="absolute bg-cyan-500/20 h-[1px] w-screen top-0 left-0" style={{ top: top + height/2 }}></div>
            <div className="absolute bg-cyan-500/20 w-[1px] h-screen top-0 left-0" style={{ left: left + width/2 }}></div>
        </div>
    );
};

export default TutorialOverlay;
