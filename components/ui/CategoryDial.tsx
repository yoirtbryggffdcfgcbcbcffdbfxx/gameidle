import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useGameContext } from '../../contexts/GameContext';

interface Tab {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    hasNotification?: boolean;
}

interface CategoryDialProps {
    tabs: Tab[];
    activeTabId: string;
    onTabSelect: (id: string) => void;
    hasGlobalNotification?: boolean;
    variant?: 'forge' | 'bank';
}

const isTouchDevice = () => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
};

const CategoryDial: React.FC<CategoryDialProps> = ({ tabs, activeTabId, onTabSelect, hasGlobalNotification, variant = 'forge' }) => {
    const { playSfx } = useGameContext();
    const [isDragging, setIsDragging] = useState(false);
    const [isListOpen, setIsListOpen] = useState(false);
    
    const startY = useRef(0);
    const accumulatedY = useRef(0);
    const clickStartTimestamp = useRef(0);

    const isMobile = useMemo(() => isTouchDevice(), []);

    const activeIndex = useMemo(() => tabs.findIndex(t => t.id === activeTabId), [tabs, activeTabId]);
    const activeTab = useMemo(() => tabs[activeIndex] || tabs[0], [tabs, activeIndex]);

    useEffect(() => {
        const scrollContainer = document.getElementById('game-content');
        if (scrollContainer) {
            if (isListOpen || (isDragging && !isMobile)) {
                scrollContainer.classList.add('scroll-locked');
            } else {
                scrollContainer.classList.remove('scroll-locked');
            }
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.classList.remove('scroll-locked');
            }
        };
    }, [isListOpen, isDragging, isMobile]);

    const handleSelectByIndex = useCallback((index: number) => {
        const newIndex = (index + tabs.length) % tabs.length;
        if (newIndex !== activeIndex) {
            onTabSelect(tabs[newIndex].id);
            playSfx('ui_hover');
        }
    }, [tabs, onTabSelect, playSfx, activeIndex]);
    
    const handleMove = useCallback((clientY: number) => {
        if (!isDragging) return;
        const deltaY = clientY - startY.current;
        accumulatedY.current += deltaY;
        startY.current = clientY;

        const selectionThreshold = 30; // pixels
        if (Math.abs(accumulatedY.current) > selectionThreshold) {
            const direction = accumulatedY.current > 0 ? -1 : 1; // Inverted scroll
            handleSelectByIndex(activeIndex + direction);
            accumulatedY.current = 0;
        }
    }, [isDragging, activeIndex, handleSelectByIndex]);
    
    useEffect(() => {
        if (isMobile) return;
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientY);
        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
        }
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, [isDragging, handleMove, isMobile]);

    const handleInteractionEnd = useCallback(() => {
        const clickDuration = Date.now() - clickStartTimestamp.current;
        if (isDragging && clickDuration < 200) {
             setIsListOpen(prev => !prev);
        }
        setIsDragging(false);
        accumulatedY.current = 0;
    }, [isDragging]);

    useEffect(() => {
        if (isMobile) return;
        if (isDragging) {
            window.addEventListener('mouseup', handleInteractionEnd);
            window.addEventListener('touchend', handleInteractionEnd);
        }
        return () => {
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('touchend', handleInteractionEnd);
        };
    }, [isDragging, handleInteractionEnd, isMobile]);


    const handleInteractionStart = (clientY: number) => {
        setIsDragging(true);
        startY.current = clientY;
        clickStartTimestamp.current = Date.now();
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        handleSelectByIndex(activeIndex + e.deltaY > 0 ? 1 : -1);
    };

    const handleDirectSelect = (tabId: string) => {
        onTabSelect(tabId);
        setIsListOpen(false);
    };

    const handleMobileClick = () => {
        playSfx('ui_hover');
        setIsListOpen(prev => !prev);
    };

    const buttonEventHandlers = isMobile
        ? { onClick: handleMobileClick }
        : { 
              onMouseDown: (e: React.MouseEvent) => handleInteractionStart(e.clientY),
              onTouchStart: (e: React.TouchEvent) => handleInteractionStart(e.touches[0].clientY),
              onWheel: handleWheel 
          };

    const buttonClass = variant === 'bank' ? 'category-dial-button-bank' : 'category-dial-button';
    const listClass = variant === 'bank' ? 'category-dial-list-bank' : 'category-dial-list';

    return (
        <div className="relative">
             {isListOpen && <div className="fixed inset-0 z-[14] bg-black/50" onClick={() => setIsListOpen(false)}></div>}
            <button
                {...buttonEventHandlers}
                className={buttonClass}
                style={{ color: activeTab.color, textShadow: `0 0 8px ${activeTab.color}` }}
            >
                <span className="text-xl transition-transform duration-200" style={{ transform: isListOpen || (isDragging && !isMobile) ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                <span className="mx-2">{activeTab.icon}</span>
                <span>{activeTab.name}</span>
                {hasGlobalNotification && (
                     <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-red border-2 border-black"></span>
                )}
            </button>

            <div className={`${listClass} ${(!isMobile && isDragging) || isListOpen ? 'open' : ''}`}>
                <div className="indicator-arrow up">▲</div>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleDirectSelect(tab.id)}
                        className={`category-dial-item ${tab.id === activeTabId ? 'active' : ''}`}
                        style={{ color: tab.color }}
                    >
                        <span className="relative flex items-center justify-center w-full gap-2">
                           {tab.icon} {tab.name}
                           {tab.hasNotification && (
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                           )}
                        </span>
                    </button>
                ))}
                 <div className="indicator-arrow down">▼</div>
            </div>
        </div>
    );
};

export default CategoryDial;