// FIX: Wrapped the entire CSS content in a template literal and exported it to make it a valid TypeScript module.
export const animationsCss = `
/* ============================================= */
/*          ANIMATIONS & VISUAL EFFECTS          */
/* ============================================= */
/* Generic Popup */
@keyframes pop {
    0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
    50% { transform: translateX(-50%) scale(1.2); opacity: 1; }
    100% { transform: translateX(-50%) scale(1); opacity: 1; }
}
.animate-pop {
    animation: pop 0.3s ease-in-out;
}
/* Button Pulse on Click */
@keyframes pulseAnim {
    0% { transform: scale(1); box-shadow: 0 0 3px #fff; }
    50% { transform: scale(1.05); box-shadow: 0 0 10px #fff; }
    100% { transform: scale(1); box-shadow: 0 0 3px #fff; }
}
.animate-pulse-effect {
    animation: pulseAnim 0.3s ease-out;
}
/* Main Popup Scale-in */
@keyframes popup-scale-in {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}
.animate-popup-scale {
    animation: popup-scale-in 0.3s ease-in-out;
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
@keyframes discharge-pulse {
    0% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
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
/* Main Logo Slow Rotation */
@keyframes slow-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.animate-slow-rotate {
    animation: slow-rotate 40s linear infinite;
}
/* Main Menu Background Particles */
@keyframes particle-fade {
    0% { transform: translateY(0) scale(0.5); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(-100vh) scale(1); opacity: 0; }
}
.animate-particle-fade {
    animation: particle-fade linear infinite;
    position: absolute;
    background: #00ffff;
    border-radius: 50%;
    pointer-events: none;
}
/* Floating Text (+Energy) */
@keyframes float-up {
    from { transform: translateY(0) scale(1); opacity: 1; }
    to { transform: translateY(-60px) scale(1.5); opacity: 0; }
}
.animate-float-up {
    animation: float-up 1.5s ease-out forwards;
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
/* On-Scroll Reveal Effect */
.reveal {
    opacity: 0;
    transform: translateY(50px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
.revealed {
    opacity: 1;
    transform: translateY(0);
}
/* Notification Toast */
@keyframes toast-in {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
@keyframes toast-out {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-100%); opacity: 0; }
}
.animate-toast-in {
    animation: toast-in 0.3s ease-out forwards;
}
.animate-toast-out {
    animation: toast-out 0.3s ease-out forwards;
}
/* AI Tutorial Effects */
@keyframes ai-bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}
.animate-ai-bob {
    animation: ai-bob 3s ease-in-out infinite;
}
@keyframes text-flicker {
    0%, 100% { opacity: 1; text-shadow: 0 0 5px #00ffff; }
    50% { opacity: 0.8; text-shadow: 0 0 10px #00ffff; }
}
.animate-text-flicker {
    animation: text-flicker 2s linear infinite;
}
@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}
.animate-fade-in-fast {
    animation: fade-in 0.3s ease-out forwards;
}
@keyframes tutorial-highlight-pulse {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 20px #22d3ee;
        border-color: #22d3ee;
    }
    50% {
        transform: scale(1.03);
        box-shadow: 0 0 35px #06b6d4;
        border-color: #67e8f9;
    }
}
.animate-tutorial-pulse {
    animation: tutorial-highlight-pulse 1.5s ease-in-out infinite;
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
`