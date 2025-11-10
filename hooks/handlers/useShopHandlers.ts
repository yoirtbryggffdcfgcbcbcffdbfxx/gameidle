import { Notification, Achievement } from '../../types';
import { useGameState } from '../useGameState';

type ShopHandlersProps = {
    actions: ReturnType<typeof useGameState>['actions'];
    playSfx: (sound: 'buy') => void;
    addNotification: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
};

export const useShopHandlers = ({
    actions,
    playSfx,
    addNotification,
}: ShopHandlersProps) => {

    const onBuyShopUpgrade = (id: string) => {
        if (actions.buyShopUpgrade(id)) {
            playSfx('buy');
            addNotification("Amélioration permanente achetée !", 'info');
        } else {
            addNotification("Pas assez de Fragments Quantiques !", 'error');
        }
    };

    return {
        onBuyShopUpgrade,
    };
};
