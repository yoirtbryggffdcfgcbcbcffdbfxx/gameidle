import React, { useState, useEffect } from 'react';
import Logo from './Logo';

const loadingTexts = [
    "INITIALIZING CORE...",
    "CALIBRATING ENERGY FLOWS...",
    "LOADING QUANTUM PARAMETERS...",
    "SYSTEM READY.",
];

const LoadingScreen: React.FC = () => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex(prevIndex => {
                if (prevIndex < loadingTexts.length - 1) {
                    return prevIndex + 1;
                }
                clearInterval(interval);
                return prevIndex;
            });
        }, 350);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-black flex flex-col justify-center items-center z-[100] text-center">
            <div className="scale-75">
                <Logo />
            </div>
            
            <div className="w-64 h-8 mt-8 text-cyan-300 font-mono text-xs text-left border border-cyan-300/50 bg-black/50 p-2 rounded">
                <p className="animate-text-flicker">
                    &gt; {loadingTexts[currentTextIndex]}
                    <span className="inline-block w-2 h-3 bg-cyan-300 animate-pulse ml-1" />
                </p>
            </div>
        </div>
    );
};

export default LoadingScreen;