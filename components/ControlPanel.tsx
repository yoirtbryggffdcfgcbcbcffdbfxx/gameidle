import React, { useState, useEffect } from 'react';
import QuantumCore from './QuantumCore';

interface ControlPanelProps {
    energy: number;
    maxEnergy: number;
    productionTotal: number;
    clickPower: number;
    ascensionLevel: number;
    quantumShards: number;
    ascensionPoints: number;
    formatNumber: (n: number) => string;
    onCollect: (e: React.MouseEvent<HTMLButtonElement>) => void;
    coreCharge: number;
    isDischarging: boolean;
    onDischargeCore: () => void;
    coreMultiplier: number;
    isTutorialHighlight?: boolean;
}

const StatDisplay: React.FC<{ label: string; value: string; icon: string; colorClass: string; }> = ({ label, value, icon, colorClass }) => (
    <div className={`bg-black/30 p-2 rounded-lg text-center flex-1 ${colorClass}`}>
        <div className="text-xs opacity-80">{icon} {label}</div>
        <div className="text-base md:text-lg font-bold truncate">{value}</div>
    </div>
);


const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const energyPercentage = (props.energy / props.maxEnergy) * 100;
    const coreSize = isMobile ? 120 : 160;

    return (
        <div className="bg-black/20 rounded-lg p-2 md:p-4 flex flex-col justify-between h-full text-white">
            <div>
                <h1 className="text-xl md:text-2xl text-center mb-2 text-[var(--text-header)] [text-shadow:1px_1px_#000]">
                    Quantum Core
                </h1>
                <div className="text-center text-xs mb-2 md:mb-4 flex flex-col sm:flex-row sm:justify-center sm:space-x-4">
                    <span className="text-cyan-300">Ascension: <span className="font-bold">{props.ascensionLevel}</span></span>
                    <span className="text-purple-300">Fragments: <span className="font-bold">{props.quantumShards} FQ</span></span>
                    <span className="text-yellow-400">Points Asc.: <span className="font-bold">{props.ascensionPoints}</span></span>
                </div>
            </div>

            <div id="energy-bar-container" className="relative w-full h-8 bg-black/50 rounded-full overflow-hidden shadow-inner border-2 border-cyan-800/50 my-2">
                <div id="energyBar" className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00ffcc] to-[#0044ff] rounded-full transition-all duration-200" style={{ width: `${energyPercentage}%` }}></div>
                <div className="absolute w-full h-full flex items-center justify-center text-sm [text-shadow:1px_1px_#000] font-bold">
                    Énergie : {props.formatNumber(props.energy)}
                </div>
            </div>

            <div className="flex justify-around items-center my-2 gap-2 flex-col sm:flex-row">
                 <StatDisplay label="Prod/sec" value={props.formatNumber(props.productionTotal)} icon="⚡" colorClass="text-yellow-300" />
                 <StatDisplay label="Clic" value={props.formatNumber(props.clickPower)} icon="🖱️" colorClass="text-cyan-300" />
            </div>

            <div className="flex-grow flex flex-col justify-center items-center gap-4">
                <QuantumCore
                    charge={props.coreCharge}
                    isDischarging={props.isDischarging}
                    onDischarge={props.onDischargeCore}
                    multiplier={props.coreMultiplier}
                    size={coreSize}
                />
                <button 
                    id="collect-button"
                    onClick={props.onCollect} 
                    className={`w-36 text-base px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 transition-all text-white shadow-lg transform hover:scale-105 hover:shadow-lg hover:shadow-red-400/50 flex justify-center items-center ${props.isTutorialHighlight ? 'animate-attention-pulse' : ''}`}
                >
                    Collecter
                </button>
            </div>
        </div>
    );
};

export default ControlPanel;