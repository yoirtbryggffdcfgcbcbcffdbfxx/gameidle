export const componentsCss = `
/* ============================================= */
/*          COMPONENTS & UI ELEMENTS             */
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
.scroll-contain {
    overscroll-behavior: contain;
}
/* General Custom Scrollbar Hiding */
.custom-scrollbar::-webkit-scrollbar {
    display: none;
}
.custom-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
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
`;