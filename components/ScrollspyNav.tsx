import React, { useEffect, useState } from 'react';

interface ScrollspyNavProps {
    sections: { id: string; name: string }[];
    activeSection: string;
}

const ScrollspyNav: React.FC<ScrollspyNavProps> = ({ sections, activeSection }) => {
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

    const handleNavClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed right-0 top-1/2 -translate-y-1/2 z-[1000] p-4 flex items-center">
            <div className="absolute right-4 top-0 h-full w-0.5 bg-white/20">
                <div className="h-full w-full bg-cyan-400 origin-top" style={{ transform: `scaleY(${scrollProgress / 100})` }}></div>
            </div>
            <ul className="space-y-4">
                {sections.map(section => (
                    <li key={section.id} className="flex items-center justify-end group">
                        <span className={`text-xs mr-3 transition-all opacity-0 group-hover:opacity-100 ${activeSection === section.id ? 'opacity-100 text-white' : 'text-gray-400'}`}>{section.name}</span>
                        <button
                            id={`nav-${section.id}`}
                            onClick={() => handleNavClick(section.id)}
                            className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300
                                ${activeSection === section.id ? 'bg-cyan-400 scale-150 border-cyan-400' : 'bg-transparent group-hover:scale-125'}`}
                            aria-label={`Go to ${section.name} section`}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default ScrollspyNav;