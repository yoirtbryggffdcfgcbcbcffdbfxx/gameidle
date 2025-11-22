
import React, { useEffect } from 'react';
import { useGameDispatch } from '../../../lib/context';
import { removeFloatingText } from '../actions';
import { FloatingTextData } from '../model';

interface FloatingTextItemProps {
    data: FloatingTextData;
}

// React.memo est crucial ici car ce composant est rendu dans une liste fréquente
export const FloatingTextItem: React.FC<FloatingTextItemProps> = React.memo(({ data }) => {
    const dispatch = useGameDispatch();

    // Nettoyage automatique après l'animation (1s)
    // On utilise onAnimationEnd dans le JSX, mais un useEffect de sécurité est bon aussi
    // pour garantir le nettoyage si l'animation CSS est interrompue.
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeFloatingText(data.id));
        }, 1000);
        return () => clearTimeout(timer);
    }, [dispatch, data.id]);

    const style: React.CSSProperties = {
        position: 'absolute',
        left: data.x,
        top: data.y,
        color: data.color,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 50,
        fontWeight: 'bold',
        textShadow: '1px 1px 2px black',
        animation: 'float-up 1s ease-out forwards', // Utilise l'animation définie dans base.css.ts
    };

    return (
        <div style={style}>
            {data.text}
        </div>
    );
});
