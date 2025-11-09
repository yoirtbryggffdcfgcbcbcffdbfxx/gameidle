import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SlidingUpPanelProps {
    children: React.ReactNode;
    nextPurchaseHint?: string;
    onDragStart?: () => void;
}

const SlidingUpPanel: React.FC<SlidingUpPanelProps> = ({ children, nextPurchaseHint, onDragStart }) => {
    const panelStatesRef = useRef({
        COLLAPSED: 60,
        HALF: window.innerHeight * 0.4,
        FULL: window.innerHeight - 100,
    });

    const [panelHeight, setPanelHeight] = useState(panelStatesRef.current.COLLAPSED);
    const dragging = useRef(false);
    const startY = useRef(0);
    const startHeight = useRef(0);

    useEffect(() => {
        const handleResize = () => {
            panelStatesRef.current = {
                COLLAPSED: 60,
                HALF: window.innerHeight * 0.4,
                FULL: window.innerHeight - 100,
            };
            setPanelHeight(h => Math.max(panelStatesRef.current.COLLAPSED, Math.min(panelStatesRef.current.FULL, h)));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const snapToClosestState = useCallback(() => {
        setPanelHeight(currentHeight => {
            const { COLLAPSED, HALF, FULL } = panelStatesRef.current;
            const distances = [
                { state: COLLAPSED, dist: Math.abs(currentHeight - COLLAPSED) },
                { state: HALF, dist: Math.abs(currentHeight - HALF) },
                { state: FULL, dist: Math.abs(currentHeight - FULL) }
            ];
            return distances.reduce((prev, curr) => (curr.dist < prev.dist ? curr : prev)).state;
        });
    }, []);

    const handleDragStart = (clientY: number) => {
        if (onDragStart) {
            onDragStart();
        }
        dragging.current = true;
        startY.current = clientY;
        startHeight.current = panelHeight;
        document.body.style.overflow = 'hidden';
    };

    const handleDragMove = useCallback((clientY: number) => {
        if (!dragging.current) return;
        const deltaY = startY.current - clientY;
        const newHeight = Math.max(panelStatesRef.current.COLLAPSED, Math.min(panelStatesRef.current.FULL, startHeight.current + deltaY));
        setPanelHeight(newHeight);
    }, []);
    
    const handleDragEnd = useCallback(() => {
        dragging.current = false;
        document.body.style.overflow = '';
        snapToClosestState();
    }, [snapToClosestState]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        handleDragStart(e.clientY);

        const handleMouseMove = (me: MouseEvent) => handleDragMove(me.clientY);
        const handleMouseUp = () => {
            handleDragEnd();
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        handleDragStart(e.touches[0].clientY);

        const handleTouchMove = (te: TouchEvent) => handleDragMove(te.touches[0].clientY);
        const handleTouchEnd = () => {
            handleDragEnd();
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };

        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
    };

    const isCollapsed = panelHeight <= panelStatesRef.current.COLLAPSED + 10;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm rounded-t-2xl shadow-2xl border-t-2 border-cyan-400/50"
            style={{
                height: `${panelHeight}px`,
                transition: dragging.current ? 'none' : 'height 0.3s ease-out',
            }}
        >
            <div
                id="sliding-panel-handle"
                className="sliding-panel-handle absolute top-0 left-0 right-0 h-10 cursor-ns-resize flex items-center justify-center"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="w-12 h-1.5 bg-gray-400 rounded-full"></div>
            </div>

            <div className={`pt-8 h-full transition-opacity duration-200 ${isCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                {children}
            </div>
            
            {isCollapsed && nextPurchaseHint && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center px-4 text-xs">
                    <p className="text-cyan-300 animate-pulse">Achat suivant : <span className="font-bold">{nextPurchaseHint}</span></p>
                </div>
            )}
        </div>
    );
};

export default SlidingUpPanel;