
import React from 'react';

interface BankUnlockPromptProps {
    onBuildBank: () => void;
    energy: number;
    cost: number;
    formatNumber: (num: number) => string;
}

const BankUnlockPrompt: React.FC<BankUnlockPromptProps> = ({ onBuildBank, energy, cost, formatNumber }) => (
    <div className="flex-grow flex flex-col justify-center items-center text-center p-2">
        <div className="text-5xl sm:text-6xl mb-4 animate-pulse">⏳</div>
        <h3 className="text-lg sm:text-xl text-green-400 font-mono">Singularité Temporelle</h3>
        <p className="my-4 max-w-sm text-sm sm:text-base text-gray-300 font-mono">
            Les fluctuations d'énergie permettent de stabiliser une boucle temporelle de stockage.
            Construisez le Coffre pour manipuler le flux temporel de vos ressources.
        </p>
        <button
            onClick={onBuildBank}
            disabled={energy < cost}
            className="p-4 rounded-sm bg-green-900/80 border border-green-500 text-green-300 transition-all disabled:bg-gray-800 disabled:border-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed hover:enabled:bg-green-800 hover:enabled:text-white text-sm sm:text-base font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.2)]"
        >
            Stabiliser le Coffre ({formatNumber(cost)} ⚡)
        </button>
    </div>
);

export default BankUnlockPrompt;
