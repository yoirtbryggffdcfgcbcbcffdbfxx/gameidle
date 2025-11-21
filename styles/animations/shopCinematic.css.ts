
export const shopCinematicCss = `
/* ============================================= */
/*          SHOP CINEMATIC EFFECTS               */
/* ============================================= */

/* Radar Scan Effect */
@keyframes radar-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.animate-radar-spin {
    animation: radar-spin 2s linear infinite;
}

/* Target Lock Bracket Animation */
@keyframes bracket-lock {
    0% { width: 120%; height: 120%; opacity: 0; }
    50% { opacity: 1; }
    100% { width: 100%; height: 100%; opacity: 1; }
}
.animate-bracket-lock {
    animation: bracket-lock 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Uplink Stream Text */
@keyframes uplink-stream {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(-20px); opacity: 0; }
}
.animate-uplink-stream {
    animation: uplink-stream 0.5s linear forwards;
}

/* Success Flash */
@keyframes success-flash {
    0% { background-color: transparent; }
    10% { background-color: #fff; }
    100% { background-color: transparent; }
}
.animate-success-flash {
    animation: success-flash 0.5s ease-out;
}

/* Signal Strength Bar */
@keyframes signal-pulse {
    0%, 100% { height: 20%; opacity: 0.5; }
    50% { height: 80%; opacity: 1; }
}
.animate-signal-pulse {
    animation: signal-pulse 0.5s ease-in-out infinite;
}
`;
