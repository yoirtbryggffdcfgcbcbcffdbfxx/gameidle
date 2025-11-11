import React, { useEffect, useState } from 'react';

interface ScrollspyNavProps {
    sections: { id: string; name: string }[];
    activeSection: string;
    onNavClick: (sectionId: string) => void;
    newUpgradesAvailable: boolean;
    newShopItemsAvailable: boolean;
}

const ScrollspyNav: React.FC<ScrollspyNavProps> = ({ sections, activeSection, onNavClick, newUpgradesAvailable, newShopItemsAvailable }) => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const gameContent = document.getElementById('game-content');
        if (!gameContent) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = gameContent;
            const totalScrollableHeight = scrollHeight - clientHeight;
            if (totalScrollableHeight > 0) {
                const progress = (scrollTop / totalScrollableHeight) * 100;
                setScrollProgress(progress);
            } else {
                setScrollProgress(0);
            }
        };

        gameContent.addEventListener('scroll', handleScroll);
        return () => gameContent.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="fixed right-0 top-1/2 -translate-y-1/2 z-[1000] p-2 md:p-4 flex items-center">
            <div className="absolute right-4 top-0 h-full w-0.5 bg-white/20">
                <div className="h-full w-full bg-cyan-400 origin-top" style={{ transform: `scaleY(${scrollProgress / 100})` }}></div>
            </div>
            <ul className="space-y-5 md:space-y-4">
                {sections.map(section => (
                    <li key={section.id} className="flex items-center justify-end group relative">
                        <span className={`hidden md:inline-block text-xs mr-3 transition-all opacity-0 group-hover:opacity-100 ${activeSection === section.id ? 'opacity-100 text-white' : 'text-gray-400'}`}>{section.name}</span>
                        <button
                            id={`nav-${section.id}`}
                            onClick={() => onNavClick(section.id)}
                            className={`w-5 h-5 md:w-3 md:h-3 rounded-full border-2 border-white transition-all duration-300
                                ${activeSection === section.id ? 'bg-cyan-400 scale-150 border-cyan-400' : 'bg-transparent group-hover:scale-125'}`}
                            aria-label={`Go to ${section.name} section`}
                        />
                         {section.id === 'forge' && newUpgradesAvailable && (
                            <span className="absolute right-[-5px] top-[-5px] w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-red" title="Nouvelles améliorations disponibles !"></span>
                        )}
                         {section.id === 'command-center' && newShopItemsAvailable && (
                            <span className="absolute right-[-5px] top-[-5px] w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-red" title="Nouveaux articles dans la boutique !"></span>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default ScrollspyNav;