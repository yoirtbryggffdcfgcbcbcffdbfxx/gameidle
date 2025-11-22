
import React from 'react';
import { UpgradeList } from '../features/upgrades/components/UpgradeList';
import { CategorySelector } from '../features/upgrades/components/CategorySelector';

export const ManagementPanel: React.FC = React.memo(() => {
    return (
        <div className="flex-1 flex flex-col bg-[#050508]/80 backdrop-blur-sm border-l border-white/5 max-w-md md:max-w-lg w-full mx-auto md:mx-0">
            
            {/* Header avec Dial V1 */}
            <div className="p-4 border-b border-white/10 bg-black/20 flex items-center justify-between z-20">
                <CategorySelector />
                
                {/* Déco technique à droite */}
                <div className="flex flex-col items-end opacity-50">
                    <div className="flex gap-1 mb-1">
                        <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                        <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                        <div className="w-1 h-1 bg-white/10 rounded-full"></div>
                    </div>
                    <span className="text-[9px] font-mono text-cyan-500">SYS.FORGE.V2</span>
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-4 relative z-10">
                <UpgradeList />
            </div>

            {/* Footer Decoration */}
            <div className="h-1 bg-gradient-to-r from-yellow-600/0 via-yellow-500/50 to-yellow-600/0 flex-shrink-0"></div>
        </div>
    );
});
