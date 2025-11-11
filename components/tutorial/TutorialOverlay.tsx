import React, { useMemo, useState, useEffect } from 'react';

interface TutorialOverlayProps {
    highlightBox: DOMRect | null;
    isGlobal?: boolean;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ highlightBox, isGlobal }) => {
    const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setViewportSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const padding = 8;

    const svgPath = useMemo(() => {
        if (!highlightBox) return '';
        const { x, y, width, height } = highlightBox;
        const paddedX = x - padding;
        const paddedY = y - padding;
        const paddedWidth = width + padding * 2;
        const paddedHeight = height + padding * 2;

        const outer = `M0,0 H${viewportSize.width} V${viewportSize.height} H0 Z`;
        const inner = `M${paddedX},${paddedY} H${paddedX + paddedWidth} V${paddedY + paddedHeight} H${paddedX} Z`;
        
        return `${outer} ${inner}`;
    }, [highlightBox, viewportSize.width, viewportSize.height]);

    // True when the step is not global but we are still waiting for the element bounds
    const isInitialising = !highlightBox && !isGlobal;

    return (
        <>
            <svg 
                width="100%" 
                height="100%"
                className="fixed inset-0 z-[2000] transition-opacity duration-300"
                style={{ pointerEvents: 'none' }}
            >
                {/* Path with a hole, only the filled area blocks clicks */}
                {highlightBox && !isGlobal && (
                    <path 
                        d={svgPath} 
                        fill="rgba(0,0,0,0.8)" 
                        fillRule="evenodd"
                        style={{ pointerEvents: 'auto' }}
                    />
                )}
                {/* Full screen blocker for when we're waiting for bounds */}
                {isInitialising && (
                    <rect 
                        width="100%" 
                        height="100%" 
                        fill="rgba(0,0,0,0.8)"
                        style={{ pointerEvents: 'auto' }}
                    />
                )}
            </svg>
            
            {highlightBox && !isGlobal && (
                <div
                    className="fixed z-[1999] border-4 rounded-lg pointer-events-none animate-tutorial-pulse"
                    style={{
                        top: highlightBox.top - padding,
                        left: highlightBox.left - padding,
                        width: highlightBox.width + padding * 2,
                        height: highlightBox.height + padding * 2,
                        borderColor: '#22d3ee'
                    }}
                />
            )}
        </>
    );
};

export default TutorialOverlay;