
import React from 'react';
import { useGameSelector, useGameDispatch } from '../lib/context';
import { setMobileTab } from '../features/ui/actions';
import { MobileTab } from '../features/ui/model';

export const MobileNavBar: React.FC = React.memo(() => {
    const activeTab = useGameSelector(state => state.ui.activeMobileTab);
    const dispatch = useGameDispatch();

    const handleTabClick = (tab: MobileTab) => {
        dispatch(setMobileTab(tab));
    };

    const getButtonClass = (tab: MobileTab) => `
        flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-colors
        ${activeTab === tab 
            ? 'bg-white/10 text-cyan-400 border-t-2 border-cyan-400' 
            : 'text-gray-500 hover:text-gray-300 border-t-2 border-transparent'}
    `;

    return (
        <nav className="flex md:hidden bg-[#0a0a12] border-t border-white/10 z-30 pb-safe">
            <button onClick={() => handleTabClick('REACTOR')} className={getButtonClass('REACTOR')}>
                <span className="text-xl">⚛️</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Réacteur</span>
            </button>
            
            <div className="w-px bg-white/10 my-2"></div>

            <button onClick={() => handleTabClick('FORGE')} className={getButtonClass('FORGE')}>
                <span className="text-xl">⚒️</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Forge</span>
            </button>
        </nav>
    );
});
