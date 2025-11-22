
import React, { useState, useMemo } from 'react';
import { useGameSelector, useGameDispatch } from '../../../lib/context';
import { setCategory } from '../../ui/actions';
import { UpgradeCategory } from '../../ui/model';

// Import des icônes originales de la V1
import LayersIcon from '../../../../components/ui/LayersIcon';
import ZapIcon from '../../../../components/ui/ZapIcon';
import MousePointerIcon from '../../../../components/ui/MousePointerIcon';
import RocketIcon from '../../../../components/ui/RocketIcon';

interface CategoryDef {
    id: UpgradeCategory;
    label: string;
    icon: React.ReactNode;
    color: string;
}

export const CategorySelector: React.FC = () => {
    const dispatch = useGameDispatch();
    const activeCategory = useGameSelector(state => state.ui.activeCategory);
    const [isOpen, setIsOpen] = useState(false);

    const categories: CategoryDef[] = useMemo(() => [
        { id: 'ALL', label: 'Tout', icon: <LayersIcon className="w-5 h-5" />, color: '#d1d5db' },
        { id: 'PRODUCTION', label: 'Prod', icon: <ZapIcon className="w-5 h-5" />, color: '#33ffcc' },
        { id: 'CLICK', label: 'Clic', icon: <MousePointerIcon className="w-5 h-5" />, color: '#ff9900' },
        { id: 'BOOSTER', label: 'Boost', icon: <RocketIcon className="w-5 h-5" />, color: '#a855f7' },
    ], []);

    const activeDef = categories.find(c => c.id === activeCategory) || categories[0];

    const handleSelect = (id: UpgradeCategory) => {
        dispatch(setCategory(id));
        setIsOpen(false);
    };

    return (
        <div className="relative z-30">
            {/* Overlay de fermeture si ouvert */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[29]" 
                    onClick={() => setIsOpen(false)} 
                />
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-200 hover:bg-white/5 relative z-30"
                style={{ 
                    borderColor: `${activeDef.color}50`,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    boxShadow: `0 0 10px ${activeDef.color}20`
                }}
            >
                <span className="text-xl transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: activeDef.color }}>▼</span>
                <span style={{ color: activeDef.color }}>{activeDef.icon}</span>
                <span className="font-bold text-sm uppercase tracking-wider" style={{ color: activeDef.color }}>
                    {activeDef.label}
                </span>
            </button>

            {/* Liste déroulante style V1 */}
            <div 
                className={`absolute top-full left-0 mt-2 w-40 bg-[#0a0a14] border border-white/10 rounded-lg overflow-hidden shadow-2xl transition-all duration-200 origin-top z-30 ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
            >
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleSelect(cat.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10 border-b border-white/5 last:border-0 ${activeCategory === cat.id ? 'bg-white/5' : ''}`}
                    >
                        <span style={{ color: cat.color }}>{cat.icon}</span>
                        <span className={`text-xs font-bold uppercase ${activeCategory === cat.id ? 'text-white' : 'text-gray-400'}`}>
                            {cat.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
