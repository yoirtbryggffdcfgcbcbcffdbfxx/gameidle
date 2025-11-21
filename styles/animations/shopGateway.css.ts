
export const shopGatewayCss = `
/* ============================================= */
/*          SHOP GATEWAY CINEMATIC               */
/* ============================================= */

/* Lignes de scan verticales (Cyan) */
@keyframes gateway-scan {
    0% { top: 0%; opacity: 0; }
    10% { opacity: 1; box-shadow: 0 0 10px #00ffff; }
    90% { opacity: 1; box-shadow: 0 0 10px #00ffff; }
    100% { top: 100%; opacity: 0; }
}
.animate-gateway-scan {
    animation: gateway-scan 2s ease-in-out infinite;
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: #00ffff;
    z-index: 10;
}

/* Flash d'accès autorisé (Or/Jaune) pour matcher la boutique */
@keyframes access-granted-flash-gold {
    0% { background-color: rgba(234, 179, 8, 0); } /* Yellow-500 transparent */
    20% { background-color: rgba(234, 179, 8, 0.3); }
    100% { background-color: rgba(234, 179, 8, 0); }
}
.animate-access-flash-gold {
    animation: access-granted-flash-gold 0.6s ease-out forwards;
}

/* Effet de grille qui se déploie */
@keyframes grid-deploy {
    0% { transform: perspective(500px) rotateX(60deg) translateY(-100px) scale(0.5); opacity: 0; }
    100% { transform: perspective(500px) rotateX(60deg) translateY(0) scale(1); opacity: 0.3; }
}
.animate-grid-deploy {
    animation: grid-deploy 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Texte qui se décode (glitch) */
@keyframes text-decode-blur {
    0% { filter: blur(5px); opacity: 0; letter-spacing: -5px; }
    50% { filter: blur(2px); opacity: 1; }
    100% { filter: blur(0px); opacity: 1; letter-spacing: 2px; }
}
.animate-text-decode {
    animation: text-decode-blur 0.5s ease-out forwards;
}

/* Battement rouge pour accès refusé/attente */
@keyframes access-lock-pulse {
    0%, 100% { border-color: rgba(255, 0, 0, 0.3); box-shadow: 0 0 10px rgba(255, 0, 0, 0.1); }
    50% { border-color: rgba(255, 0, 0, 0.8); box-shadow: 0 0 20px rgba(255, 0, 0, 0.4); }
}
.animate-lock-pulse {
    animation: access-lock-pulse 2s infinite;
}
`;
