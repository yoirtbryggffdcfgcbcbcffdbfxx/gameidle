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
`;
