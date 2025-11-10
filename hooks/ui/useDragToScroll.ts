import { useEffect, useRef } from 'react';

export const useDragToScroll = (ref: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let isDown = false;
        let startY: number;
        let scrollTop: number;

        const handleMouseDown = (e: MouseEvent | TouchEvent) => {
            const target = e.target as HTMLElement;
            // Ignore clicks on nav or buttons to allow their default behavior
            if (target.closest('nav') || target.closest('button')) return;
            isDown = true;
            const pageY = 'touches' in e ? e.touches[0].pageY : e.pageY;
            startY = pageY - el.offsetTop;
            scrollTop = el.scrollTop;
            el.style.cursor = 'grabbing';
        };
        const handleMouseLeaveOrUp = () => {
            isDown = false;
            el.style.cursor = 'grab';
        };
        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const pageY = 'touches' in e ? e.touches[0].pageY : e.pageY;
            const y = pageY - el.offsetTop;
            const walk = (y - startY) * 2; // Multiplier for faster scrolling
            el.scrollTop = scrollTop - walk;
        };

        el.style.cursor = 'grab';
        el.addEventListener('mousedown', handleMouseDown);
        el.addEventListener('mouseleave', handleMouseLeaveOrUp);
        el.addEventListener('mouseup', handleMouseLeaveOrUp);
        el.addEventListener('mousemove', handleMouseMove);
        
        // Touch events for mobile
        el.addEventListener('touchstart', handleMouseDown, { passive: true });
        el.addEventListener('touchend', handleMouseLeaveOrUp);
        el.addEventListener('touchmove', handleMouseMove, { passive: false });

        return () => {
            el.removeEventListener('mousedown', handleMouseDown);
            el.removeEventListener('mouseleave', handleMouseLeaveOrUp);
            el.removeEventListener('mouseup', handleMouseLeaveOrUp);
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('touchstart', handleMouseDown);
            el.removeEventListener('touchend', handleMouseLeaveOrUp);
            el.removeEventListener('touchmove', handleMouseMove);
            el.style.cursor = 'default';
        };
    }, [ref]);
};
