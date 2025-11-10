import React from 'react';
import Logo from './Logo';

interface CoreSectionProps {
    energy: number;
    maxEnergy: number;
    formatNumber: (num: number) => string;
    productionTotal: number;
    clickPower: number;
    onCollect: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const StatDisplay: React.FC<{ label: string; value: string; icon: string; colorClass: string; }> = ({ label, value, icon, colorClass }) => (
    <div className={`bg-black/30 p-2 rounded-lg text-center ${colorClass}`}>
        <div className="text-xs opacity-80">{icon} {label}</div>
        <div className="text-base md:text-lg font-bold truncate">{value}</div>
    </div>
);

const CoreSection: React.FC<CoreSectionProps> = (props) => {
    return (
        <section id="core" className="fullscreen-section reveal">
            <div className="text-center flex flex-col items-center justify-between h-full py-8 w-full max-w-lg">
                <Logo />
                <div className="w-full space-y-3">
                    <div id="energy-bar-container" className="relative w-full h-8 bg-black/50 rounded-full overflow-hidden shadow-inner border-2 border-cyan-800/50">
                        <div id="energyBar" className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00ffcc] to-[#0044ff] rounded-full transition-all duration-200" style={{ width: `${(props.energy / props.maxEnergy) * 100}%` }}></div>
                        <div className="absolute w-full h-full flex items-center justify-center text-sm [text-shadow:1px_1px_#000] font-bold">
                            Énergie
                        </div>
                    </div>
                    <div className="text-center text-xs opacity-70">{props.formatNumber(props.energy)} / {props.formatNumber(props.maxEnergy)}</div>
                    <div id="stats-display-container" className="flex justify-around items-center gap-2">
                        <div id="stat-prod" className="flex-1">
                            <StatDisplay label="Prod/sec" value={props.formatNumber(props.productionTotal)} icon="⚡" colorClass="text-yellow-300" />
                        </div>
                        <div id="stat-click" className="flex-1">
                            <StatDisplay label="Clic" value={props.formatNumber(props.clickPower)} icon="🖱️" colorClass="text-cyan-300" />
                        </div>
                    </div>
                </div>

                <button
                    id="collect-button"
                    onClick={props.onCollect}
                    className={`w-48 h-16 text-xl rounded-md bg-red-600 hover:bg-red-500 transition-all text-white shadow-lg transform hover:scale-105 hover:shadow-lg hover:shadow-red-400/50 flex justify-center items-center mx-auto`}
                >
                    Collecter
                </button>
            </div>
        </section>
    );
};

export default CoreSection;
