export const tooltipCss = `
/* ============================================= */
/*          TOOLTIP                              */
/* ============================================= */
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
`;
