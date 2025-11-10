import { useState, useMemo, useCallback } from 'react';
import { Upgrade } from '../../types';

interface EnrichedUpgradeItem {
    upgradeData: Upgrade;
    originalIndex: number;
    productionContribution?: number;
    efficiencyScore?: number;
}

interface UseForgeProps {
    visibleUpgrades: EnrichedUpgradeItem[];
    productionTotal: number;
    energy: number;
    purchasedShopUpgrades: string[];
    playSfx: (sound: 'click') => void;
}

export const useForge = ({
    visibleUpgrades,
    productionTotal,
    energy,
    purchasedShopUpgrades,
    playSfx,
}: UseForgeProps) => {
    const [activeTab, _setActiveTab] = useState<'PRODUCTION' | 'CLICK' | 'BOOSTER'>('PRODUCTION');
    const [buyAmount, _setBuyAmount] = useState<1 | 10 | 100 | 'MAX'>(1);

    const tabs: { id: 'PRODUCTION' | 'CLICK' | 'BOOSTER'; name: string; icon: string; }[] = [
        { id: 'PRODUCTION', name: 'Production', icon: '⚡' },
        { id: 'CLICK', name: 'Clic', icon: '🖱️' },
        { id: 'BOOSTER', name: 'Booster', icon: '🚀' },
    ];

    const buyOptions: (1 | 10 | 100 | 'MAX')[] = [1, 10, 100, 'MAX'];

    const setActiveTab = useCallback((tabId: 'PRODUCTION' | 'CLICK' | 'BOOSTER') => {
        playSfx('click');
        _setActiveTab(tabId);
    }, [playSfx]);
    
    const setBuyAmount = useCallback((amount: 1 | 10 | 100 | 'MAX') => {
        playSfx('click');
        _setBuyAmount(amount);
    }, [playSfx]);

    const enrichedAndFilteredUpgrades = useMemo(() => {
        const filtered = visibleUpgrades.filter(item => item.upgradeData.type === activeTab);
        
        if (activeTab !== 'PRODUCTION' || productionTotal <= 0) return filtered;

        const withStats = filtered.map(item => {
            const upgrade = item.upgradeData;
            let productionContribution = 0;
            let efficiencyScore = 0;
            
            const itemProduction = upgrade.production * upgrade.owned;
            productionContribution = (itemProduction / productionTotal) * 100;
            
            efficiencyScore = upgrade.currentCost > 0 ? upgrade.production / upgrade.currentCost : Infinity;

            return {
                ...item,
                productionContribution,
                efficiencyScore,
            };
        });

        return withStats.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
    }, [visibleUpgrades, activeTab, productionTotal]);
    
    const mostEfficientId = useMemo(() => {
        if (!purchasedShopUpgrades.includes('efficiency_analyzer')) {
            return null;
        }

        if (activeTab === 'PRODUCTION' && enrichedAndFilteredUpgrades.length > 0) {
            const first = enrichedAndFilteredUpgrades[0];
            if (energy >= first.upgradeData.currentCost) {
                return first.upgradeData.id;
            }
        }
        return null;
    }, [enrichedAndFilteredUpgrades, activeTab, energy, purchasedShopUpgrades]);
    
    return {
        activeTab,
        setActiveTab,
        buyAmount,
        setBuyAmount,
        enrichedAndFilteredUpgrades,
        mostEfficientId,
        tabs,
        buyOptions,
    };
};
