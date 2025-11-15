// hooks/ui/useForge.ts
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Upgrade } from '../../types';
import { MAX_UPGRADE_LEVEL } from '../../constants';
import { calculateBulkBuy } from '../../utils/helpers';
import LayersIcon from '../../components/ui/LayersIcon';
import ZapIcon from '../../components/ui/ZapIcon';
import MousePointerIcon from '../../components/ui/MousePointerIcon';
import RocketIcon from '../../components/ui/RocketIcon';

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
    costMultiplier: number;
}

export type BuyAmount = 1 | 10 | 100 | 'MAX';

export const useForge = ({
    visibleUpgrades,
    energy,
    purchasedShopUpgrades,
    playSfx,
    newlyVisibleUpgradeIds,
    newlyVisibleUpgradeTypes,
    viewedCategories,
    onTabClick,
    costMultiplier,
}: UseForgeProps) => {
    const [activeTab, setActiveTab] = useState('all');
    const [buyAmount, setBuyAmountState] = useState<BuyAmount>(1);

    const hasUnseenNotifications = useMemo(() => {
        return newlyVisibleUpgradeTypes.size > 0 && 
            [...newlyVisibleUpgradeTypes].some(type => !viewedCategories.has(type as string));
    }, [newlyVisibleUpgradeTypes, viewedCategories]);

    const tabs = useMemo(() => {
        const iconClass = "w-5 h-5";
        // FIX: Replaced JSX syntax with React.createElement to be valid in a .ts file.
        // This resolves a cascade of parsing errors.
        return [
            { id: 'all', name: 'Tout', icon: React.createElement(LayersIcon, { className: iconClass }), color: '#d1d5db' },
            { id: 'PRODUCTION', name: 'Prod', icon: React.createElement(ZapIcon, { className: iconClass }), color: '#33ffcc' },
            { id: 'CLICK', name: 'Clic', icon: React.createElement(MousePointerIcon, { className: iconClass }), color: '#ff9900' },
            { id: 'BOOSTER', name: 'Boost', icon: React.createElement(RocketIcon, { className: iconClass }), color: '#a855f7' },
        ].map(tab => ({
            ...tab,
            hasNotification: tab.id === 'all' 
                ? hasUnseenNotifications
                : newlyVisibleUpgradeTypes.has(tab.id) && !viewedCategories.has(tab.id as string)
        }));
    }, [newlyVisibleUpgradeTypes, viewedCategories, hasUnseenNotifications]);

    const buyOptions: BuyAmount[] = useMemo(() => {
        const options: BuyAmount[] = [1];
        if (purchasedShopUpgrades.includes('buy_multiplier_10')) options.push(10);
        if (purchasedShopUpgrades.includes('buy_multiplier_100')) options.push(100);
        if (purchasedShopUpgrades.includes('buy_multiplier_max')) options.push('MAX');
        return options;
    }, [purchasedShopUpgrades]);

    // Reset buyAmount if the current selection is no longer available (e.g., after prestige)
    useEffect(() => {
        if (!buyOptions.includes(buyAmount)) {
            setBuyAmountState(1);
        }
    }, [buyOptions, buyAmount]);
    
    const setBuyAmount = useCallback((amount: BuyAmount) => {
        playSfx('ui_hover');
        setBuyAmountState(amount);
    }, [playSfx, setBuyAmountState]);

    const handleTabChange = useCallback((tabId: string) => {
        setActiveTab(tabId);
        onTabClick(tabId);
    }, [onTabClick, setActiveTab]);

    const showEfficiencyPercentage = useMemo(() => purchasedShopUpgrades.includes('efficiency_percentage'), [purchasedShopUpgrades]);
    const showEfficiencyHighlight = useMemo(() => purchasedShopUpgrades.includes('efficiency_highlight'), [purchasedShopUpgrades]);

    const upgradesWithCalculatedEfficiency = useMemo(() => {
        return visibleUpgrades.map(item => {
            const upgrade = item.upgradeData;
            
            const isAtTierThreshold = upgrade.owned > 0 && upgrade.owned % 10 === 0 && upgrade.tier < upgrade.owned / 10;

            if (upgrade.type !== 'PRODUCTION' || upgrade.owned >= MAX_UPGRADE_LEVEL || isAtTierThreshold) {
                return { ...item, efficiency: 0 };
            }

            // Calculate efficiency based on the entire batch purchase that is affordable
            // FIX: Destructure `numLevelsBought` from `calculateBulkBuy` as `numToBuy` does not exist on the return type.
            const { numLevelsBought, totalCost } = calculateBulkBuy(upgrade, buyAmount, energy, costMultiplier);
            
            if (numLevelsBought === 0) {
                return { ...item, efficiency: 0 };
            }

            const productionPerUnit = upgrade.baseProduction * Math.pow(2, upgrade.tier);
            const totalProductionIncrease = productionPerUnit * numLevelsBought;
            
            const efficiency = totalCost > 0 ? totalProductionIncrease / totalCost : 0;
            
            return { ...item, efficiency };
        });
    }, [visibleUpgrades, buyAmount, energy, costMultiplier]);

    const mostEfficientId = useMemo(() => {
        if (!showEfficiencyHighlight) return null;

        // The efficiency calculation already considers what's affordable via calculateBulkBuy.
        // So we just need to find the one with the highest non-zero efficiency.
        const productionUpgrades = upgradesWithCalculatedEfficiency.filter(item =>
            item.upgradeData.type === 'PRODUCTION' && item.efficiency > 0
        );

        if (productionUpgrades.length === 0) return null;

        return productionUpgrades.reduce((best, current) => 
            current.efficiency > best.efficiency ? current : best
        ).upgradeData.id;

    }, [upgradesWithCalculatedEfficiency, showEfficiencyHighlight]);

    const enrichedAndFilteredUpgrades = useMemo(() => {
        const newIdsSet = new Set(newlyVisibleUpgradeIds);
        
        const productionUpgrades = upgradesWithCalculatedEfficiency.filter(item => item.upgradeData.type === 'PRODUCTION');
        const maxEfficiency = productionUpgrades.length > 0
            ? Math.max(...productionUpgrades.map(item => item.efficiency))
            : 0;

        const finalUpgrades = upgradesWithCalculatedEfficiency.map(item => {
            const percentage = showEfficiencyPercentage && maxEfficiency > 0 && item.efficiency > 0
                ? (item.efficiency / maxEfficiency) * 100
                : undefined;
            
            return {
                upgradeData: item.upgradeData,
                originalIndex: item.originalIndex,
                efficiencyPercentage: percentage,
                isNew: newIdsSet.has(item.upgradeData.id),
            };
        });

        if (activeTab === 'all') {
            return finalUpgrades;
        }
        return finalUpgrades.filter(item => item.upgradeData.type === activeTab);

    }, [upgradesWithCalculatedEfficiency, showEfficiencyPercentage, newlyVisibleUpgradeIds, activeTab]);

    return {
        activeTab,
        setActiveTab: handleTabChange,
        buyAmount,
        setBuyAmount,
        enrichedAndFilteredUpgrades,
        mostEfficientId,
        tabs,
        buyOptions,
        showEfficiencyPercentage,
        hasUnseenNotifications,
    };
};