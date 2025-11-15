export const dialsCss = `
/* ============================================= */
/*          DIAL COMPONENTS                      */
/* ============================================= */

/* Category Dial Component (Forge/Default) */
.category-dial-button {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 9999px;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    z-index: 10;
}
.category-dial-button:active {
    cursor: grabbing;
    background: rgba(0,0,0,0.5);
    transform: scale(1.05);
}
.category-dial-list {
    position: absolute;
    top: 50%;
    left: -1rem;
    right: -1rem;
    transform: translateY(-50%) scaleY(0.5);
    background: rgba(10, 10, 20, 0.9);
    backdrop-filter: blur(5px);
    border-radius: 1rem;
    padding: 2.5rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease-out;
    pointer-events: none;
    z-index: 15;
}
.category-dial-list.open {
    transform: translateY(-50%) scaleY(1);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}
.category-dial-item {
    padding: 0.25rem 0.5rem;
    transition: all 0.2s ease;
    opacity: 0.5;
    cursor: pointer;
    background: none;
    border: none;
    font-family: inherit;
    width: 100%;
    text-align: center;
}
.category-dial-item:hover {
    opacity: 0.8;
    background-color: rgba(255,255,255,0.1);
}
.category-dial-item.active {
    transform: scale(1.2);
    opacity: 1;
    font-weight: bold;
}
.indicator-arrow {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.7;
    animation: bounce 1s infinite;
}
.indicator-arrow.up { top: 0.5rem; }
.indicator-arrow.down { bottom: 0.5rem; }

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
    top: 50%;
    left: -0.5rem;
    right: -0.5rem;
    transform: translateY(-50%) scaleY(0.5);
    background: rgba(5, 10, 15, 0.95);
    backdrop-filter: blur(5px);
    border-radius: 0.5rem;
    border: 1px solid var(--border-color);
    padding: 2.5rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease-out;
    pointer-events: none;
    z-index: 15;
}
.category-dial-list-bank.open {
    transform: translateY(-50%) scaleY(1);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}

/* Amount Dial Component */
.amount-dial-button {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 9999px;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    transition: all 0.2s ease;
    position: relative;
    z-index: 10;
    cursor: pointer;
}
.amount-dial-button:not(:disabled):active {
    cursor: grabbing;
    background: rgba(0,0,0,0.5);
    transform: scale(1.05);
}
.amount-dial-button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
.amount-dial-list {
    position: absolute;
    top: 50%;
    left: -1rem;
    right: -1rem;
    transform: translateY(-50%) scaleY(0.5);
    background: rgba(10, 10, 20, 0.9);
    backdrop-filter: blur(5px);
    border-radius: 1rem;
    padding: 2.5rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease-out;
    pointer-events: none;
    z-index: 15;
}
.amount-dial-list.open {
    transform: translateY(-50%) scaleY(1);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}
.amount-dial-item {
    padding: 0.25rem 0.5rem;
    transition: all 0.2s ease;
    opacity: 0.7;
    cursor: pointer;
    background: none;
    border: none;
    font-family: inherit;
    width: 100%;
    text-align: center;
    color: #fff;
}
.amount-dial-item:hover {
    opacity: 1;
    background-color: rgba(255,255,255,0.1);
}
.amount-dial-item.active {
    transform: scale(1.2);
    opacity: 1;
    font-weight: bold;
    color: var(--text-header);
}
`;