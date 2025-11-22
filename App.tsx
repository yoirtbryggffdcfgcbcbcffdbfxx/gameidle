import React, { useState } from 'react';
import LegacyApp from './LegacyApp';
import RefactorGame from './v2/RefactorGame';
import Launcher from './components/Launcher';

type BootMode = 'launcher' | 'legacy' | 'v2';

const App: React.FC = () => {
    const [mode, setMode] = useState<BootMode>('launcher');

    if (mode === 'legacy') {
        return <LegacyApp onBackToLauncher={() => setMode('launcher')} />;
    }

    if (mode === 'v2') {
        return <RefactorGame onBack={() => setMode('launcher')} />;
    }

    return <Launcher onSelect={(selectedMode) => setMode(selectedMode)} />;
};

export default App;