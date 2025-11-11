import React, { useRef, useState, useEffect } from 'react';
import { ShopUpgrade } from '../../types';
import { SHOP_UPGRADES } from '../../data/shop';
import { useDragToScroll } from '../../hooks/ui/useDragToScroll';
import { getNextFragmentCost } from '../../data/quantumFragments';

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

const ShopItemCard: React.FC<{
    upgrade: ShopUpgrade;
    isPurchased: boolean;
    canAfford: boolean;
    onBuy: () => void;
    formatNumber: (num: number) => string;
    showNotificationDot: boolean;
}> = ({ upgrade, isPurchased, canAfford, onBuy, formatNumber, showNotificationDot }) => {
    
    let buttonText = "Acheter";
    if (isPurchased) buttonText = "Acheté";
    else if (!canAfford) buttonText = "Fonds insuffisants";
    
    const currencySymbol = upgrade.currency === 'energy' ? '⚡' : 'FQ';

    return (
        <div className={`bg-[var(--bg-upgrade)] p-3 rounded-lg flex flex-col md:flex-row gap-4 items-center relative ${isPurchased ? 'opacity-60' : ''}`}>
            {showNotificationDot && !isPurchased && (
                <div className="absolute -left-1 top-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-red" title="Nouvel article !"></div>
            )}
            <div className="text-4xl">
                {upgrade.icon}
            </div>
            <div className="flex-grow text-center md:text-left">
                <h4 className="text-base font-bold text-yellow-400">{upgrade.name}</h4>
                <p className="text-xs opacity-80 mt-1">{upgrade.description}</p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
                <button
                    onClick={onBuy}
                    disabled={isPurchased || !canAfford}
                    className={`w-full px-4 py-2 rounded-md text-xs font-bold transition-colors
                        ${isPurchased ? 'bg-green-800 cursor-not-allowed' : ''}
                        ${!isPurchased && canAfford ? 'bg-cyan-700 hover:bg-cyan-600' : ''}
                        ${!isPurchased && !canAfford ? 'bg-red-900 cursor-not-allowed' : ''}
                    `}
                >
                    {buttonText} ({formatNumber(upgrade.cost)} {currencySymbol})
                </button>
            </div>
        </div>
    );
};

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
            <div className="text-4xl animate-core-breathe" style={{animationDuration: '3s'}}>
                💠
            </div>
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

    useEffect(() => {
        if (hasUnseenShopItems) {
            setActiveTab('upgrades');
        } else if (canAffordFragment) {
            setActiveTab('fragments');
        }
    }, []);

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
                        <div className="space-y-3">
                            {SHOP_UPGRADES.map(upgrade => {
                                const isPurchased = purchasedShopUpgrades.includes(upgrade.id);
                                const canAfford = upgrade.currency === 'energy'
                                    ? energy >= upgrade.cost
                                    : quantumShards >= upgrade.cost;
                                return (
                                    <ShopItemCard
                                        key={upgrade.id}
                                        upgrade={upgrade}
                                        isPurchased={isPurchased}
                                        canAfford={canAfford}
                                        onBuy={() => onBuy(upgrade.id)}
                                        formatNumber={formatNumber}
                                        showNotificationDot={hasUnseenShopItems}
                                    />
                                );
                            })}
                        </div>
                         <div className="text-center text-xs opacity-50 mt-6">
                            <p>De nouveaux articles apparaîtront bientôt.</p>
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