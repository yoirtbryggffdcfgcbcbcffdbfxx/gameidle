import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
    return (
        <div className="bg-[var(--bg-upgrade)] p-3 rounded-lg text-center flex flex-col justify-between h-full">
            <div className="flex items-start justify-center gap-2 text-[10px] leading-tight opacity-80 min-h-[2rem]">
                <span className="pt-0.5">{icon}</span>
                <span>{label}</span>
            </div>
            <p className="font-bold text-lg text-cyan-300 mt-1 break-words" title={String(value)}>
                {value}
            </p>
        </div>
    );
};

export default StatCard;