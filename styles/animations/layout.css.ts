
export const layoutCss = `
/* ============================================= */
/*          LAYOUT & VIEW TRANSITIONS            */
/* ============================================= */

/* On-Scroll Reveal Effect (Unified for Main Game and Shop) */
.reveal, .scroll-reveal-section {
    opacity: 0;
    transform: translate3d(0, 50px, 0);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    will-change: transform, opacity;
}
.revealed, .scroll-reveal-section.is-visible {
    opacity: 1;
    transform: translate3d(0, 0, 0);
}

/* Shop Background Panning (Hardware Accelerated) */
@keyframes pan {
    from { transform: translate(0, 0); }
    to { transform: translate(-60px, -60px); }
}

@keyframes scroll-down-indicator {
    0%, 100% { transform: translateY(0); opacity: 1; }
    50% { transform: translateY(10px); opacity: 0.5; }
}

/* Moving Grid Background for Main Menu */
@keyframes grid-flow {
    0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
    100% { transform: perspective(500px) rotateX(60deg) translateY(60px); }
}
`;
