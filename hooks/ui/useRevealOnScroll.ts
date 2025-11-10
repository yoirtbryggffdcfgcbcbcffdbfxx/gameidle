import { useEffect } from 'react';

export const useRevealOnScroll = (selector: string, dependencies: React.DependencyList = []) => {
    useEffect(() => {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Optional: unobserve after revealing to save resources
                    // revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const elementsToReveal = document.querySelectorAll(selector);
        elementsToReveal.forEach(el => revealObserver.observe(el));

        return () => {
            elementsToReveal.forEach(el => revealObserver.unobserve(el));
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selector, ...dependencies]);
};