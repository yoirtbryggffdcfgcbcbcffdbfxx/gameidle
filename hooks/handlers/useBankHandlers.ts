import { Notification, Achievement, GameState } from '../../types';
import { useGameState } from '../useGameState';
import { BANK_CONSTRUCTION_COST, BANK_UPGRADES } from '../../data/bank';

type BankHandlersProps = {
    computed: ReturnType<typeof useGameState>['computed'];
    actions: ReturnType<typeof useGameState>['actions'];
    playSfx: (sound: 'click' | 'buy') => void;
    addNotification: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    memoizedFormatNumber: (num: number) => string;
    gameState: GameState;
};

export const useBankHandlers = ({
    computed,
    actions,
    playSfx,
    addNotification,
    memoizedFormatNumber,
    gameState,
}: BankHandlersProps) => {
    
    const onBuildBank = () => {
        if (gameState.energy >= BANK_CONSTRUCTION_COST && !gameState.isBankUnlocked) {
            actions.buildBank(BANK_CONSTRUCTION_COST);
            playSfx('buy');
            addNotification("Banque construite ! L'épargne et les prêts sont disponibles.", 'info', { title: 'Système Bancaire en Ligne' });
        } else {
            addNotification("Pas assez d'énergie pour construire la banque.", 'error');
        }
    };
    
    const onDepositSavings = (amount: number) => {
        const actualAmount = Math.min(amount, gameState.energy);
        if (actualAmount > 0) {
            actions.depositSavings(amount);
            playSfx('click');
            addNotification(`${memoizedFormatNumber(actualAmount)} énergie déposée.`, 'info');
        } else {
            addNotification("Montant invalide ou pas assez d'énergie.", 'error');
        }
    };

    const onWithdrawSavings = (amount: number) => {
        const actualWithdrawAmount = Math.min(amount, gameState.savingsBalance);
        if (actualWithdrawAmount > 0) {
            actions.withdrawSavings(amount);
            playSfx('click');
            
            let repaidAmount = 0;
            let toEnergyAmount = actualWithdrawAmount;
            if (gameState.currentLoan) {
                const repayment = Math.min(actualWithdrawAmount, gameState.currentLoan.remaining);
                repaidAmount = repayment;
                toEnergyAmount -= repayment;
            }

            let message = '';
            if (repaidAmount > 0) {
                message = `${memoizedFormatNumber(repaidAmount)} a remboursé votre prêt.`;
                if (toEnergyAmount > 0) {
                    message += ` ${memoizedFormatNumber(toEnergyAmount)} a été ajouté à votre énergie.`;
                }
            } else {
                message = `${memoizedFormatNumber(actualWithdrawAmount)} énergie retirée.`;
            }
            addNotification(message, 'info');
        } else {
            addNotification("Montant invalide ou solde insuffisant.", 'error');
        }
    };

    const onTakeOutLoan = (amount: number) => {
        if (gameState.currentLoan) {
            addNotification("Vous avez déjà un prêt en cours.", 'error');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            addNotification("Le montant du prêt est invalide.", 'error');
            return;
        }
        const maxLoan = computed.maxEnergy * 0.10;
        if (amount > maxLoan) {
            addNotification(`Le prêt ne peut pas dépasser 10% de votre capacité max (${memoizedFormatNumber(maxLoan)}).`, 'error');
            return;
        }
        const repaymentTotal = amount * (1 + computed.bankBonuses.loanInterest);
        const requiredCollateral = repaymentTotal * 0.10;
        if (gameState.energy < requiredCollateral) {
            addNotification(`Vous devez posséder au moins 10% du total à rembourser (${memoizedFormatNumber(requiredCollateral)}) pour ce prêt.`, 'error');
            return;
        }

        actions.takeOutLoan(amount);
        playSfx('buy');
        addNotification(`Prêt de ${memoizedFormatNumber(amount)} énergie obtenu.`, 'info', { title: 'Prêt Approuvé' });
    };
    
    const onUpgradeBank = () => {
        if (gameState.bankLevel >= BANK_UPGRADES.length - 1) {
            addNotification("La banque est déjà au niveau maximum.", 'error');
            return;
        }
        const nextUpgrade = BANK_UPGRADES[gameState.bankLevel + 1];
        if (gameState.energy < nextUpgrade.cost) {
            addNotification("Pas assez d'énergie pour l'amélioration.", 'error');
            return;
        }
        if (gameState.currentLoan) {
            addNotification("Vous ne pouvez pas améliorer la banque avec un prêt en cours.", 'error');
            return;
        }

        actions.upgradeBank();
        const newLevel = gameState.bankLevel + 1;
        playSfx('buy');
        addNotification(`Banque améliorée au niveau ${newLevel}!`, 'info', { title: 'Amélioration Bancaire' });
    };

    const onRepayLoan = (amount: number) => {
        if (!gameState.currentLoan) {
            addNotification("Remboursement impossible : pas de prêt en cours.", 'error');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            addNotification("Montant invalide.", 'error');
            return;
        }
        const actualRepayment = Math.min(amount, gameState.energy, gameState.currentLoan.remaining);
        if (actualRepayment <= 0) {
            addNotification("Vous n'avez pas assez d'énergie pour ce remboursement.", 'error');
            return;
        }
        
        actions.repayLoanManually(amount);
        playSfx('click');
        addNotification(`${memoizedFormatNumber(actualRepayment)} énergie utilisée pour rembourser le prêt.`, 'info');
        
        if (actualRepayment >= gameState.currentLoan.remaining) {
            addNotification("Votre prêt a été entièrement remboursé !", 'info', { title: "Prêt Remboursé" });
        }
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