// hooks/ui/useDragToScroll.ts
// FIX: Import React to provide namespace for types.
import React, { useEffect, useRef } from 'react';

export const useDragToScroll = (ref: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        // On mobile, native scrolling is a much better experience than JS-based dragging.
        if (isTouchDevice) {
            return;
        }

        const el = ref.current;
        if (!el) return;

        let isDown = false;
        let startY: number;
        let scrollTop: number;

        const handleMouseDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Ignore clicks on nav or buttons to allow their default behavior
            if (target.closest('nav') || target.closest('button')) return;
            isDown = true;
            startY = e.pageY - el.offsetTop;
            scrollTop = el.scrollTop;
            el.style.cursor = 'grabbing';
        };
        const handleMouseLeaveOrUp = () => {
            isDown = false;
            el.style.cursor = 'grab';
        };
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const y = e.pageY - el.offsetTop;
            const walk = (y - startY) * 2; // Multiplier for faster scrolling
            el.scrollTop = scrollTop - walk;
        };

        el.style.cursor = 'grab';
        el.addEventListener('mousedown', handleMouseDown);
        el.addEventListener('mouseleave', handleMouseLeaveOrUp);
        el.addEventListener('mouseup', handleMouseLeaveOrUp);
        el.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            el.removeEventListener('mousedown', handleMouseDown);
            el.removeEventListener('mouseleave', handleMouseLeaveOrUp);
            el.removeEventListener('mouseup', handleMouseLeaveOrUp);
            el.removeEventListener('mousemove', handleMouseMove);
            el.style.cursor = 'default';
        };
    }, [ref]);
};
