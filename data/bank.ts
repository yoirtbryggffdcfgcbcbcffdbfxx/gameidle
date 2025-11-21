
export const BANK_UNLOCK_TOTAL_ENERGY = 1000000;
export const BANK_CONSTRUCTION_COST = 500000;
export const SAVINGS_INTEREST_RATE = 0.001; // 0.1% per second (Base Rate)
export const LOAN_INTEREST_RATE = 0.20; // 20% flat interest (Base Rate)
export const LOAN_REPAYMENT_RATE = 0.50; // 50% of income goes to repayment

export const BANK_UPGRADES = [
    // Level 0 (Base)
    { cost: 0, savingsInterest: 0.001, loanInterest: 0.20, description: "Taux d'épargne initial à 0.1%." },
    // Level 1
    { cost: 1e6, savingsInterest: 0.005, loanInterest: 0.20, description: "Optimisation des algorithmes. Épargne à 0.5%." },
    // Level 2
    { cost: 1e8, savingsInterest: 0.005, loanInterest: 0.15, description: "Confiance accrue. Réduit l'intérêt des prêts à 15%." },
    // Level 3
    { cost: 1e9, savingsInterest: 0.008, loanInterest: 0.15, description: "Serveurs haute fréquence. Épargne à 0.8%." },
    // Level 4
    { cost: 2.5e10, savingsInterest: 0.01, loanInterest: 0.12, description: "Intelligence Artificielle Bancaire. Épargne à 1.0%, Prêts à 12%." },
    // Level 5
    { cost: 5e11, savingsInterest: 0.015, loanInterest: 0.10, description: "Infrastructure Quantique. Épargne à 1.5%, Prêts à 10%." },
    // Level 6
    { cost: 1e13, savingsInterest: 0.02, loanInterest: 0.08, description: "Monopole Galactique. Épargne à 2.0%, Prêts à 8%." },
    // Level 7
    { cost: 5e14, savingsInterest: 0.03, loanInterest: 0.06, description: "Manipulation Temporelle des Actifs. Épargne à 3.0%." },
    // Level 8
    { cost: 1e16, savingsInterest: 0.05, loanInterest: 0.05, description: "Singularité Financière. Épargne à 5.0%, Prêts à 5%." }
];
