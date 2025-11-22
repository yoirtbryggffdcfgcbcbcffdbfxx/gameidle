import React, { useCallback } from 'react';
import { useGameDispatch, useGameSelector } from '../../../lib/context';
import { clickCore } from '../actions';
import { spawnFloatingText } from '../../ui/actions';
import { selectClickPower } from '../../upgrades/selectors';
import { formatNumber } from '../../../lib/formatters';

export const CoreButton: React.FC = React.memo(() => {
    const dispatch = useGameDispatch();
    const clickPower = useGameSelector(selectClickPower);

    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent sticky focus on mobile
        dispatch(clickCore(clickPower));
        const x = e.clientX;
        const y = e.clientY;
        dispatch(spawnFloatingText(x, y, `+${formatNumber(clickPower)}`, '#ffffff'));
    }, [dispatch, clickPower]);

    return (
        <button
            id="collect-button"
            onPointerDown={handleClick} // Utilisation de onPointerDown pour une meilleure réactivité mobile
            className="injector-button group w-48 md:w-64 mx-auto" // Reuse V1 CSS class
        >
            <div className="injector-core">
                <span className="injector-label">INJECTION</span>
            </div>

            {/* Decorative screws/rivets V1 style */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-gray-500 rounded-full shadow-[0_0_5px_white]"></div>
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-gray-500 rounded-full shadow-[0_0_5px_white]"></div>
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gray-500 rounded-full shadow-[0_0_5px_white]"></div>
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-gray-500 rounded-full shadow-[0_0_5px_white]"></div>

            {/* Effet scanline intégré au bouton */}
            <div className="absolute top-0 left-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-red-400/80 to-transparent animate-[scan-line_4s_linear_infinite] group-hover:animate-[scan-line_2s_linear_infinite]"></div>
        </button>
    );
});