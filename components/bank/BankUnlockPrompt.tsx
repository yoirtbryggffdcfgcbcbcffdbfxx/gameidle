import React from 'react';

interface BankUnlockPromptProps {
    onBuildBank: () => void;
    energy: number;
    cost: number;
    formatNumber: (num: number) => string;
}

const BankUnlockPrompt: React.FC<BankUnlockPromptProps> = ({ onBuildBank, energy, cost, formatNumber }) => (
    <div className="flex-grow flex flex-col justify-center items-center text-center p-2">
        <div className="text-5xl sm:text-6xl mb-4">🏦</div>
        <h3 className="text-lg sm:text-xl text-yellow-400">Système Bancaire Détecté</h3>
        <p className="my-4 max-w-sm text-sm sm:text-base">Les protocoles pour une gestion financière avancée sont disponibles. Construisez la Banque pour débloquer l'épargne et les prêts.</p>
        <button
            onClick={onBuildBank}
            disabled={energy < cost}
            className="p-3 rounded-md bg-green-700 text-white transition-all disabled:bg-gray-600 disabled:cursor-not-allowed hover:enabled:bg-green-600 text-base sm:text-lg"
        >
            Construire la Banque ({formatNumber(cost)} ⚡)
        </button>
    </div>
);

export default BankUnlockPrompt;
