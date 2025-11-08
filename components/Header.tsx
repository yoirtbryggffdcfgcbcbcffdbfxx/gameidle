import React from 'react';
import QuantumCore from './QuantumCore';
import { CoreUpgrade } from '../types';

interface HeaderProps {
    energy: number;
    maxEnergy: number;
    formattedEnergy: string;
    onCollect: (e: React.MouseEvent<HTMLButtonElement>) => void;
    coreCharge: number;
    isDischarging: boolean;
    onDischargeCore: () => void;
    coreMultiplier: number;
    quantumShards: number;
}

const Header: React.FC<HeaderProps> = ({ energy, maxEnergy, formattedEnergy, onCollect, coreCharge, isDischarging, onDischargeCore, coreMultiplier, quantumShards }) => {
    const energyPercentage = (energy / maxEnergy) * 100;

    return (
        <header>
            <h1 className="text-lg md:text-2xl text-center my-2 text-[var(--text-header)] [text-shadow:1px_1px_#000]">Quantum Core</h1>
            <div className="flex justify-between items-center mx-2 md:mx-4 my-1 gap-2 md:gap-4">
                <div className="flex-1 flex flex-col gap-1">
                    <div className="relative w-full h-5 bg-[#222] rounded-full overflow-hidden shadow-inner shadow-black">
                        <div id="energyBar" className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00ffcc] to-[#0044ff] rounded-full transition-all duration-200" style={{ width: `${energyPercentage}%` }}></div>
                        <div className="absolute w-full h-full flex items-center justify-center text-[#00ffcc] text-xs [text-shadow:1px_1px_#000] font-bold">
                            Énergie : {formattedEnergy}
                        </div>
                    </div>
                     <div className="text-xs text-center text-purple-300">
                        Fragments Quantiques: <span className="font-bold">{quantumShards} FQ</span>
                    </div>
                </div>
                <QuantumCore
                    charge={coreCharge}
                    isDischarging={isDischarging}
                    onDischarge={onDischargeCore}
                    multiplier={coreMultiplier}
                />
                <button onClick={onCollect} className="px-2 py-1.5 md:px-4 md:py-2 text-white bg-[#ff5555] rounded-md hover:shadow-lg hover:shadow-white/50 transition-shadow shrink-0 self-center">⚡ Collecter</button>
            </div>
        </header>
    );
};

export default Header;