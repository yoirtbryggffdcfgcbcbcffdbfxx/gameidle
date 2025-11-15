export const tutorialCss = `
/* ============================================= */
/*          TUTORIAL & CINEMATIC                 */
/* ============================================= */

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
`;
