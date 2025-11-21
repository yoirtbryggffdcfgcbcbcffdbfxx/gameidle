
import { themesCss } from '../styles/themes.css.ts';
import { baseCss } from '../styles/base.css.ts';
import { componentsCss } from '../styles/components/index.ts';
import { animationsCss } from '../styles/animations/index.ts';

// This function now acts as an orchestrator.
// It imports CSS strings from modularized files and combines them.
const cssStyles = `
    ${themesCss}
    ${baseCss}
    ${componentsCss}
    ${animationsCss}
`;

export function injectCss() {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = cssStyles;
    document.head.appendChild(styleElement);
}
