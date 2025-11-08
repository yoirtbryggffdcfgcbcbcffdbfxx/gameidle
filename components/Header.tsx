import React from 'react';
import { MAX_ENERGY } from '../constants';

interface HeaderProps {
    energy: number;
    formattedEnergy: string;
    onCollect: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ energy, formattedEnergy, onCollect }) => {
    const energyPercentage = (energy / MAX_ENERGY) * 100;

    return (
        <header>
            <h1 className="text-lg md:text-2xl text-center my-2 text-[var(--text-header)] [text-shadow:1px_1px_#000]">Idle Game Optimisé</h1>
            <div className="flex justify-between items-center mx-2 md:mx-4 my-1">
                <div className="flex-1 mr-2 md:mr-4">
                    <div className="relative w-full h-5 bg-[#222] rounded-full overflow-hidden shadow-inner shadow-black">
                        <div id="energyBar" className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00ffcc] to-[#0044ff] rounded-full transition-all duration-200" style={{ width: `${energyPercentage}%` }}></div>
                        <div className="absolute w-full h-full flex items-center justify-center text-[#00ffcc] [text-shadow:1px_1px_#000] font-bold">
                            Énergie : {formattedEnergy}
                        </div>
                    </div>
                </div>
                <button onClick={onCollect} className="px-2 py-1.5 md:px-4 md:py-2 text-white bg-[#ff5555] rounded-md hover:shadow-lg hover:shadow-white/50 transition-shadow shrink-0">⚡ Collecter</button>
            </div>
        </header>
    );
};

export default Header;
