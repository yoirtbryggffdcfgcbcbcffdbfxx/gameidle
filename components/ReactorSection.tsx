import React from 'react';
import { CORE_UPGRADES } from '../constants';
import QuantumCore from './QuantumCore';
import SkillTree from './ui/SkillTree';

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
                <div className="flex-grow overflow-hidden custom-scrollbar pr-2">
                    
                    <div className="w-full h-full bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col">
                         <h3 className="text-lg text-center text-cyan-400 mb-2">Arbre de Calibration du Cœur</h3>
                         <p className="text-sm text-center mb-2">Vous avez <strong className="text-purple-400">{props.quantumShards}</strong> Fragments Quantiques.</p>
                         <div className="flex-grow overflow-auto custom-scrollbar pr-1 relative min-h-[300px]">
                            <SkillTree 
                                upgrades={CORE_UPGRADES}
                                purchasedIds={props.purchasedCoreUpgrades}
                                onBuy={props.onBuyCoreUpgrade}
                                currency={props.quantumShards}
                                currencyType="FQ"
                                themeColor="purple"
                            >
                                 <QuantumCore
                                    charge={props.coreCharge}
                                    isDischarging={props.isCoreDischarging}
                                    onDischarge={props.onDischargeCore}
                                    multiplier={props.coreBonuses.multiplier}
                                    size={160}
                                />
                            </SkillTree>
                         </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ReactorSection;