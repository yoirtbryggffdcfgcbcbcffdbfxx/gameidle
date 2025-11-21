
import React, { useMemo } from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { CORE_UNLOCK_TOTAL_ENERGY } from '../../data/core';
import { SHOP_UNLOCK_TOTAL_ENERGY } from '../../data/shop';
import { BANK_UNLOCK_TOTAL_ENERGY } from '../../data/bank';
import { ShopIcon, CoreIcon, BankIcon, InfinityIcon } from '../../components/core/EnergyBarIcons';

export interface StageConfig {
    label: string;
    target: number;
    Icon: React.FC<{ className?: string }>;
    isLogarithmic?: boolean;
    gradient: string;
}

// --- Helper: Détermine l'étape actuelle ---
const getStageConfig = (
    isShopUnlocked: boolean, 
    isCoreUnlocked: boolean, 
    isBankDiscovered: boolean
): StageConfig => {
    if (!isShopUnlocked) {
        return { 
            label: 'La Boutique !', 
            target: SHOP_UNLOCK_TOTAL_ENERGY, 
            Icon: ShopIcon, 
            gradient: "from-[#00ffcc] to-[#0044ff]" 
        };
    }
    if (!isCoreUnlocked) {
        return { 
            label: 'Le Cœur Quantique !', 
            target: CORE_UNLOCK_TOTAL_ENERGY, 
            Icon: CoreIcon, 
            gradient: "from-[#00ffcc] to-[#0044ff]" 
        };
    }
    // Si la banque n'est pas encore DÉCOUVERTE, c'est l'objectif actuel.
    if (!isBankDiscovered) {
        return { 
            label: 'La Banque !', 
            target: BANK_UNLOCK_TOTAL_ENERGY, 
            Icon: BankIcon, 
            gradient: "from-[#00ffcc] to-[#0044ff]" 
        };
    }
    // Phase Singularité (Finale) - Une fois la banque atteinte
    return { 
        label: "Singularité Finale", 
        target: Number.MAX_VALUE, 
        Icon: InfinityIcon, 
        isLogarithmic: true,
        gradient: "from-[#ff00cc] via-[#a855f7] to-[#4f46e5] animate-pulse-slow" 
    };
};

export const useEnergyBarLogic = () => {
    const { gameState, memoizedFormatNumber } = useGameContext();
    const { energy, isCoreUnlocked, isShopUnlocked, isBankDiscovered } = gameState;

    // Détermination de la configuration visuelle
    const config = useMemo(() => 
        getStageConfig(isShopUnlocked, isCoreUnlocked, isBankDiscovered),
    [isShopUnlocked, isCoreUnlocked, isBankDiscovered]);

    // Calcul de la progression et du texte
    const { percentage, barText } = useMemo(() => {
        let pct = 0;
        let txt = "";

        if (config.isLogarithmic) {
            // Mode Logarithmique (Singularité)
            const logCurrent = Math.log10(Math.max(1, energy));
            const logMax = Math.log10(Number.MAX_VALUE);
            pct = (logCurrent / logMax) * 100;
            // Utilisation du même formateur que le reste de l'app pour la cohérence (k, M, B...)
            txt = `${memoizedFormatNumber(energy)} / ${memoizedFormatNumber(config.target)}`;
        } else {
            // Mode Linéaire Classique
            pct = Math.min((energy / config.target) * 100, 100);
            txt = `${memoizedFormatNumber(energy)} / ${memoizedFormatNumber(config.target)}`;
            if (energy > config.target) txt = `${memoizedFormatNumber(energy)} (Surcharge)`;
        }
        return { percentage: Math.max(0, Math.min(pct, 100)), barText: txt };
    }, [energy, config, memoizedFormatNumber]);

    return {
        config,
        percentage,
        barText,
        memoizedFormatNumber // Exporté pour usage dans le tooltip si besoin
    };
};
