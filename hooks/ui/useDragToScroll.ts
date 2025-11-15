// hooks/ui/useDragToScroll.ts
// FIX: Import `React` to make the `React` namespace available for types like `React.RefObject`.
import React, { useEffect, useRef, useCallback } from 'react';

// Function to check if the primary input method is touch.
// This is a common way to distinguish between desktops and mobile/tablet devices.
const isTouchDevice = () => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
};

export const useDragToScroll = (ref: React.RefObject<HTMLElement>) => {
    const elRef = useRef<HTMLElement | null>(null);
    const isDown = useRef(false);
    const startY = useRef(0);
    const scrollTop = useRef(0);
    // Add a ref to track if a move event has occurred after a start event
    const hasMoved = useRef(false);

    const handleInteractionStart = useCallback((pageY: number, target: HTMLElement) => {
        const el = elRef.current;
        // Don't activate drag-to-scroll on interactive elements like buttons
        if (!el || target.closest('button, a, input, select, textarea')) {
            return false;
        }
        isDown.current = true;
        hasMoved.current = false; // Reset move status on new interaction
        startY.current = pageY - el.offsetTop;
        scrollTop.current = el.scrollTop;
        el.style.cursor = 'grabbing';
        return true;
    }, []);

    const handleInteractionEnd = useCallback(() => {
        const el = elRef.current;
        if (!isDown.current) return;

        isDown.current = false;
        if (el) {
            el.style.cursor = 'grab';
        }
        // A small delay before resetting hasMoved allows click events to be correctly cancelled
        setTimeout(() => {
            hasMoved.current = false;
        }, 50);
    }, []);

    const handleInteractionMove = useCallback((pageY: number) => {
        const el = elRef.current;
        if (!isDown.current || !el) return;
        
        hasMoved.current = true; // Mark that a move has happened
        const y = pageY - el.offsetTop;
        const walk = (y - startY.current) * 2; // scroll-fast multiplier
        el.scrollTop = scrollTop.current - walk;
    }, []);

    useEffect(() => {
        // **CORE CHANGE**: If it's a touch device, do not apply any drag-to-scroll logic.
        // This allows the native touch scrolling to work without interference.
        if (isTouchDevice()) {
            return;
        }

        elRef.current = ref.current;
        const el = elRef.current;
        if (!el) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (handleInteractionStart(e.pageY, e.target as HTMLElement)) {
                e.preventDefault(); // Prevent text selection during drag
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isDown.current) {
                e.preventDefault();
                handleInteractionMove(e.pageY);
            }
        };
        
        // Prevent click events on the draggable element after a drag has occurred
        const handleClickCapture = (e: MouseEvent) => {
            if (hasMoved.current) {
                e.stopPropagation();
                e.preventDefault();
            }
        };

        el.style.cursor = 'grab';
        
        // MOUSE EVENTS ONLY
        el.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleInteractionEnd);
        window.addEventListener('mousemove', handleMouseMove);
        
        // Click capture to prevent clicks after drag
        el.addEventListener('click', handleClickCapture, true);

        return () => {
            // Clean up mouse listeners
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('mousemove', handleMouseMove);

            if (el) {
                el.removeEventListener('mousedown', handleMouseDown);
                el.removeEventListener('click', handleClickCapture, true);
                el.style.cursor = 'default';
            }
        };
    }, [ref, handleInteractionStart, handleInteractionEnd, handleInteractionMove]);
};
