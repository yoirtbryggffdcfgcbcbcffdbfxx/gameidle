import React from 'react';
import { CORE_UPGRADES } from '../constants';
import QuantumCore from './QuantumCore';

interface ReactorSectionProps {
    quantumShards: number;
    purchasedCoreUpgrades: string[];
    onBuyCoreUpgrade: (id: string) => void;
    coreCharge: number;
    isCoreDischarging: boolean;
    onDischargeCore: () => void;
    coreBonuses: { multiplier: number };
    energy: number;
    formatNumber: (n: number) => string;
}

const SectionHeader: React.FC<{ title: string; energy: number; formatNumber: (n: number) => string; }> = ({ title, energy, formatNumber }) => (
    <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-2xl text-center text-[var(--text-header)]">{title}</h2>
        <div className="bg-black/30 px-3 py-1 rounded-lg text-xs">
            <span className="text-cyan-300">⚡ {formatNumber(energy)}</span>
        </div>
    </div>
);


const ReactorSection: React.FC<ReactorSectionProps> = (props) => {
    return (
        <section id="reactor" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 flex flex-col">
                 <SectionHeader title="Réacteur Quantique" energy={props.energy} formatNumber={props.formatNumber} />
                <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col justify-center items-center text-center">
                        <h3 className="text-lg text-cyan-400 mb-4">Contrôle du Cœur</h3>
                         <QuantumCore
                            charge={props.coreCharge}
                            isDischarging={props.isCoreDischarging}
                            onDischarge={props.onDischargeCore}
                            multiplier={props.coreBonuses.multiplier}
                            size={200}
                        />
                         <p className="text-xs opacity-70 mt-4">Le Cœur se charge passivement. Activez-le à 100% pour une surcharge de production massive.</p>
                    </div>

                    <div className="bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col">
                         <h3 className="text-lg text-cyan-400 mb-2">Calibrations du Cœur</h3>
                         <p className="text-sm mb-2">Vous avez <strong className="text-purple-400">{props.quantumShards}</strong> Fragments Quantiques.</p>
                         <div className="space-y-2 overflow-y-auto flex-grow custom-scrollbar pr-1">
                            {CORE_UPGRADES.map(upgrade => {
                                const isPurchased = props.purchasedCoreUpgrades.includes(upgrade.id);
                                const canAfford = props.quantumShards >= upgrade.cost;
                                return (
                                    <div key={upgrade.id} className={`p-2 rounded flex justify-between items-center ${isPurchased ? 'bg-green-800/50' : 'bg-black/20'}`}>
                                        <div>
                                            <strong>{upgrade.name}</strong>
                                            <p className="text-xs opacity-80">{upgrade.description}</p>
                                        </div>
                                        <button 
                                            onClick={() => props.onBuyCoreUpgrade(upgrade.id)}
                                            disabled={isPurchased || !canAfford}
                                            className="text-sm px-3 py-1 rounded bg-purple-600 text-white disabled:bg-gray-500 disabled:cursor-not-allowed hover:enabled:bg-purple-500"
                                        >
                                            {isPurchased ? 'Acheté' : `Coût: ${upgrade.cost} FQ`}
                                        </button>
                                    </div>
                                );
                            })}
                         </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ReactorSection;