import { useEffect, RefObject } from 'react';

export const useScrollAnimationTrigger = (
    containerRef: RefObject<HTMLElement>,
    itemSelector: string,
    options: IntersectionObserverInit = { threshold: 0.2 }
) => {
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: Unobserve after the animation to save resources
                    // observer.unobserve(entry.target);
                }
            });
        }, { ...options, root: container });

        const items = container.querySelectorAll(itemSelector);
        items.forEach(item => observer.observe(item));

        return () => {
            items.forEach(item => observer.unobserve(item));
        };
    }, [containerRef, itemSelector, options]);
};
