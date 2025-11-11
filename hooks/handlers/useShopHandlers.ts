import { GameState } from '../../types';
import { SHOP_UPGRADES } from '../../data/shop';
import { useGameState } from '../useGameState';
import { getNextFragmentCost } from '../../data/quantumFragments';

type ShopHandlersProps = {
    gameState: GameState;
    actions: ReturnType<typeof useGameState>['actions'];
    playSfx: (sound: 'buy') => void;
    addNotification: (message: string, type: 'info' | 'error') => void;
};

export const useShopHandlers = ({
    gameState,
    actions,
    playSfx,
    addNotification,
}: ShopHandlersProps) => {

    const onBuyShopUpgrade = (id: string) => {
        const upgrade = SHOP_UPGRADES.find(u => u.id === id);
        if (!upgrade) return;

        if (gameState.purchasedShopUpgrades.includes(id)) {
            return; // Already purchased, do nothing.
        }

        const canAfford = upgrade.currency === 'energy'
            ? gameState.energy >= upgrade.cost
            : gameState.quantumShards >= upgrade.cost;

        if (canAfford) {
            actions.buyShopUpgrade(id);
            playSfx('buy');
            addNotification(`"${upgrade.name}" acheté !`, 'info');
        } else {
            const currencyName = upgrade.currency === 'energy' ? "d'énergie" : "de Fragments Quantiques";
            addNotification(`Pas assez ${currencyName} !`, 'error');
        }
    };

    const onBuyQuantumShard = () => {
        const cost = getNextFragmentCost(gameState.quantumShards);
        if (gameState.energy >= cost) {
            actions.buyQuantumShard();
            playSfx('buy');
            addNotification('1 Fragment Quantique acheté !', 'info');
        } else {
            addNotification("Pas assez d'énergie pour acheter le fragment.", 'error');
        }
    };
    
    return {
        onBuyShopUpgrade,
        onBuyQuantumShard,
    };
};