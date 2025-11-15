export const cursorCss = `
/* ============================================= */
/*          CUSTOM CURSOR                        */
/* ============================================= */
#custom-cursor {
    display: none; /* Hidden by default, enabled by media query for fine pointers */
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
`;
