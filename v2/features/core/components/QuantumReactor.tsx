
import React, { useCallback } from 'react';
import { useGameSelector, useGameDispatch } from '../../../lib/context';
import { activateCore } from '../actions';
import { spawnFloatingText } from '../../ui/actions';
import { ReactorVisual } from './ReactorVisual';

export const QuantumReactor: React.FC = React.memo(() => {
    const dispatch = useGameDispatch();
    
    const { charge, status, activeTimeRemaining } = useGameSelector(state => ({
        charge: state.core.charge,
        status: state.core.status,
        activeTimeRemaining: state.core.activeTimeRemaining
    }));

    const isReady = status === 'READY';
    const isActive = status === 'ACTIVE';

    // Couleurs fidèles à la V1
    const coreColor = isActive ? '#ff00c8' : '#00f5d4'; // Magenta (Active) / Cyan (Ready/Charge)

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (isReady) {
            dispatch(activateCore());
            dispatch(spawnFloatingText(e.clientX, e.clientY, "SURCHARGE !", '#ff00c8'));
        }
    }, [dispatch, isReady]);

    return (
        <div className="relative flex flex-col items-center justify-center" onClick={handleClick}>
            <ReactorVisual 
                coreColor={coreColor}
                charge={charge}
                isReady={isReady}
                isActive={isActive}
                activeTimeRemaining={activeTimeRemaining}
            />
        </div>
    );
});
