import React from 'react';
import Popup from './Popup';
import { Settings } from '../../types';

interface SettingsPopupProps {
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
    onClose: () => void;
    onHardReset: () => void;
}

const SettingsPopup: React.FC<SettingsPopupProps> = ({ settings, onSettingsChange, onClose, onHardReset }) => {
    return (
        <Popup title="Paramètres" onClose={onClose}>
            <div className="space-y-4">
                <label className="flex items-center justify-between">
                    <span>Effets visuels</span>
                    <input type="checkbox" checked={settings.visualEffects} onChange={(e) => onSettingsChange({ visualEffects: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between">
                    <span>Confirmer Ascension</span>
                    <input type="checkbox" checked={settings.confirmAscension} onChange={(e) => onSettingsChange({ confirmAscension: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between">
                    <span>Notation scientifique</span>
                    <input type="checkbox" checked={settings.scientificNotation} onChange={(e) => onSettingsChange({ scientificNotation: e.target.checked })} />
                </label>
                <label className="flex flex-col">
                    <span>Vitesse animation : {settings.animSpeed}x</span>
                    <input type="range" min="1" max="5" step="0.5" value={settings.animSpeed} onChange={(e) => onSettingsChange({ animSpeed: parseFloat(e.target.value) })} />
                </label>
                <label className="flex flex-col">
                    <span>Volume SFX : {Math.round(settings.sfxVolume * 100)}%</span>
                    <input type="range" min="0" max="1" step="0.01" value={settings.sfxVolume} onChange={(e) => onSettingsChange({ sfxVolume: parseFloat(e.target.value) })} />
                </label>
                <label className="flex items-center justify-between">
                    <span>Thème</span>
                    <select value={settings.theme} onChange={(e) => onSettingsChange({ theme: e.target.value as any })} className="bg-gray-700 text-white p-1 rounded">
                        <option value="dark">Néon Noir</option>
                        <option value="light">Classique Clair</option>
                        <option value="matrix">Matrix</option>
                        <option value="solaris">Solaris</option>
                        <option value="cyberpunk">Cyberpunk</option>
                    </select>
                </label>
                <button onClick={onHardReset} className="w-full bg-red-700 text-white p-2 rounded mt-4 transition-colors hover:bg-red-600 active:bg-red-800">Réinitialiser le jeu</button>
            </div>
        </Popup>
    );
};

export default SettingsPopup;