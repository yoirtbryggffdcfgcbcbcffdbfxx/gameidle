import React from 'react';
import ZapIcon from './ZapIcon';

interface SectionHeaderProps {
    title: string;
    energy: number;
    formatNumber: (n: number) => string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, energy, formatNumber }) => (
    <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-2xl text-center text-[var(--text-header)]">{title}</h2>
        <div className="bg-black/30 px-3 py-1 rounded-lg text-xs">
            <span className="text-cyan-300 flex items-center gap-1">
                <ZapIcon className="w-3 h-3" />
                {formatNumber(energy)}
            </span>
        </div>
    </div>
);

export default SectionHeader;