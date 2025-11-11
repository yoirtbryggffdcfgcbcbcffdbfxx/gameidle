export const baseCss = `
/* ============================================= */
/*          BASE STYLES & LAYOUT                 */
/* ============================================= */
html, body {
    height: 100%;
    margin: 0;
    overflow: hidden; /* Hide main scrollbar */
    cursor: none;
    touch-action: pan-y; /* Allow vertical scrolling, prevent other gestures */
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
    scroll-behavior: smooth; /* For programmatic scrolling */
    overscroll-behavior-y: contain; /* Prevents pull-to-refresh on mobile */
    /* Hide the default browser scrollbar */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
#game-content::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}
#game-content.tutorial-active-scroll-lock {
    overflow: hidden;
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
`;
