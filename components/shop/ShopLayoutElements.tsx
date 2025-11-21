
import React from 'react';

export const CurrencyDisplay: React.FC<{ label: string; value: string; icon: React.ReactNode; }> = ({ label, value, icon }) => (
    <div className="bg-black/40 rounded-full px-3 py-1.5 flex items-center gap-2 text-center backdrop-blur-sm border border-white/10 min-w-[100px]">
        <span className="text-lg w-5 h-5 flex items-center justify-center">{icon}</span>
        <div className="text-left">
            <div className="text-[10px] opacity-70 leading-none">{label}</div>
            <div className="text-sm font-bold leading-tight text-yellow-300">{value}</div>
        </div>
    </div>
);

export const ScrollDownIndicator: React.FC = () => (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
        <span className="text-xs opacity-70">Défiler pour explorer</span>
        <div className="w-5 h-8 border-2 border-white/50 rounded-full relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-white/50 rounded-full" style={{ animation: 'scroll-down-indicator 2s infinite' }}></div>
        </div>
    </div>
);
