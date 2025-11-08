import React, { useState, useEffect, useMemo, useRef } from 'react';
import { sfx } from '../audio/sfx';

const storyLines = [
    "[Transmission entrante... Source : Inconnue]",
    "Toutes les balises se sont éteintes. Les étoiles se meurent.",
    "Notre dernière lueur d'espoir est une singularité instable : le Cœur Quantique.",
    "Prenez les commandes. Stabilisez-le.",
    "Le destin de tout ce qui existe est entre vos mains.",
];

interface IntroCinematicProps {
    onComplete: () => void;
}

const BackgroundParticle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="animate-particle-fade" style={style}></div>
);

const IntroCinematic: React.FC<IntroCinematicProps> = ({ onComplete }) => {
    const [lineIndex, setLineIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const typeLine = () => {
            if (lineIndex >= storyLines.length) {
                timeoutRef.current = window.setTimeout(onComplete, 1500);
                return;
            }

            const currentLine = storyLines[lineIndex];
            let charIndex = 0;

            const typeCharacter = () => {
                if (charIndex <= currentLine.length) {
                    setDisplayText(currentLine.substring(0, charIndex));
                    if(charIndex < currentLine.length) {
                        sfx.typing.currentTime = 0;
                        sfx.typing.volume = 0.3;
                        sfx.typing.play().catch(() => {});
                    }
                    charIndex++;
                    timeoutRef.current = window.setTimeout(typeCharacter, 50);
                } else {
                    timeoutRef.current = window.setTimeout(() => {
                        setLineIndex(prev => prev + 1);
                    }, 1800);
                }
            };
            typeCharacter();
        };

        typeLine();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [lineIndex, onComplete]);

    const particles = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            style: {
                left: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                background: '#fff',
                animationDuration: `${15 + Math.random() * 20}s`,
                animationDelay: `${Math.random() * -35}s`,
            },
        }));
    }, []);

    return (
        <div className="fixed inset-0 bg-black flex flex-col justify-center items-center z-[5000] text-center p-4 overflow-hidden cinematic-overlay">
            {particles.map(p => <BackgroundParticle key={p.id} style={p.style} />)}
            
            <div className="relative z-10">
                <p 
                    className="text-lg md:text-2xl text-cyan-300 min-h-[3em] w-full max-w-2xl animate-text-flicker"
                >
                    {displayText}
                    {lineIndex < storyLines.length && <span className="inline-block w-2 h-6 bg-cyan-300 animate-pulse ml-1" />}
                </p>
            </div>


            <button
                onClick={onComplete}
                className="absolute bottom-8 right-8 text-sm text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors z-20"
            >
                Passer &gt;&gt;
            </button>
        </div>
    );
};

export default IntroCinematic;