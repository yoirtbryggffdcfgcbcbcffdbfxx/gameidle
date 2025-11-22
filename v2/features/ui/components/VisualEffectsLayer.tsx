
import React from 'react';
import { useGameSelector } from '../../../lib/context';
import { FloatingTextItem } from './FloatingTextItem';

export const VisualEffectsLayer: React.FC = () => {
    const floatingTexts = useGameSelector(state => state.ui.floatingTexts);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {floatingTexts.map(ft => (
                <FloatingTextItem key={ft.id} data={ft} />
            ))}
        </div>
    );
};
