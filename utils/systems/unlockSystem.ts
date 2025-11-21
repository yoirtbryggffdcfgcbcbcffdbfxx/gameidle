
import { GameState } from '../../types';
import { SHOP_UNLOCK_TOTAL_ENERGY } from '../../data/shop';
import { CORE_UNLOCK_TOTAL_ENERGY } from '../../data/core';
import { BANK_UNLOCK_TOTAL_ENERGY } from '../../data/bank';

export const processUnlockSystem = (
    currentState: GameState,
    newEnergy: number
) => {
    const updates: Partial<GameState> = {};
    let coreChargeReset = false;

    if (newEnergy >= SHOP_UNLOCK_TOTAL_ENERGY && !currentState.isShopUnlocked) {
        updates.isShopUnlocked = true;
        updates.hasUnseenShopItems = true;
    }
    if (newEnergy >= CORE_UNLOCK_TOTAL_ENERGY && !currentState.isCoreUnlocked) {
        updates.isCoreUnlocked = true;
        coreChargeReset = true;
    }
    if (newEnergy >= BANK_UNLOCK_TOTAL_ENERGY && !currentState.isBankDiscovered) {
        updates.isBankDiscovered = true;
    }

    return { updates, coreChargeReset };
};
