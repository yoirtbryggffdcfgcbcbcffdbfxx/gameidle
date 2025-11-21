
import { Notification, Achievement, GameState } from '../../types';
import { useGameState } from '../useGameState';
import { BANK_CONSTRUCTION_COST, BANK_UPGRADES } from '../../data/bank';

type BankHandlersProps = {
    computed: ReturnType<typeof useGameState>['computed'];
    actions: ReturnType<typeof useGameState>['actions'];
    playSfx: (sound: 'click' | 'buy') => void;
    addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    memoizedFormatNumber: (num: number) => string;
    gameState: GameState;
};

export const useBankHandlers = ({
    computed,
    actions,
    playSfx,
    addMessage,
    memoizedFormatNumber,
    gameState,
}: BankHandlersProps) => {
    
    const onBuildBank = () => {
        if (gameState.energy >= BANK_CONSTRUCTION_COST && !gameState.isBankUnlocked) {
            actions.buildBank(BANK_CONSTRUCTION_COST);
            playSfx('buy');
            addMessage("Banque construite ! L'épargne et les prêts sont disponibles.", 'info', { title: 'Système Bancaire en Ligne' });
        } else {
            addMessage("Pas assez d'énergie pour construire la banque.", 'error');
        }
    };
    
    const onDepositSavings = (amount: number) => {
        if (isNaN(amount) || amount <= 0) {
            addMessage("Montant invalide.", 'error');
            return;
        }
        const actualAmount = Math.min(amount, gameState.energy);
        if (actualAmount > 0) {
            actions.depositSavings(actualAmount);
            playSfx('click');
            addMessage(`${memoizedFormatNumber(actualAmount)} énergie déposée.`, 'info');
        } else {
            addMessage("Pas assez d'énergie.", 'error');
        }
    };

    // La décision "repayLoan" est prise par l'UI (SavingsPanel) avant d'appeler ce handler
    const onWithdrawSavings = (amount: number, repayLoan: boolean) => {
        if (isNaN(amount) || amount <= 0) {
             addMessage("Montant invalide.", 'error');
             return;
        }

        const actualWithdrawAmount = Math.min(amount, gameState.savingsBalance);
        
        if (actualWithdrawAmount > 0) {
            actions.withdrawSavings(actualWithdrawAmount, repayLoan);
            playSfx('click');
            
            if (repayLoan && gameState.currentLoan) {
                 addMessage(`Retrait effectué. Prêt remboursé en priorité.`, 'info');
            } else {
                 addMessage(`${memoizedFormatNumber(actualWithdrawAmount)} énergie retirée.`, 'info');
            }

        } else {
            addMessage("Solde épargne insuffisant.", 'error');
        }
    };

    const onTakeOutLoan = (amount: number) => {
        if (gameState.currentLoan) {
            addMessage("Vous avez déjà un prêt en cours.", 'error');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            addMessage("Le montant du prêt est invalide.", 'error');
            return;
        }
        
        const maxLoan = Number.MAX_VALUE;
        if (amount > maxLoan) {
            addMessage(`Le montant dépasse la capacité mathématique de l'univers.`, 'error');
            return;
        }
        
        // Règle des 20% du montant emprunté (Le principal) comme collatéral
        const requiredCollateral = amount * 0.20;
        
        if (gameState.energy < requiredCollateral) {
            addMessage(`Apport insuffisant. Il vous faut 20% du montant emprunté (${memoizedFormatNumber(requiredCollateral)} énergie).`, 'error');
            return;
        }

        actions.takeOutLoan(amount);
        playSfx('buy');
        addMessage(`Prêt de ${memoizedFormatNumber(amount)} énergie accordé.`, 'info', { title: 'Crédit Approuvé' });
    };
    
    const onUpgradeBank = () => {
        if (gameState.bankLevel >= BANK_UPGRADES.length - 1) {
            addMessage("La banque est déjà au niveau maximum.", 'error');
            return;
        }
        const nextUpgrade = BANK_UPGRADES[gameState.bankLevel + 1];
        if (gameState.energy < nextUpgrade.cost) {
            addMessage("Pas assez d'énergie pour l'amélioration.", 'error');
            return;
        }
        
        // Bloquer l'amélioration si prêt actif
        if (gameState.currentLoan) {
            addMessage("Impossible d'améliorer la banque avec une dette active !", 'error');
            return;
        }

        actions.upgradeBank();
        const newLevel = gameState.bankLevel + 1;
        playSfx('buy');
        addMessage(`Banque améliorée au niveau ${newLevel}!`, 'info', { title: 'Amélioration Bancaire' });
    };

    const onRepayLoan = (amount: number) => {
        if (!gameState.currentLoan) {
            addMessage("Aucun prêt à rembourser.", 'error');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            addMessage("Montant invalide.", 'error');
            return;
        }
        const actualRepayment = Math.min(amount, gameState.energy, gameState.currentLoan.remaining);
        
        if (actualRepayment <= 0) {
            addMessage("Pas assez d'énergie.", 'error');
            return;
        }
        
        actions.repayLoanManually(amount);
        playSfx('click');
        addMessage(`${memoizedFormatNumber(actualRepayment)} remboursés.`, 'info');
    };
    
    return {
        onBuildBank,
        onDepositSavings,
        onWithdrawSavings,
        onTakeOutLoan,
        onUpgradeBank,
        onRepayLoan,
    };
};
