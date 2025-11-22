import React, { useEffect, useRef } from 'react';
import { GameAction } from '../lib/types';

export const useGameLoop = (
    dispatch: React.Dispatch<GameAction>,
    productionPerSecond: number
) => {
    const productionRef = useRef(productionPerSecond);

    useEffect(() => {
        productionRef.current = productionPerSecond;
    }, [productionPerSecond]);

    useEffect(() => {
        const tickRate = 100; // 100ms
        
        const interval = setInterval(() => {
            const pps = productionRef.current;
            
            if (pps > 0) {
                dispatch({
                    type: 'TICK',
                    payload: {
                        delta: tickRate,
                        productionGenerated: pps * (tickRate / 1000)
                    }
                });
            }
        }, tickRate);

        return () => clearInterval(interval);
    }, [dispatch]);
};