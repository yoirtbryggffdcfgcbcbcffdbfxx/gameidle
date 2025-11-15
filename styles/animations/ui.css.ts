export const uiCss = `
/* ============================================= */
/*          UI COMPONENTS                        */
/* ============================================= */

/* Button Pulse on Click */
@keyframes pulseAnim {
    0% { transform: scale(1); box-shadow: 0 0 3px #fff; }
    50% { transform: scale(1.05); box-shadow: 0 0 10px #fff; }
    100% { transform: scale(1); box-shadow: 0 0 3px #fff; }
}
.animate-pulse-effect {
    animation: pulseAnim 0.3s ease-out;
}

/* Quantum Core Effects */
@keyframes core-breathe {
     0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px currentColor); }
     50% { transform: scale(1.1); filter: drop-shadow(0 0 15px currentColor); }
}
.animate-core-breathe {
    animation: core-breathe 4s ease-in-out infinite;
}
.core-ready .animate-core-breathe {
    animation-duration: 2s; /* Faster pulse when ready */
}
@keyframes core-glow {
    0%, 100% { opacity: 0.7; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1.05); }
}
.animate-core-glow {
    animation: core-glow 3s ease-in-out infinite;
}
.core-ready .animate-core-glow {
    animation-duration: 1.5s;
}
@keyframes discharge-flash {
    0% { filter: brightness(3); }
    100% { filter: brightness(1); }
}
.animate-discharge-flash {
    animation: discharge-flash 0.5s ease-out;
}
.core-ready .animate-spin-clockwise-1 { animation-duration: 8s; }
.core-ready .animate-spin-counter-clockwise-1 { animation-duration: 10s; }
@keyframes energy-flicker {
    0%, 100% { opacity: 0; }
    50% { opacity: 0.8; }
}
.energy-arc {
    animation: energy-flicker 2s ease-in-out infinite;
    transform-origin: center;
}

/* Logo & Core Orbits */
@keyframes spin-clockwise {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
@keyframes spin-counter-clockwise {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
}
.animate-spin-clockwise-1 { animation: spin-clockwise 12s linear infinite; }
.animate-spin-counter-clockwise-1 { animation: spin-counter-clockwise 15s linear infinite; }
.animate-spin-clockwise-2 { animation: spin-clockwise 18s linear infinite; }
.animate-slow-rotate {
    animation: spin-clockwise 40s linear infinite;
}

/* Loading Bar */
@keyframes loading-pulse {
    50% { transform: scale(1.1); filter: drop-shadow(0 0 10px #00ffff); }
}
.animate-loading-pulse {
    animation: loading-pulse 1.5s ease-in-out infinite;
}

/* Progress Bar Animations */
@keyframes progress-fill {
    from { width: 0%; }
    to { width: 100%; }
}
.animate-progress-fill {
    animation: progress-fill 1s ease-out forwards;
}
@keyframes progress-shrink {
    from { width: 100%; }
    to { width: 0%; }
}
.animate-progress-shrink {
    animation: progress-shrink linear forwards;
}

/* Attention Pulse (Buyable Upgrades, etc.) */
@keyframes attention-pulse {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 8px var(--text-header);
    }
    50% {
        transform: scale(1.02);
        box-shadow: 0 0 20px var(--text-header);
    }
}
.animate-attention-pulse {
    animation: attention-pulse 1.5s ease-in-out infinite;
}
.animate-attention-pulse-once {
    animation: attention-pulse 1.5s ease-in-out 2;
}

/* New Upgrade Notification Pulse */
@keyframes pulse-red {
    0%, 100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
        transform: scale(1);
        box-shadow: 0 0 0 5px rgba(239, 68, 68, 0);
    }
}
.animate-pulse-red {
    animation: pulse-red 2s infinite;
}

/* Core Ready / Fragment Notification Pulse */
@keyframes pulse-purple {
    0%, 100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.7);
    }
    70% {
        transform: scale(1);
        box-shadow: 0 0 0 6px rgba(168, 85, 247, 0);
    }
}
.animate-pulse-purple {
    animation: pulse-purple 2s infinite;
}

/* Shop Card Transitions */
@keyframes shop-card-enter {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
.animate-shop-card-enter {
    animation: shop-card-enter 0.3s ease-out forwards;
}

@keyframes shop-card-exit {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(50px);
    }
}
.animate-shop-card-exit {
    animation: shop-card-exit 0.3s ease-out forwards;
}

/* Collect Button Glow & Scan */
@keyframes collect-glow {
    0%, 100% {
        box-shadow: 0 0 10px rgba(232, 0, 0, 0.3), inset 0 0 15px rgba(232, 0, 0, 0.2);
        border-color: #e80000;
    }
    50% {
        box-shadow: 0 0 20px rgba(232, 0, 0, 0.5), inset 0 0 20px rgba(232, 0, 0, 0.3);
        border-color: #ff6363;
    }
}

@keyframes scan-line {
    0% {
        left: -100%;
    }
    100% {
        left: 100%;
    }
}
`;