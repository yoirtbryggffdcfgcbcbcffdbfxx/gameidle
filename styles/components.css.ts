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
.scroll-contain {
    overscroll-behavior: contain;
}

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

@keyframes bounce {
    0%, 100% { transform: translate(-50%, 0); }
    50% { transform: translate(-50%, -5px); }
}
.indicator-arrow.down { animation-direction: reverse; }

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

/* Accordion for Settings */
.accordion-content {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease-out;
}
.accordion-content.open {
    grid-template-rows: 1fr;
}
.accordion-content > div {
    overflow: hidden;
}
.accordion-chevron-rotation {
    transition: transform 0.3s ease-out;
}
.accordion-chevron-rotation.open {
    transform: rotate(180deg);
}
`