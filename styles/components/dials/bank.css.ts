
export const bankDialCss = `
/* Category Dial Component - Bank Variant */
.category-dial-button-bank {
    background: rgba(10, 20, 30, 0.6);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    z-index: 10;
    box-shadow: inset 0 0 10px rgba(0, 200, 255, 0.2);
}
.category-dial-button-bank:active {
    cursor: grabbing;
    background: rgba(10, 20, 30, 0.8);
    transform: scale(1.02);
}
.category-dial-list-bank {
    position: absolute;
    top: 100%;
    margin-top: 2px;
    left: 0;
    right: 0;
    transform-origin: top center;
    transform: scaleY(0);
    background: rgba(5, 10, 15, 0.98);
    backdrop-filter: blur(10px);
    border-radius: 0.25rem;
    border: 1px solid var(--border-color);
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease-out;
    pointer-events: none;
    z-index: 3000;
    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
}
.category-dial-list-bank.open {
    transform: none; /* FIX: Removed scaleY(1) to prevent hit-test issues */
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}
`;
