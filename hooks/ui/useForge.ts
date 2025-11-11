// FIX: This file was created to resolve a module not found error.
import { useState, useMemo, useCallback } from 'react';
import { Upgrade } from '../../types';
import { MAX_UPGRADE_LEVEL } from '../../constants';

// The type for visibleUpgrades passed as a prop
interface VisibleUpgrade {
    upgradeData: Upgrade;
    originalIndex: number;
}

// The type for the enriched upgrades returned by the hook
export interface EnrichedUpgradeItem {
    upgradeData: Upgrade;
    originalIndex: number;
    efficiencyPercentage?: number;
    isNew?: boolean;
}

interface UseForgeProps {
    visibleUpgrades: VisibleUpgrade[];
    energy: number;
    purchasedShopUpgrades: string[];
    playSfx: (sound: 'ui_hover') => void;
    newlyVisibleUpgradeIds: string[];
    newlyVisibleUpgradeTypes: Set<string>;
    viewedCategories: Set<string>;
    onTabClick: (tabId: string) => void;
}

type BuyAmount = 1 | 10 | 100 | 'MAX';

export const useForge = ({
    visibleUpgrades,
    energy,
    purchasedShopUpgrades,
    playSfx,
    newlyVisibleUpgradeIds,
    newlyVisibleUpgradeTypes,
    viewedCategories,
    onTabClick,
}: UseForgeProps) => {
    const [activeTab, setActiveTabState] = useState('all');
    const [buyAmount, setBuyAmountState] = useState<BuyAmount>(1);

    const tabs = useMemo(() => {
        const hasUnseenNotifications = newlyVisibleUpgradeTypes.size > 0 && 
            [...newlyVisibleUpgradeTypes].some(type => !viewedCategories.has(type));

        return [
            { id: 'all', name: 'Tout', icon: '⚙️' },
            { id: 'PRODUCTION', name: 'Prod', icon: '⚡' },
            { id: 'CLICK', name: 'Clic', icon: '🖱️' },
            { id: 'BOOSTER', name: 'Boost', icon: '🚀' },
        ].map(tab => ({
            ...tab,
            hasNotification: tab.id === 'all' 
                ? hasUnseenNotifications
                : newlyVisibleUpgradeTypes.has(tab.id) && !viewedCategories.has(tab.id)
        }));
    }, [newlyVisibleUpgradeTypes, viewedCategories]);

    const buyOptions: BuyAmount[] = useMemo(() => [1, 10, 100, 'MAX'], []);
    
    const setBuyAmount = useCallback((amount: BuyAmount) => {
        playSfx('ui_hover');
        setBuyAmountState(amount);
    }, [playSfx]);

    const setActiveTab = useCallback((tabId: string) => {
        playSfx('ui_hover');
        setActiveTabState(tabId);
        onTabClick(tabId);
    }, [playSfx, onTabClick]);

    const showEfficiencyPercentage = useMemo(() => purchasedShopUpgrades.includes('efficiency_percentage'), [purchasedShopUpgrades]);
    const showEfficiencyHighlight = useMemo(() => purchasedShopUpgrades.includes('efficiency_highlight'), [purchasedShopUpgrades]);

    const enrichedUpgrades = useMemo(() => {
        const productionUpgrades = visibleUpgrades.filter(
            item => item.upgradeData.type === 'PRODUCTION' && item.upgradeData.owned < MAX_UPGRADE_LEVEL
        );
        
        const newIdsSet = new Set(newlyVisibleUpgradeIds);
        
        let efficiencyMap = new Map<string, number>();

        if (showEfficiencyPercentage && productionUpgrades.length > 0) {
            let maxEfficiency = 0;
            const efficiencies = productionUpgrades.map(item => {
                const efficiency = item.upgradeData.production / item.upgradeData.currentCost;
                if (efficiency > maxEfficiency) {
                    maxEfficiency = efficiency;
                }
                return { id: item.upgradeData.id, efficiency };
            });

            if (maxEfficiency > 0) {
                 efficiencies.forEach(item => {
                    efficiencyMap.set(item.id, (item.efficiency / maxEfficiency) * 100);
                });
            }
        }

        return visibleUpgrades.map(item => ({
            ...item,
            efficiencyPercentage: efficiencyMap.get(item.upgradeData.id),
            isNew: newIdsSet.has(item.upgradeData.id),
        }));

    }, [visibleUpgrades, showEfficiencyPercentage, newlyVisibleUpgradeIds]);
    
    const mostEfficientId = useMemo(() => {
        if (!showEfficiencyHighlight) {
            return null;
        }

        // FIX: Removed the incorrect type predicate which was causing a type error.
        // A simple filter is sufficient here as the element types are not being changed.
        const affordableProductionUpgrades = enrichedUpgrades
            .filter(item =>
                item.upgradeData.type === 'PRODUCTION' && 
                item.upgradeData.owned < MAX_UPGRADE_LEVEL &&
                energy >= item.upgradeData.currentCost
            );
        
        if (affordableProductionUpgrades.length === 0) {
            return null;
        }

        const mostEfficient = affordableProductionUpgrades.reduce((best, current) => {
            if (!best) return current;
            const bestEfficiency = best.upgradeData.production / best.upgradeData.currentCost;
            const currentEfficiency = current.upgradeData.production / current.upgradeData.currentCost;
            return currentEfficiency > bestEfficiency ? current : best;
        });

        return mostEfficient?.upgradeData.id;

    }, [enrichedUpgrades, showEfficiencyHighlight, energy]);

    const enrichedAndFilteredUpgrades = useMemo(() => {
        if (activeTab === 'all') {
            return enrichedUpgrades;
        }
        // FIX: Removed the incorrect type predicate which was causing a type error.
        // A simple filter is sufficient as the element types are not being changed.
        return enrichedUpgrades.filter(
            item => item.upgradeData.type === activeTab
        );
    }, [enrichedUpgrades, activeTab]);

    return {
        activeTab,
        setActiveTab,
        buyAmount,
        setBuyAmount,
        enrichedAndFilteredUpgrades,
        mostEfficientId,
        tabs,
        buyOptions,
        showEfficiencyPercentage,
    };
};
