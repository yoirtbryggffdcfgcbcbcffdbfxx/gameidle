
export const effectsCss = `
/* ============================================= */
/*          PARTICLES & FLOATING TEXT            */
/* ============================================= */
@keyframes particle-fade {
    0% { transform: translateY(0) scale(0.5); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(-100vh) scale(1); opacity: 0; }
}

.animate-particle-fade {
    animation: particle-fade linear infinite;
    position: absolute;
    background: #fff;
    border-radius: 50%;
    pointer-events: none;
}

@keyframes float-up {
    from { transform: translateY(0) scale(1); opacity: 1; }
    to { transform: translateY(-60px) scale(1.5); opacity: 0; }
}

.animate-float-up {
    animation: float-up 1.5s ease-out forwards;
}

/* ============================================= */
/*          CINEMATIC: SINGULARITY AWAKENING     */
/* ============================================= */

/* Battement de coeur de la singularité */
@keyframes singularity-pulse {
    0% { transform: scale(1); box-shadow: 0 0 20px rgba(255,255,255,0.3); }
    15% { transform: scale(1.4); box-shadow: 0 0 50px rgba(255,255,255,0.8); }
    30% { transform: scale(1); box-shadow: 0 0 20px rgba(255,255,255,0.3); }
    45% { transform: scale(1.2); box-shadow: 0 0 35px rgba(255,255,255,0.6); }
    60% { transform: scale(1); box-shadow: 0 0 20px rgba(255,255,255,0.3); }
    100% { transform: scale(1); box-shadow: 0 0 20px rgba(255,255,255,0.3); }
}

/* Onde de choc qui s'étend */
@keyframes singularity-ripple {
    0% { transform: scale(1); opacity: 0.6; border-width: 2px; }
    100% { transform: scale(20); opacity: 0; border-width: 0px; }
}

/* Implosion finale */
@keyframes singularity-implode {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(2); opacity: 1; }
    100% { transform: scale(0.001); opacity: 0; }
}

/* Big Bang (Flash Blanc) */
@keyframes big-bang-flash {
    0% { opacity: 0; background-color: white; }
    10% { opacity: 1; }
    100% { opacity: 0; pointer-events: none; }
}

/* Tremblement subtil pendant la phase instable */
@keyframes unstable-shake {
    0% { transform: translate(0, 0); }
    25% { transform: translate(-2px, 2px); }
    50% { transform: translate(2px, -2px); }
    75% { transform: translate(-2px, -2px); }
    100% { transform: translate(0, 0); }
}

/* Particules aspirées (Accrétion) */
@keyframes suck-in {
    0% { opacity: 0; transform: rotate(var(--tw-rotate)) translateX(150px) scale(0.5); }
    20% { opacity: 1; }
    100% { opacity: 0; transform: rotate(calc(var(--tw-rotate) + 90deg)) translateX(0px) scale(0.1); }
}

/* Texte Glitch */
@keyframes glitch-skew {
    0% { transform: skew(0deg); }
    20% { transform: skew(-2deg); }
    40% { transform: skew(2deg); }
    60% { transform: skew(-1deg); }
    80% { transform: skew(1deg); }
    100% { transform: skew(0deg); }
}

.glitch-text {
    animation: glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
    color: red;
    text-shadow: 2px 0 #0ff, -2px 0 #f00;
}

/* ============================================= */
/*          UI EFFECTS                           */
/* ============================================= */

/* Plasma Bar Flash */
@keyframes plasma-shake {
    0% { transform: translateX(0); filter: brightness(1); }
    10% { transform: translateX(-2px); filter: brightness(2); border-color: white; }
    20% { transform: translateX(2px); }
    30% { transform: translateX(-2px); }
    40% { transform: translateX(2px); }
    100% { transform: translateX(0); filter: brightness(1); }
}

/* Scanline pour écran de chargement */
@keyframes scan-line {
    0% { top: -10%; opacity: 0; }
    50% { opacity: 0.5; }
    100% { top: 110%; opacity: 0; }
}
`;
