import React from 'react';
import { useGameContext } from '../../contexts/GameContext';

import GeneralStats from './stats/GeneralStats';
import ProductionStats from './stats/ProductionStats';
import CoreStats from './stats/CoreStats';
import BankStats from './stats/BankStats';
import BonusStats from './stats/BonusStats';


const GameStatsDisplay: React.FC = () => {
    const { gameState, computedState, memoizedFormatNumber } = useGameContext();
    const { 
        purchasedShopUpgrades,
        isBankUnlocked,
        isCoreUnlocked
    } = gameState;
    
    const { 
        productionTotal, 
        clickPower,
        achievementBonuses,
        ascensionBonuses,
        avgProductionLast10s,
        coreBonuses,
        bankBonuses
    } = computedState;

    const showAvgProduction = purchasedShopUpgrades.includes('eps_meter');

    return (
        <div className="p-1 md:p-2 h-full">
            <h3 className="text-lg text-[var(--text-header)] mb-4 text-center">Centre de Statistiques de Carrière</h3>
            
            <GeneralStats gameState={gameState} memoizedFormatNumber={memoizedFormatNumber} />
            <ProductionStats 
                productionTotal={productionTotal}
                clickPower={clickPower}
                avgProductionLast10s={avgProductionLast10s}
                showAvgProduction={showAvgProduction}
                memoizedFormatNumber={memoizedFormatNumber}
            />
            
            {isCoreUnlocked && (
                <CoreStats 
                    gameState={gameState}
                    coreBonuses={coreBonuses}
                    memoizedFormatNumber={memoizedFormatNumber}
                />
            )}

            {isBankUnlocked && (
                <BankStats 
                    gameState={gameState}
                    bankBonuses={bankBonuses}
                    memoizedFormatNumber={memoizedFormatNumber}
                />
            )}

            <BonusStats 
                ascensionBonuses={ascensionBonuses}
                achievementBonuses={achievementBonuses}
            />

        </div>
    );
};

export default GameStatsDisplay;