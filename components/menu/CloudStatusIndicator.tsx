
import React from 'react';
import { useGameData } from '../../contexts/GameDataContext';

const CloudStatusIndicator: React.FC = () => {
    const { uiState } = useGameData();
    const { cloudStatus } = uiState;

    if (cloudStatus === 'none') return null;

    const isConnected = cloudStatus === 'connected';
    const bgColor = isConnected ? 'bg-green-900/30' : 'bg-orange-900/30';
    const borderColor = isConnected ? 'border-green-500/30' : 'border-orange-500/30';
    const textColor = isConnected ? 'text-green-400' : 'text-orange-400';
    const pulseColor = isConnected ? 'bg-green-500' : 'bg-orange-500';
    const statusText = isConnected ? "CLOUD : ACTIF" : "MODE LOCAL (HORS-LIGNE)";

    return (
        <div className={`fixed top-2 left-1/2 -translate-x-1/2 z-[200] px-3 py-1 rounded-full border backdrop-blur-md flex items-center gap-2 ${bgColor} ${borderColor}`}>
            <div className={`w-2 h-2 rounded-full ${pulseColor} animate-pulse`}></div>
            <span className={`text-[9px] font-mono font-bold tracking-wider ${textColor}`}>
                {statusText}
            </span>
        </div>
    );
};

export default CloudStatusIndicator;
