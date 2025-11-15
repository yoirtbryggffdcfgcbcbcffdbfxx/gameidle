import React, { useMemo, useRef } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { getNextFragmentCost } from '../data/quantumFragments';
import PermanentUpgradeCard from './shop/PermanentUpgradeCard';
import QuantumFragmentCard from './shop/QuantumFragmentCard';
import { useScrollAnimationTrigger } from '../hooks/ui/useScrollAnimationTrigger';
import { useDragToScroll } from '../hooks/ui/useDragToScroll';
// FIX: Import `SHOP_UPGRADES` to resolve a reference error.
import { SHOP_UPGRADES } from '../data/shop';
import ShopIcon from './ui/ShopIcon';
import QuantumFragmentIcon from './ui/QuantumFragmentIcon';

const ShopBackground: React.FC = () => (
    <div className="absolute inset-0 bg-[#0a0700] z-[-1] overflow-hidden">
        <div 
            className="absolute -left-1/2 -top-1/2 w-[200%] h-[200%] opacity-50"
            style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                animation: 'pan 60s linear infinite',
                willChange: 'transform',
            }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1600] via-[#4d3800]/50 to-[#000000]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,193,7,0.4),rgba(255,255,255,0))]"></div>
    </div>
);

const CurrencyDisplay: React.FC<{ label: string; value: string; icon: React.ReactNode; }> = ({ label, value, icon }) => (
    <div className="bg-black/40 rounded-full px-3 py-1.5 flex items-center gap-2 text-center backdrop-blur-sm border border-white/10">
        <span className="text-lg w-5 h-5 flex items-center justify-center">{icon}</span>
        <div className="text-left">
            <div className="text-xs opacity-70 leading-none">{label}</div>
            <div className="text-sm font-bold leading-tight text-yellow-300">{value}</div>
        </div>
    </div>
);

const ScrollDownIndicator: React.FC = () => (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
        <span className="text-xs opacity-70">Défiler pour explorer</span>
        <div className="w-5 h-8 border-2 border-white/50 rounded-full relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-white/50 rounded-full" style={{ animation: 'scroll-down-indicator 2s infinite' }}></div>
        </div>
    </div>
);


const ShopInterface: React.FC = () => {
    const { gameState, handlers, memoizedFormatNumber } = useGameContext();
    const {
        energy,
        quantumShards,
        purchasedShopUpgrades,
        hasUnseenShopItems,
        isCoreUnlocked,
    } = gameState;
    const { exitShopInterface, onBuyShopUpgrade, onBuyQuantumShard } = handlers;
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    useScrollAnimationTrigger(scrollContainerRef, '.scroll-reveal-section');
    useDragToScroll(scrollContainerRef);

    const nextFragmentCost = useMemo(() => getNextFragmentCost(quantumShards), [quantumShards]);

    const hasPermanentUpgradesLeft = useMemo(() => {
        return SHOP_UPGRADES.some(upg => !purchasedShopUpgrades.includes(upg.id));
    }, [purchasedShopUpgrades]);

    return (
        <div className="fixed inset-0 text-white flex flex-col h-screen overflow-hidden">
            <ShopBackground />
            <div ref={scrollContainerRef} className="h-full w-full overflow-y-auto overscroll-y-contain overflow-x-hidden select-none" style={{ scrollSnapType: 'y mandatory', scrollBehavior: 'smooth' }}>

                {/* Section 1: Hero */}
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
                    <div className="mt-8 flex gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                        <CurrencyDisplay label="Énergie" value={memoizedFormatNumber(energy)} icon="⚡" />
                        {isCoreUnlocked && <CurrencyDisplay label="Fragments" value={memoizedFormatNumber(quantumShards)} icon={<QuantumFragmentIcon className="w-5 h-5" />} />}
                    </div>
                    <ScrollDownIndicator />
                </section>

                {/* Section 2: Permanent Upgrades */}
                <section className="h-screen w-full flex justify-center items-center p-4 relative scroll-reveal-section" style={{ scrollSnapAlign: 'start' }}>
                    <div className="w-full max-w-3xl space-y-4">
                        <h2 className="text-3xl text-yellow-400 mb-2 text-center">Améliorations Permanentes</h2>
                        <p className="text-base opacity-80 mb-6 text-center">Les améliorations achetées ici sont conservées après chaque Ascension.</p>
                        <div>
                            <PermanentUpgradeCard
                                purchasedShopUpgrades={purchasedShopUpgrades}
                                energy={energy}
                                quantumShards={quantumShards}
                                hasUnseenShopItems={hasUnseenShopItems}
                                onBuy={onBuyShopUpgrade}
                                formatNumber={memoizedFormatNumber}
                            />
                        </div>
                    </div>
                </section>

                {/* Section 3: Quantum Fragments */}
                {isCoreUnlocked && (
                     <section className="h-screen w-full flex justify-center items-center p-4 relative scroll-reveal-section" style={{ scrollSnapAlign: 'start' }}>
                        <div className="w-full max-w-3xl space-y-4">
                            <h2 className="text-3xl text-purple-400 mb-2 text-center">Marché des Fragments</h2>
                            <p className="text-base opacity-80 mb-6 text-center">Achetez des Fragments Quantiques avec de l'énergie pour améliorer votre Cœur.</p>
                            <div>
                                <QuantumFragmentCard
                                    quantumShards={quantumShards}
                                    energy={energy}
                                    onBuy={onBuyQuantumShard}
                                    formatNumber={memoizedFormatNumber}
                                    cost={nextFragmentCost}
                                />
                            </div>
                        </div>
                    </section>
                )}
            </div>
            
            <footer className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center p-4 z-10">
                <button 
                   onClick={exitShopInterface} 
                   className="w-full max-w-xs px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border-2 border-cyan-400 rounded-lg transition-colors text-lg text-cyan-300 shadow-lg shadow-cyan-500/20"
                   style={{ textShadow: '0 0 8px #00ffff' }}
                >
                   Retour au Jeu
               </button>
           </footer>
        </div>
    );
};

export default ShopInterface;