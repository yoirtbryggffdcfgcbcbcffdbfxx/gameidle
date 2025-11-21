
export const buttonsCss = `
/* ============================================= */
/*          CUSTOM BUTTONS                       */
/* ============================================= */

/* Futuristic Collect Button */
.collect-button {
    position: relative;
    width: 12rem; /* 192px */
    height: 4rem; /* 64px */
    font-size: 1rem; /* 16px */
    color: white;
    background: linear-gradient(135deg, #470e0e, #730000);
    border: 2px solid #e80000;
    border-radius: 0.75rem; /* 12px */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(232, 0, 0, 0.3), inset 0 0 15px rgba(232, 0, 0, 0.2);
    animation: collect-glow 3s infinite ease-in-out;
}

.collect-button:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(232, 0, 0, 0.5), inset 0 0 20px rgba(232, 0, 0, 0.3);
}

.collect-button:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 0 5px rgba(232, 0, 0, 0.5), inset 0 0 10px rgba(232, 0, 0, 0.4);
    animation: none; /* Pause glow on click */
}

.collect-button-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    text-shadow: 0 0 5px #e80000;
}

.collect-button .scan-line {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(255, 127, 127, 0.8), transparent);
    animation: scan-line 4s linear infinite;
}

.collect-button:hover .scan-line {
    animation-duration: 2s;
}

/* Main Menu Buttons */
.menu-btn {
    position: relative;
    width: 100%;
    padding: 1rem;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    border: 1px solid;
    overflow: hidden;
    transition: all 0.3s ease;
    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}

.menu-btn-cyan {
    color: #22d3ee;
    border-color: rgba(34, 211, 238, 0.3);
    background: rgba(34, 211, 238, 0.05);
}

.menu-btn-cyan:hover {
    color: #fff;
    border-color: rgba(34, 211, 238, 0.8);
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
    text-shadow: 0 0 8px rgba(34, 211, 238, 0.8);
}

.menu-btn-purple {
    color: #d8b4fe;
    border-color: rgba(216, 180, 254, 0.3);
    background: rgba(168, 85, 247, 0.05);
}

.menu-btn-purple:hover {
    color: #fff;
    border-color: rgba(168, 85, 247, 0.8);
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
    text-shadow: 0 0 8px rgba(168, 85, 247, 0.8);
}
`;
