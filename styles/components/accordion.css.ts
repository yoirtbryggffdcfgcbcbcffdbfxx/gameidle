export const accordionCss = `
/* ============================================= */
/*          ACCORDION (SETTINGS)                 */
/* ============================================= */
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
`;
