import { Notification, Achievement } from '../../types';
import { useGameState } from '../useGameState';
import { BANK_CONSTRUCTION_COST } from '../../data/bank';

type BankHandlersProps = {
    computed: ReturnType<typeof useGameState>['computed'];
    actions: ReturnType<typeof useGameState>['actions'];
    playSfx: (sound: 'click' | 'buy') => void;
    addNotification: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    memoizedFormatNumber: (num: number) => string;
};

export const useBankHandlers = ({
    computed,
    actions,
    playSfx,
    addNotification,
    memoizedFormatNumber,
}: BankHandlersProps) => {
    
    const onBuildBank = () => {
        if (actions.buildBank(BANK_CONSTRUCTION_COST)) {
            playSfx('buy');
            addNotification("Banque construite ! L'épargne et les prêts sont disponibles.", 'info', { title: 'Système Bancaire en Ligne' });
        } else {
            addNotification("Pas assez d'énergie pour construire la banque.", 'error');
        }
    };
    
    const onDepositSavings = (amount: number) => {
        if (actions.depositSavings(amount)) {
            playSfx('click');
            addNotification(`${memoizedFormatNumber(amount)} énergie déposée.`, 'info');
        } else {
            addNotification("Montant invalide ou pas assez d'énergie.", 'error');
        }
    };

    const onWithdrawSavings = (amount: number) => {
        const result = actions.withdrawSavings(amount);
        if (result.success) {
            playSfx('click');
            let message = '';
            if (result.repaidAmount && result.repaidAmount > 0) {
                message = `${memoizedFormatNumber(result.repaidAmount)} a remboursé votre prêt.`;
                if (result.toEnergyAmount && result.toEnergyAmount > 0) {
                    message += ` ${memoizedFormatNumber(result.toEnergyAmount)} a été ajouté à votre énergie.`;
                }
            } else {
                message = `${memoizedFormatNumber(result.withdrawnAmount || 0)} énergie retirée.`;
            }
            addNotification(message, 'info');
        } else {
            addNotification("Montant invalide ou solde insuffisant.", 'error');
        }
    };

    const onTakeOutLoan = (amount: number) => {
        const result = actions.takeOutLoan(amount);
        if (result.success) {
            playSfx('buy');
            addNotification(`Prêt de ${memoizedFormatNumber(amount)} énergie obtenu.`, 'info', { title: 'Prêt Approuvé' });
        } else {
             let message = "Impossible d'obtenir le prêt.";
             switch (result.reason) {
                case 'loan_exists': message = "Vous avez déjà un prêt en cours."; break;
                case 'exceeds_max': message = `Le prêt ne peut pas dépasser 10% de votre capacité max (${memoizedFormatNumber(computed.maxEnergy * 0.1)}).`; break;
                case 'insufficient_collateral':
                    const repaymentTotal = amount * (1 + computed.bankBonuses.loanInterest);
                    const requiredCollateral = repaymentTotal * 0.10;
                    message = `Vous devez posséder au moins 10% du total à rembourser (${memoizedFormatNumber(requiredCollateral)}) pour ce prêt.`; break;
                case 'invalid_amount': message = "Le montant du prêt est invalide."; break;
             }
             addNotification(message, 'error');
        }
    };
    
    const onUpgradeBank = () => {
        const result = actions.upgradeBank();
        if (result.success && result.newLevel) {
            playSfx('buy');
            addNotification(`Banque améliorée au niveau ${result.newLevel}!`, 'info', { title: 'Amélioration Bancaire' });
        } else {
            let message = "Amélioration impossible.";
            if (result.reason === 'max_level') message = "La banque est déjà au niveau maximum.";
            if (result.reason === 'insufficient_energy') message = "Pas assez d'énergie pour l'amélioration.";
            if (result.reason === 'loan_active') message = "Vous ne pouvez pas améliorer la banque avec un prêt en cours.";
            addNotification(message, 'error');
        }
    };
    
    return {
        onBuildBank,
        onDepositSavings,
        onWithdrawSavings,
        onTakeOutLoan,
        onUpgradeBank,
    };
};
