import { useState, useEffect, useRef, useCallback } from 'react';

export const useScrollSpy = (
    sectionIds: string[], 
    options?: IntersectionObserverInit
) => {
    const [activeSection, setActiveSection] = useState(sectionIds[0] || '');
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<number | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (isScrollingRef.current) return;

            const mostVisibleEntry = entries.reduce((prev, current) => 
                (prev.intersectionRatio > current.intersectionRatio) ? prev : current
            );

            if (mostVisibleEntry && mostVisibleEntry.isIntersecting) {
                setActiveSection(mostVisibleEntry.target.id);
            }
        }, options || { threshold: Array.from(Array(21).keys()).map(i => i / 20) });

        observerRef.current = observer;
        
        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => {
            sectionIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) observer.unobserve(el);
            });
            observer.disconnect();
        };
    }, [sectionIds, options]);
    
    const handleNavClick = useCallback((id: string) => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        isScrollingRef.current = true;
        
        setActiveSection(id);
        
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        
        // After scrolling, re-enable the observer
        scrollTimeoutRef.current = window.setTimeout(() => {
            isScrollingRef.current = false;
        }, 1000); // 1s is a safe buffer for smooth scrolling to finish
    }, []);
    
    return { activeSection, handleNavClick };
};
