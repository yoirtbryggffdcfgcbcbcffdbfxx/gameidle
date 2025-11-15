import React from 'react';
import { useGameContext } from '../contexts/GameContext';

// Import the new view components
import MainGameView from './views/MainGameView';
import QuantumCoreView from './views/QuantumCoreView';
import QuantumPathView from './views/QuantumPathView';
import ShopView from './views/ShopView';

const ViewManager: React.FC = () => {
    const { uiState } = useGameContext();
    const { activeView } = uiState;

    // Switch between the main views of the application
    switch (activeView) {
        case 'quantum_core':
            return <QuantumCoreView />;
        case 'quantum_path':
            return <QuantumPathView />;
        case 'shop':
            return <ShopView />;
        case 'main':
        default:
            return <MainGameView />;
    }
};

export default ViewManager;