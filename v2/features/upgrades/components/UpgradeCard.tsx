import React, { useCallback } from 'react';
import { useGameDispatch, useGameSelector } from '../../../lib/context';
import { buyUpgrade, buyTierUpgrade } from '../actions';
import { Upgrade } from '../model';
import { selectUpgradeCost, selectTierUpgradeCost, formatNumber } from '../../../lib/selectors';
import UpgradeIcon from './UpgradeIcon';
import UpgradeStats from './UpgradeStats';
import UpgradeAction from './UpgradeAction';

// Composant Memoïsé pour la performance (20/20 requirement)
export const UpgradeCard = React.memo(({ u }: { u: Upgrade }) => {
    const dispatch = useGameDispatch();

    // Sélecteur atomique pour éviter le re-render de toute la liste si l'énergie change
    const currentCost = selectUpgradeCost(u.baseCost, u.owned, u.nextLevelCostOverride);
    const canAfford = useGameSelector(state => state.resources.energy >= currentCost);

    // Logique de Tier Upgrade
    const isTierAvailable = u.owned > 0 && u.owned % 10 === 0 && u.tier < u.owned / 10;
    const tierCost = isTierAvailable ? selectTierUpgradeCost(u.baseCost, u.owned, u.nextLevelCostOverride) : 0;
    const canAffordTier = useGameSelector(state => state.resources.energy >= tierCost);

    // Calculs pour l'affichage
    const TIER_MULTIPLIER = u.type === 'BOOSTER' ? 2 : 3;
    const productionPerUnit = u.baseProduction * Math.pow(TIER_MULTIPLIER, u.tier);
    const totalProduction = productionPerUnit * u.owned;

    const productionLabel = u.type === 'CLICK' ? '/clic' : u.type === 'BOOSTER' ? '%' : '/s';
    const isBoosterUpgrade = u.type === 'BOOSTER';
    const isMaxLevel = u.owned >= 1000;

    const handleBuy = useCallback(() => {
        if (canAfford) {
            dispatch(buyUpgrade(u.id, currentCost));
        }
    }, [dispatch, u.id, currentCost, canAfford]);

    const handleBuyTier = useCallback(() => {
        if (canAffordTier) {
            dispatch(buyTierUpgrade(u.id, tierCost));
        }
    }, [dispatch, u.id, tierCost, canAffordTier]);

    return (
        <div
            className="group relative flex flex-col sm:flex-row items-stretch bg-[#111] rounded-md overflow-hidden transition-all duration-300 w-full max-w-full border-l-4 shadow-lg hover:bg-[#161616] mb-2"
            style={{ borderLeftColor: u.color }}
        >
            <UpgradeIcon
                type={u.type}
                color={u.color}
                tierRank={`MK-${u.tier + 1}`}
            />

            <UpgradeStats
                name={u.name}
                owned={u.owned}
                color={u.color}
                productionValue={formatNumber(productionPerUnit)}
                productionLabel={productionLabel}
                totalProductionValue={formatNumber(totalProduction)}
                isAtTierThreshold={isTierAvailable}
                isBoosterUpgrade={isBoosterUpgrade}
            />

            <UpgradeAction
                isMaxLevel={isMaxLevel}
                isAtTierThreshold={isTierAvailable}
                canAfford={isTierAvailable ? canAffordTier : canAfford}
                tierUpgradeCost={tierCost}
                purchaseCost={currentCost}
                onBuy={handleBuy}
                onBuyTierUpgrade={handleBuyTier}
                formatNumber={formatNumber}
                hasDiscount={!!u.nextLevelCostOverride}
            />
        </div>
    );
});
