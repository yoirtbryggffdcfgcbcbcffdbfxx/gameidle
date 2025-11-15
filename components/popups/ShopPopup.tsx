import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ShopUpgrade } from '../../types';
import { SHOP_UPGRADES } from '../../data/shop';
import { useDragToScroll } from '../../hooks/ui/useDragToScroll';
import { getNextFragmentCost } from '../../data/quantumFragments';
import ShopIconRenderer from '../ui/ShopIconRenderer';
import QuantumFragmentIcon from '../ui/QuantumFragmentIcon';

interface ShopPopupProps {
    quantumShards: number;
    energy: number;
    purchasedShopUpgrades: string[];
    onBuy: (id: string) => void;
    formatNumber: (num: number) => string;
    hasUnseenShopItems: boolean;
    isCoreUnlocked: boolean;
    onBuyQuantumShard: () => void;
    markShopItemsAsSeen: () => void;
    canAffordFragment: boolean;
}

const QuantumFragmentCard: React.FC<{
    quantumShards: number;
    energy: number;
    onBuy: () => void;
    formatNumber: (num: number) => string;
}> = ({ quantumShards, energy, onBuy, formatNumber }) => {
    
    const cost = getNextFragmentCost(quantumShards);
    const canAfford = energy >= cost;

    return (
        <div className="bg-black/20 border-2 border-purple-500/50 p-3 rounded-lg flex flex-col md:flex-row gap-4 items-center relative shadow-lg shadow-purple-500/10">
            <QuantumFragmentIcon className="w-12 h-12 animate-core-breathe" style={{animationDuration: '3s'}} />
            <div className="flex-grow text-center md:text-left">
                <h4 className="text-base font-bold text-purple-300">Fragment Quantique</h4>
                <p className="text-xs opacity-80 mt-1">Utilisé pour améliorer le Cœur et débloquer son plein potentiel. Le coût augmente à chaque achat.</p>
                <p className="text-xs mt-2">Vous possédez : <strong className="text-purple-300">{formatNumber(quantumShards)} FQ</strong></p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
                <button
                    onClick={onBuy}
                    disabled={!canAfford}
                    className={`w-full px-4 py-2 rounded-md text-xs font-bold transition-colors
                        ${canAfford ? 'bg-purple-700 hover:bg-purple-600' : 'bg-red-900 cursor-not-allowed'}
                    `}
                >
                    Acheter (+1 FQ)
                    <span className="block text-[10px] opacity-80">Coût: {formatNumber(cost)} ⚡</span>
                </button>
            </div>
        </div>
    );
};


