import React from 'react';

// Helper component for sectioning
const StatsSection: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode; }> = ({ title, children, icon }) => (
    <div className="mb-6">
        <h4 className="text-sm text-yellow-400 mb-2 border-b border-yellow-400/20 pb-1 flex items-center gap-2">
            {icon} {title}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {children}
        </div>
    </div>
);

export default StatsSection;
