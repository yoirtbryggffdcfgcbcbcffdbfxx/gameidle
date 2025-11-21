
import React, { useMemo, useRef } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { getNextFragmentCost } from '../data/quantumFragments';
import PermanentUpgradeCard from './shop/PermanentUpgradeCard';
import QuantumFragmentCard from './shop/QuantumFragmentCard';
import { useScrollAnimationTrigger } from '../hooks/ui/useScrollAnimationTrigger';
import { useDragToScroll } from '../hooks/ui/useDragToScroll';
import ShopGateway from './shop/cinematic/ShopGateway';
import ShopBackground from './shop/ShopBackground';
import ShopHero from './shop/ShopHero';

const ShopInterface: React.FC = () => {
    const { gameState, handlers, memoizedFormatNumber } = useGameContext();
    const {
        energy,
        quantumShards,
        purchasedShopUpgrades,
        hasUnseenShopItems,
        isCoreUnlocked,
        hasSeenShopCinematic,
    } = gameState;
    const { exitShopInterface, onBuyShopUpgrade, onBuyQuantumShard, onShopCinematicComplete } = handlers;
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    useScrollAnimationTrigger(scrollContainerRef, '.scroll-reveal-section');
    useDragToScroll(scrollContainerRef);

    const nextFragmentCost = useMemo(() => getNextFragmentCost(quantumShards), [quantumShards]);

    if (!hasSeenShopCinematic) {
        return <ShopGateway onComplete={onShopCinematicComplete} />;
    }

    return (
        <div className="fixed inset-0 text-white flex flex-col h-screen overflow-hidden">
            <ShopBackground />
            <div ref={scrollContainerRef} className="h-full w-full overflow-y-auto overscroll-y-contain overflow-x-hidden select-none" style={{ scrollSnapType: 'y mandatory', scrollBehavior: 'smooth' }}>

                {/* Section 1: Hero */}
                <ShopHero 
                    energy={energy} 
                    quantumShards={quantumShards} 
                    isCoreUnlocked={isCoreUnlocked} 
                    formatNumber={memoizedFormatNumber} 
                />

                {/* Section 2: Permanent Upgrades */}
                <section className="h-screen w-full flex justify-center items-center p-4 relative scroll-reveal-section" style={{ scrollSnapAlign: 'start' }}>
                    <div className="w-full max-w-4xl space-y-8 flex flex-col items-center">
                        <div className="text-center">
                            <h2 className="text-3xl text-yellow-400 font-bold mb-2 uppercase tracking-widest">Modules Système</h2>
                            <p className="text-sm opacity-60">Mises à jour matérielles persistantes.</p>
                        </div>
                        
                        <div className="w-full flex justify-center px-2">
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
                        <div className="w-full max-w-4xl space-y-8">
                            <div className="text-center">
                                <h2 className="text-3xl text-purple-400 font-bold mb-2 uppercase tracking-widest">Forge de Matière</h2>
                                <p className="text-sm opacity-60">Synthèse de Fragments Quantiques.</p>
                            </div>
                            <div className="w-full px-2">
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
            
            <footer className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center p-4 z-10 pointer-events-none">
                <button 
                   onClick={exitShopInterface} 
                   className="w-full max-w-xs px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border-2 border-cyan-400 rounded-lg transition-colors text-lg text-cyan-300 shadow-lg shadow-cyan-500/20 pointer-events-auto backdrop-blur-sm"
                   style={{ textShadow: '0 0 8px #00ffff' }}
                >
                   Retour au Jeu
               </button>
           </footer>
        </div>
    );
};

export default ShopInterface;