const ShopPopup: React.FC<ShopPopupProps> = ({ 
    quantumShards, 
    energy, 
    purchasedShopUpgrades, 
    onBuy, 
    formatNumber, 
    hasUnseenShopItems, 
    isCoreUnlocked, 
    onBuyQuantumShard,
    markShopItemsAsSeen,
    canAffordFragment,
}) => {
    const [activeTab, setActiveTab] = useState<'upgrades' | 'fragments'>('upgrades');
    const scrollableRef = useRef<HTMLDivElement>(null);
    useDragToScroll(scrollableRef);

    const [animationClass, setAnimationClass] = useState('');
    const [displayedUpgrade, setDisplayedUpgrade] = useState<ShopUpgrade | null>(null);

    const nextUnpurchasedUpgrade = useMemo(() => {
        return SHOP_UPGRADES.find(upg => !purchasedShopUpgrades.includes(upg.id));
    }, [purchasedShopUpgrades]);
    
    // Effect to handle the transition between upgrades
    useEffect(() => {
        if (nextUnpurchasedUpgrade?.id !== displayedUpgrade?.id) {
            if (displayedUpgrade) {
                 setTimeout(() => {
                    setDisplayedUpgrade(nextUnpurchasedUpgrade || null);
                    setAnimationClass('animate-shop-card-enter');
                }, 300); // Must match animation duration
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
        }, 300); // Animation duration
    };


    useEffect(() => {
        if (hasUnseenShopItems) {
            setActiveTab('upgrades');
        } else if (canAffordFragment) {
            setActiveTab('fragments');
        }
    }, [hasUnseenShopItems, canAffordFragment]);

    const handleTabClick = (tab: 'upgrades' | 'fragments') => {
        setActiveTab(tab);
        if (tab === 'upgrades' && hasUnseenShopItems) {
            markShopItemsAsSeen();
        }
    };

    const tabs = [
        { id: 'upgrades', name: 'Améliorations Perm.', hasNotification: hasUnseenShopItems },
        { id: 'fragments', name: 'Fragments Quantiques', hasNotification: canAffordFragment }
    ];

    const renderUpgradeCard = () => {
        if (!displayedUpgrade) {
            return (
                 <div className="text-center text-xs opacity-50 mt-6 p-4 bg-black/20 rounded-lg animate-fade-in-fast">
                    <p>Toutes les améliorations ont été achetées.</p>
                    <p>De nouveaux articles pourraient apparaître à l'avenir.</p>
                </div>
            )
        }

        const canAfford = displayedUpgrade.currency === 'energy'
            ? energy >= displayedUpgrade.cost
            : quantumShards >= displayedUpgrade.cost;
        const buttonText = canAfford ? "Acheter" : "Fonds insuffisants";
        const currencySymbol = displayedUpgrade.currency === 'energy' ? '⚡' : 'FQ';

        return (
             <div className={`bg-[var(--bg-upgrade)] p-3 rounded-lg flex flex-col md:flex-row gap-4 items-center relative ${animationClass}`}>
                {hasUnseenShopItems && (
                    <div className="absolute -left-1 top-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-red" title="Nouvel article !"></div>
                )}
                <div className="w-12 h-12">
                    <ShopIconRenderer iconId={displayedUpgrade.icon} className="w-full h-full" />
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h4 className="text-base font-bold text-yellow-400">{displayedUpgrade.name}</h4>
                    <p className="text-xs opacity-80 mt-1">{displayedUpgrade.description}</p>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto">
                    <button
                        onClick={() => handleBuyClick(displayedUpgrade.id)}
                        disabled={!canAfford}
                        className={`w-full px-4 py-2 rounded-md text-xs font-bold transition-colors
                            ${canAfford ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-red-900 cursor-not-allowed'}
                        `}
                    >
                        {buttonText} ({formatNumber(displayedUpgrade.cost)} {currencySymbol})
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-2xl text-center text-[var(--text-header)] mb-2">Boutique Permanente</h2>
            
            <div className="flex justify-center border-b border-[var(--border-color)] mb-4">
                {tabs.map(tab => (
                    (tab.id === 'fragments' && !isCoreUnlocked) ? null : (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id as 'upgrades' | 'fragments')}
                            className={`px-3 py-2 text-xs sm:text-sm md:text-base transition-all duration-300 relative ${activeTab === tab.id ? 'text-[var(--text-header)]' : 'text-gray-400'}`}
                        >
                            <span className="relative flex items-center gap-2">
                                {tab.name}
                                {tab.hasNotification && (
                                    <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse-red"></span>
                                )}
                            </span>
                             {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-header)]"></div>}
                        </button>
                    )
                ))}
            </div>

            <div ref={scrollableRef} className="flex-grow overflow-y-auto pr-2 custom-scrollbar mt-2 scroll-contain">
                {activeTab === 'upgrades' && (
                    <>
                        <div className="bg-black/30 p-2 rounded-lg text-center text-xs mb-4">
                            <p>Les améliorations achetées ici sont permanentes et persistent à travers les Ascensions.</p>
                        </div>
                        <div className="space-y-3 min-h-[110px]">
                            {renderUpgradeCard()}
                        </div>
                    </>
                )}

                {activeTab === 'fragments' && isCoreUnlocked && (
                    <div className="space-y-4">
                        <div className="bg-black/30 p-2 rounded-lg text-center text-xs">
                            <p>Achetez des Fragments Quantiques avec de l'énergie. Le coût augmente exponentiellement.</p>
                        </div>
                        <QuantumFragmentCard 
                            quantumShards={quantumShards}
                            energy={energy}
                            onBuy={onBuyQuantumShard}
                            formatNumber={formatNumber}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopPopup;