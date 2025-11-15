import React from 'react';

interface StatDisplayProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    colorClass: string;
    showRepaymentIndicator?: boolean;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ label, value, icon, colorClass, showRepaymentIndicator }) => (
    <div className={`bg-black/30 p-2 rounded-lg text-center ${colorClass}`}>
        <div className="text-xs opacity-80 flex items-center justify-center gap-1">{icon} {label}</div>
        <div className="text-base md:text-lg font-bold flex justify-center items-center gap-2">
            <span>{value}</span>
            {showRepaymentIndicator && (
                <div className="relative group">
                    <span className="text-red-500 text-xs animate-pulse cursor-help">(-50%)</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-max mb-2 p-2 bg-gray-900 border border-gray-600 rounded-lg text-xs z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-white">
                        50% de la production rembourse votre prêt.
                    </div>
                </div>
            )}
        </div>
    </div>
);

export default StatDisplay;