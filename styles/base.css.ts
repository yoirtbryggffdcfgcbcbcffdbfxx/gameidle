export const baseCss = `
/* ============================================= */
/*          BASE STYLES & LAYOUT                 */
/* ============================================= */
html, body {
    height: 100%;
    margin: 0;
    overflow: hidden; /* Hide main scrollbar */
    touch-action: pan-y; /* Allow vertical scrolling, prevent other gestures */
}
body {
    font-family: 'Press Start 2P', cursive;
    color: var(--text-main);
}

/* Hide all scrollbars across the entire application */
::-webkit-scrollbar {
    display: none;
}
* {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
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

    /* Add padding for safe areas on devices with notches */
    padding-top: env(safe-area-inset-top, 0);
    padding-right: env(safe-area-inset-right, 0);
    padding-bottom: env(safe-area-inset-bottom, 0);
    padding-left: env(safe-area-inset-left, 0);
}
#game-content.tutorial-active-scroll-lock,
#game-content.scroll-locked {
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

/* Scrollbar Utilities */
.scroll-contain {
    overscroll-behavior: contain;
}

/* Cursor Logic: Only show custom cursor and hide native one on devices that can hover. */
@media (hover: hover) and (pointer: fine) {
    body {
        cursor: none;
    }
    #custom-cursor {
        display: block;
    }
}

/* Dev panel override to force cursor visibility for testing */
body.force-show-cursor {
    cursor: none;
}
body.force-show-cursor #custom-cursor {
    display: block;
}
`;