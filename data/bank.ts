export const BANK_UNLOCK_TOTAL_ENERGY = 1000000;
export const BANK_CONSTRUCTION_COST = 500000;
export const SAVINGS_INTEREST_RATE = 0.001; // 0.1% per second (Base Rate)
export const LOAN_INTEREST_RATE = 0.20; // 20% flat interest (Base Rate)
export const LOAN_REPAYMENT_RATE = 0.50; // 50% of income goes to repayment

export const BANK_UPGRADES = [
    // Level 0 (Base)
    { cost: 0, savingsInterest: 0.001, loanInterest: 0.20, description: "Taux d'épargne à 0.1%." },
    // Level 1
    { cost: 1e6, savingsInterest: 0.005, loanInterest: 0.20, description: "Améliore le taux d'épargne à 0.5%." },
    // Level 2
    { cost: 1e8, savingsInterest: 0.005, loanInterest: 0.15, description: "Réduit l'intérêt des prêts à 15%." },
    // Level 3
    { cost: 1e9, savingsInterest: 0.008, loanInterest: 0.15, description: "Améliore le taux d'épargne à 0.8%." }
];