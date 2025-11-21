
export const amountDialCss = `
/* Amount Dial Component */
.amount-dial-button {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 4px; /* Plus carré pour prendre moins de place, ou petit arrondi */
    padding: 0.25rem 0.5rem; /* Padding très réduit */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    position: relative;
    z-index: 10;
    cursor: pointer;
    min-width: 60px; /* Largeur minimale contrôlée */
    height: 30px; /* Hauteur fixe compacte */
}
.amount-dial-button:not(:disabled):active {
    cursor: grabbing;
    background: rgba(0,0,0,0.5);
    transform: scale(0.98);
}
.amount-dial-button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
.amount-dial-list {
    position: absolute;
    top: 100%;
    margin-top: 4px;
    right: 0; 
    min-width: 100%; /* S'aligne sur la largeur du bouton */
    width: auto;
    transform-origin: top right;
    transform: scaleY(0);
    background: rgba(10, 10, 20, 0.98);
    backdrop-filter: blur(10px);
    border-radius: 4px;
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    opacity: 0;
    visibility: hidden;
    transition: all 0.15s ease-out;
    pointer-events: none;
    z-index: 3000;
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
}
.amount-dial-list.open {
    transform: none; 
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}
.amount-dial-item {
    padding: 0.4rem 0.5rem;
    transition: all 0.2s ease;
    opacity: 0.7;
    cursor: pointer;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-family: inherit;
    font-size: 0.7rem; /* Texte plus petit dans la liste */
    width: 100%;
    text-align: center;
    color: #fff;
    display: block;
    position: relative;
    z-index: 1;
    pointer-events: auto;
}
.amount-dial-item:last-child {
    border-bottom: none;
}
.amount-dial-item:hover {
    opacity: 1;
    background-color: rgba(255,255,255,0.15);
}
.amount-dial-item.active {
    opacity: 1;
    font-weight: bold;
    color: var(--text-header);
    background-color: rgba(255,255,255,0.1);
    transform: none;
}
`;
