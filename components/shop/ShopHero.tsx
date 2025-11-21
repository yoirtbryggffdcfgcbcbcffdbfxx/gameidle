
import React from 'react';
import ShopIcon from '../ui/ShopIcon';
import QuantumFragmentIcon from '../ui/QuantumFragmentIcon';
import { CurrencyDisplay, ScrollDownIndicator } from './ShopLayoutElements';

interface ShopHeroProps {
    energy: number;
    quantumShards: number;
    isCoreUnlocked: boolean;
    formatNumber: (num: number) => string;
}

const ShopHero: React.FC<ShopHeroProps> = ({ energy, quantumShards, isCoreUnlocked, formatNumber }) => {
    return (
        <section className="h-screen w-full flex flex-col justify-center items-center p-4 relative" style={{ scrollSnapAlign: 'start' }}>
            <div className="text-center animate-fade-in">
                <div className="mb-4 animate-core-breathe" style={{ animationDelay: '0.2s' }}>
                    <ShopIcon className="w-24 h-24 mx-auto" />
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-500" style={{ textShadow: '0 2px 12px rgba(245, 158, 11, 0.6)' }}>
                    Boutique Quantique
                </h1>
                <p className="opacity-80 text-lg mt-2" style={{ animationDelay: '0.4s' }}>Votre hub pour les améliorations permanentes.</p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <CurrencyDisplay label="Énergie" value={formatNumber(energy)} icon="⚡" />
                {isCoreUnlocked && <CurrencyDisplay label="Fragments" value={formatNumber(quantumShards)} icon={<QuantumFragmentIcon className="w-5 h-5" />} />}
            </div>
            <ScrollDownIndicator />
        </section>
    );
};

export default ShopHero;
