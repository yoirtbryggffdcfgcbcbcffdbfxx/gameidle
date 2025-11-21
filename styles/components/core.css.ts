
export const coreCss = `
/* ============================================= */
/*          CORE REACTOR UI                      */
/* ============================================= */

/* --- HOLOGRAPHIC HUD --- */
.hud-panel {
    background: rgba(0, 20, 40, 0.4);
    border: 1px solid rgba(0, 255, 255, 0.2);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.05), inset 0 0 20px rgba(0, 255, 255, 0.05);
    backdrop-filter: blur(4px);
    position: relative;
    overflow: hidden;
}

.hud-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent);
}

.hud-panel::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent);
}

.hud-text {
    font-family: 'Courier New', monospace; /* More technical look */
    letter-spacing: 0.05em;
    text-shadow: 0 0 5px currentColor;
}

/* --- PLASMA ENERGY BAR --- */
.plasma-bar-container {
    position: relative;
    height: 3rem; /* Thicker for better text visibility */
    background: rgba(5, 5, 10, 0.6);
    border-radius: 0.75rem;
    border: 2px solid #333;
    box-shadow: inset 0 0 30px #000;
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.plasma-bar-container.animate-plasma-flash {
    border-color: #fff;
    box-shadow: 0 0 20px #fff, inset 0 0 10px #fff;
    animation: plasma-shake 0.2s ease-in-out;
}

@keyframes plasma-shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    50% { transform: translateX(2px); }
    75% { transform: translateX(-2px); }
    100% { transform: translateX(0); }
}

/* Graduations overlay */
.plasma-bar-ticks {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background-image: linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 5% 100%;
    pointer-events: none;
    z-index: 10;
}

.plasma-fill {
    height: 100%;
    position: relative;
    box-shadow: 0 0 30px currentColor;
    transition: width 0.1s linear; /* Smoother fill */
}

/* The flowing plasma effect inside the bar */
.plasma-fill::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(
        90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.6) 50%, 
        transparent 100%
    );
    background-size: 200% 100%;
    animation: plasma-flow 1.5s infinite linear;
    mix-blend-mode: overlay;
}

@keyframes plasma-flow {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

/* --- INJECTOR BUTTON (COLLECT) --- */
.injector-button {
    position: relative;
    width: 100%;
    height: 5rem;
    background: radial-gradient(circle at center, #2a2a2a, #0d0d0d);
    border: 1px solid #555;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.1s ease;
    box-shadow: 
        0 10px 20px rgba(0,0,0,0.8),
        inset 0 1px 1px rgba(255,255,255,0.2);
    overflow: hidden;
}

.injector-button:active {
    transform: translateY(4px);
    box-shadow: 
        0 2px 5px rgba(0,0,0,0.8),
        inset 0 0 20px rgba(0,0,0,0.8);
}

/* The inner glowing core of the button */
.injector-core {
    width: 85%;
    height: 65%;
    border-radius: 0.75rem;
    background: linear-gradient(180deg, #ff4444, #990000);
    border: 1px solid #ff6666;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 
        0 0 25px rgba(255, 0, 0, 0.4),
        inset 0 0 15px rgba(0,0,0,0.5);
    position: relative;
    transition: all 0.2s;
}

.injector-button:hover .injector-core {
    background: linear-gradient(180deg, #ff6666, #cc0000);
    box-shadow: 0 0 35px rgba(255, 50, 50, 0.6);
}

.injector-button:active .injector-core {
    background: linear-gradient(180deg, #cc0000, #880000);
    opacity: 0.9;
}

.injector-label {
    font-family: 'Press Start 2P', cursive;
    font-size: 1rem;
    color: white;
    text-shadow: 0 2px 4px rgba(0,0,0,0.8);
    z-index: 10;
    letter-spacing: 2px;
}

/* Perspective Grid Background */
.perspective-grid {
    position: absolute;
    bottom: -30%;
    left: -50%;
    width: 200%;
    height: 120%;
    background-image: 
        linear-gradient(0deg, transparent 24%, rgba(100, 200, 255, .15) 25%, rgba(100, 200, 255, .15) 26%, transparent 27%, transparent 74%, rgba(100, 200, 255, .15) 75%, rgba(100, 200, 255, .15) 76%, transparent 77%, transparent),
        linear-gradient(90deg, transparent 24%, rgba(100, 200, 255, .15) 25%, rgba(100, 200, 255, .15) 26%, transparent 27%, transparent 74%, rgba(100, 200, 255, .15) 75%, rgba(100, 200, 255, .15) 76%, transparent 77%, transparent);
    background-size: 60px 60px;
    transform: perspective(500px) rotateX(60deg);
    pointer-events: none;
    z-index: 0;
    mask-image: linear-gradient(to top, rgba(0,0,0,1) 10%, transparent 90%);
}
`;
