
import React, { useState, useEffect, useMemo } from 'react';
import { ShopUpgrade } from '../../types';
import { SHOP_UPGRADES } from '../../data/shop';

interface PermanentUpgradeCardProps {
    purchasedShopUpgrades: string[];
    energy: number;
    quantumShards: number;
    hasUnseenShopItems: boolean;
    onBuy: (id: string) => void;
    formatNumber: (num: number) => string;
}

const PermanentUpgradeCard: React.FC<PermanentUpgradeCardProps> = ({
    purchasedShopUpgrades,
    energy,
    quantumShards,
    hasUnseenShopItems,
    onBuy,
    formatNumber
}) => {
    const [animationClass, setAnimationClass] = useState('');
    const [displayedUpgrade, setDisplayedUpgrade] = useState<ShopUpgrade | null>(null);

    const nextUnpurchasedUpgrade = useMemo(() => {
        return SHOP_UPGRADES.find(upg => !purchasedShopUpgrades.includes(upg.id));
    }, [purchasedShopUpgrades]);
    
    useEffect(() => {
        if (nextUnpurchasedUpgrade?.id !== displayedUpgrade?.id) {
            if (displayedUpgrade) {
                 setTimeout(() => {
                    setDisplayedUpgrade(nextUnpurchasedUpgrade || null);
                    setAnimationClass('animate-shop-card-enter');
                }, 300);
            } else {
                setDisplayedUpgrade(nextUnpurchasedUpgrade || null);
                setTimeout(() => setAnimationClass('animate-shop-card-enter'), 50);
            }
        }
    }, [nextUnpurchasedUpgrade, displayedUpgrade]);

    const handleBuyClick = (id: string) => {
        setAnimationClass('animate-shop-card-exit');
        setTimeout(() => {
            onBuy(id);
        }, 300);
    };

    if (!displayedUpgrade) {
        return (
             <div className="text-center opacity-70 mt-6 p-8 bg-black/40 backdrop-blur-sm border border-yellow-500/30 rounded-xl animate-fade-in-fast text-yellow-200 max-w-md mx-auto">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-lg font-bold mb-2">Systèmes Optimisés</h3>
                <p className="text-xs font-mono opacity-80">Tous les modules disponibles ont été installés.</p>
                <p className="text-[10px] opacity-50 mt-4">En attente de nouvelles données R&D...</p>
            </div>
        );
    }

    const canAfford = displayedUpgrade.currency === 'energy'
        ? energy >= displayedUpgrade.cost
        : quantumShards >= displayedUpgrade.cost;
    
    const currencySymbol = displayedUpgrade.currency === 'energy' ? '⚡' : '💠';
    const costColor = canAfford ? 'text-yellow-400' : 'text-red-400';

    return (
         <div className={`w-full max-w-lg mx-auto bg-[#0a0a0f] border border-yellow-600/40 rounded-sm overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.05)] relative ${animationClass} group`}>
            
            {/* Header Bar - Technical Look */}
            <div className="bg-yellow-900/10 border-b border-yellow-600/30 p-2 px-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-none ${hasUnseenShopItems ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                    <span className="text-[10px] font-mono text-yellow-600/80 tracking-[0.2em] uppercase">SYS.MOD.EXPANSION</span>
                </div>
                <span className="text-[10px] font-mono text-yellow-600/50">SRL-{displayedUpgrade.id.toUpperCase().slice(0, 6)}</span>
            </div>

            {/* Main Content */}
            <div className="p-6 relative">
                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-yellow-500/50"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-yellow-500/50"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-yellow-500/50"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-yellow-500/50"></div>

                {/* Tech Background Lines */}
                <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="#EAB308">
                        <path d="M0 0 H100 V100" strokeWidth="0.5" fill="none"/>
                        <circle cx="50" cy="50" r="30" strokeWidth="0.5" strokeDasharray="4 4" />
                        <line x1="0" y1="100" x2="100" y2="0" strokeWidth="0.5" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight font-mono flex items-center gap-3">
                    {displayedUpgrade.name}
                </h2>
                <div className="h-px w-full bg-gradient-to-r from-yellow-500/50 to-transparent mb-4"></div>
                
                <div className="flex gap-4">
                    <div className="flex-grow">
                         <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-mono">
                            {displayedUpgrade.description}
                        </p>
                    </div>
                </div>

                {/* Cost Block */}
                <div className="mt-8 flex items-center justify-between bg-black/40 p-3 border border-white/5 rounded-sm">
                    <span className="text-[10px] uppercase text-gray-500 font-mono tracking-wider">Coût Requis</span>
                    <div className="text-right">
                         <span className={`text-xl font-mono font-bold ${costColor} drop-shadow-md`}>
                            {formatNumber(displayedUpgrade.cost)} {currencySymbol}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Button Area */}
            <button
                onClick={() => handleBuyClick(displayedUpgrade.id)}
                disabled={!canAfford}
                className={`
                    w-full py-5 px-6 text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300
                    flex items-center justify-center gap-3 relative overflow-hidden
                    ${canAfford 
                        ? 'bg-yellow-600/10 hover:bg-yellow-600 text-yellow-400 hover:text-black border-t border-yellow-600' 
                        : 'bg-gray-900 text-gray-600 cursor-not-allowed border-t border-gray-800'
                    }
                `}
            >
                {canAfford && (
                    <div className="absolute inset-0 bg-yellow-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                )}
                
                <span className="relative z-10">{canAfford ? 'INITIALISER L\'INSTALLATION' : 'RESSOURCES MANQUANTES'}</span>
                {canAfford && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default PermanentUpgradeCard;
