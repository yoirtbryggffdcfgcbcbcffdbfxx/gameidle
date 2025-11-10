const cssStyles = `
    /* ============================================= */
    /*          1. THEMES                            */
    /* ============================================= */
    :root {
        --bg-from: #1e1e2f;
        --bg-to: #2a2a3f;
        --text-main: #ffffff;
        --text-header: #ffcc00;
        --bg-popup: #222;
        --bg-upgrade: rgba(0,0,0,0.3);
        --border-color: #444;
        --cursor-color: #00ffff;
    }
    :root[data-theme='light'] {
        --bg-from: #eef2f3;
        --bg-to: #8e9eab;
        --text-main: #2c3e50;
        --text-header: #d35400;
        --bg-popup: #f4f4f4;
        --bg-upgrade: rgba(255,255,255,0.4);
        --border-color: #bdc3c7;
        --cursor-color: #d35400;
    }
    :root[data-theme='matrix'] {
        --bg-from: #000000;
        --bg-to: #0d0d0d;
        --text-main: #00ff41;
        --text-header: #39ff14;
        --bg-popup: #0a0a0a;
        --bg-upgrade: rgba(0, 255, 65, 0.1);
        --border-color: #00ff41;
        --cursor-color: #00ff41;
    }
    :root[data-theme='solaris'] {
        --bg-from: #ff7e5f;
        --bg-to: #feb47b;
        --text-main: #ffffff;
        --text-header: #4a1c0d;
        --bg-popup: #ff6a3d;
        --bg-upgrade: rgba(255, 255, 255, 0.2);
        --border-color: #ffffff;
        --cursor-color: #ffffff;
    }
    :root[data-theme='cyberpunk'] {
        --bg-from: #0b022d;
        --bg-to: #3a0ca3;
        --text-main: #f0f0f0;
        --text-header: #ff00c8;
        --bg-popup: #1e0a4f;
        --bg-upgrade: rgba(255, 0, 200, 0.15);
        --border-color: #00f5d4;
        --cursor-color: #ff00c8;
    }

    /* ============================================= */
    /*          2. BASE STYLES & LAYOUT              */
    /* ============================================= */
    html, body {
        height: 100%;
        margin: 0;
        overflow: hidden; /* Hide main scrollbar */
        cursor: none;
        touch-action: none;
    }
    body {
        font-family: 'Press Start 2P', cursive;
        color: var(--text-main);
    }
    #parallax-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, var(--bg-from), var(--bg-to));
        z-index: -1;
    }
    #game-content {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        scroll-snap-type: y mandatory;
        /* Hide the default browser scrollbar */
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
    #game-content::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera*/
    }
    .fullscreen-section {
        height: 100vh;
        width: 100%;
        scroll-snap-align: start;
        scroll-snap-stop: always;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        position: relative;
    }

    /* ============================================= */
    /*      3. COMPONENTS & UI ELEMENTS              */
    /* ============================================= */
    /* Custom Cursor */
    #custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--cursor-color);
        border-radius: 50%;
        left: 0;
        top: 0;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        transition: transform 0.1s ease-out;
    }
    #custom-cursor.pointer {
        transform: translate(-50%, -50%) scale(1.5);
        background-color: var(--cursor-color);
        opacity: 0.5;
    }
    /* Tooltip */
    .tooltip {
        position: absolute;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #222;
        color: #fff;
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.2s;
        z-index: 10;
    }
    .group:hover .tooltip {
        opacity: 1;
        visibility: visible;
    }
    /* Scrollbar Utilities */
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    /* Custom Bank Scrollbar */
    .custom-scrollbar-bank::-webkit-scrollbar {
        width: 8px;
    }
    .custom-scrollbar-bank::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.3);
        border-radius: 4px;
    }
    .custom-scrollbar-bank::-webkit-scrollbar-thumb {
        background-color: var(--text-header);
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: content-box;
    }
    .custom-scrollbar-bank::-webkit-scrollbar-thumb:hover {
        background-color: var(--cursor-color);
    }
    .custom-scrollbar-bank {
        scrollbar-width: thin;
        scrollbar-color: var(--text-header) rgba(0,0,0,0.3);
    }

    /* ============================================= */
    /*      4. ANIMATIONS & VISUAL EFFECTS           */
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
         0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px #00ffff); }
         50% { transform: scale(1.1); filter: drop-shadow(0 0 15px #00ffff); }
    }
    .animate-core-breathe {
        animation: core-breathe 4s ease-in-out infinite;
    }
    /* Logo Orbits */
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
    /* Main Logo Float */
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    .animate-float {
        animation: float 6s ease-in-out infinite;
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
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
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
`;

export function injectCss() {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = cssStyles;
    document.head.appendChild(styleElement);
}
