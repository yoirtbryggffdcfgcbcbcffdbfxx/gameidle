
export const categoryDialCss = `
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
    top: 100%;
    left: 0;
    min-width: 100%;
    transform-origin: top center;
    transform: scaleY(0); /* Départ fermé */
    background: rgba(10, 10, 20, 0.98);
    backdrop-filter: blur(12px);
    border-radius: 0.25rem;
    border: 1px solid rgba(255,255,255,0.15);
    
    /* FIX: Reduced margin to minimize gap */
    margin-top: 2px; 
    padding: 0;
    
    display: flex;
    flex-direction: column;
    align-items: stretch; /* Ensure items stretch full width */
    opacity: 0;
    visibility: hidden;
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    
    /* FIX: Ultra High Z-Index to overlay MessageButton (z-1001) and Sticky Headers (z-50) */
    z-index: 3000; 
    box-shadow: 0 10px 30px rgba(0,0,0,0.9);
}
.category-dial-list.open {
    transform: none; /* FIX: Removed scaleY(1) to prevent hit-test issues on mobile */
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}
.category-dial-item {
    padding: 0.75rem 1rem;
    transition: background-color 0.2s ease, color 0.2s ease;
    opacity: 0.7;
    cursor: pointer;
    background: transparent; /* Explicit transparent background for hit testing */
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-family: inherit;
    width: 100%;
    text-align: left;
    white-space: nowrap;
    position: relative;
    display: block;
    z-index: 1;
    pointer-events: auto; /* Ensure it captures clicks */
}
.category-dial-item:last-child {
    border-bottom: none;
}
.category-dial-item:hover {
    opacity: 1;
    background-color: rgba(255,255,255,0.15);
}
.category-dial-item.active {
    opacity: 1;
    font-weight: bold;
    color: white;
    background-color: rgba(255,255,255,0.1);
    transform: none; 
}
`;
