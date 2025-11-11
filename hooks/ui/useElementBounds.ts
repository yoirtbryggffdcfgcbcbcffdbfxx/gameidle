import { useState, useLayoutEffect, useRef } from 'react';

const getCombinedBoundingBox = (elementIds: string[]): DOMRect | null => {
    const elements = elementIds
        .map(id => document.getElementById(id))
        .filter(el => el !== null) as HTMLElement[];

    if (elements.length === 0) return null;

    const rects = elements.map(el => el.getBoundingClientRect());
    
    if (rects.some(rect => rect.width === 0 || rect.height === 0)) return null;

    const left = Math.min(...rects.map(r => r.left));
    const top = Math.min(...rects.map(r => r.top));
    const right = Math.max(...rects.map(r => r.right));
    const bottom = Math.max(...rects.map(r => r.bottom));

    return new DOMRect(left, top, right - left, bottom - top);
};

export const useElementBounds = (elementIds: string[]): DOMRect | null => {
    const [bounds, setBounds] = useState<DOMRect | null>(null);
    const lastRectJson = useRef('');
    const stabilityCounter = useRef(0);

    useLayoutEffect(() => {
        setBounds(null);
        lastRectJson.current = '';
        stabilityCounter.current = 0;

        if (elementIds.length === 0) {
            return;
        }

        let animationFrameId: number;

        const updateBounds = () => {
            const newBounds = getCombinedBoundingBox(elementIds);
            const newRectJson = JSON.stringify(newBounds);

            if (newBounds) {
                if (newRectJson === lastRectJson.current) {
                    stabilityCounter.current++;
                } else {
                    stabilityCounter.current = 0;
                    lastRectJson.current = newRectJson;
                }

                // Consider the position stable after 3 consecutive identical frames
                if (stabilityCounter.current >= 3) {
                    setBounds(newBounds);
                }
            }
            
            animationFrameId = requestAnimationFrame(updateBounds);
        };
        
        const mutationObserver = new MutationObserver(() => { stabilityCounter.current = 0; });
        mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: true });

        animationFrameId = requestAnimationFrame(updateBounds);
        
        return () => {
            cancelAnimationFrame(animationFrameId);
            mutationObserver.disconnect();
        };
    }, [elementIds.join(',')]);

    return bounds;
};
