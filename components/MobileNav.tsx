
import React from 'react';

interface Tab {
    id: string;
    name: string;
    icon: React.ReactNode;
    hasNotification?: boolean;
}

interface MobileNavProps {
    tabs: Tab[];
    onTabClick: (tabId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ tabs, onTabClick }) => {
    return (
        <div className="md:hidden flex-shrink-0 -mx-4 -mb-4 mt-4 border-t-2 border-white/10 flex justify-around items-stretch bg-black/30 rounded-b-lg">
            {tabs.map((tab, index) => (
                <button
                    key={tab.id}
                    id={`tab-mobile-${tab.id}`}
                    onClick={() => onTabClick(tab.id)}
                    className={`group flex flex-1 flex-col items-center justify-center p-3 text-xs transition-colors duration-200 relative text-gray-400 hover:bg-white/5 focus:outline-none focus:bg-white/10 ${index > 0 ? 'border-l border-white/10' : ''}`}
                >
                    {/* Handle */}
                    <div className="w-10 h-1.5 bg-gray-600 rounded-full mb-3 opacity-70 transition-all group-hover:bg-white group-hover:opacity-100 group-hover:-translate-y-0.5"></div>
                    
                    {/* Icon */}
                    <div className="relative text-2xl">
                        {tab.icon}
                        {tab.hasNotification && (
                            <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </div>

                    {/* Text */}
                    <span className="mt-2 font-bold transition-colors group-hover:text-white">{tab.name}</span>
                </button>
            ))}
        </div>
    );
};

export default MobileNav;
