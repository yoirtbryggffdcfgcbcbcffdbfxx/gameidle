import React from 'react';
import { Settings } from '../../types';
import ToggleSwitch from '../ui/ToggleSwitch';

interface SettingsPopupProps {
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
    onClose: () => void; // Kept for prop compatibility, but not used
    onHardReset: () => void;
    playSfx: (sound: 'click' | 'ui_hover') => void;
}

const themes = [
    { id: 'dark', name: 'Néon Noir', from: '#1e1e2f', to: '#2a2a3f', text: '#ffcc00' },
    { id: 'light', name: 'Classique Clair', from: '#eef2f3', to: '#8e9eab', text: '#d35400' },
    { id: 'matrix', name: 'Matrix', from: '#000000', to: '#0d0d0d', text: '#39ff14' },
    { id: 'solaris', name: 'Solaris', from: '#ff7e5f', to: '#feb47b', text: '#4a1c0d' },
    { id: 'cyberpunk', name: 'Cyberpunk', from: '#0b022d', to: '#3a0ca3', text: '#ff00c8' },
];

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-sm text-yellow-400 mb-2 border-b border-yellow-400/20 pb-1">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const SettingsPopup: React.FC<SettingsPopupProps> = ({ settings, onSettingsChange, onHardReset, playSfx }) => {

    const handleToggle = (key: keyof Settings, value: boolean) => {
        playSfx('click');
        onSettingsChange({ [key]: value });
    };

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-2xl text-center text-[var(--text-header)] mb-4">Paramètres</h2>
            <div className="space-y-5 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                
                <SettingsSection title="Général">
                    <ToggleSwitch 
                        label="Confirmer l'Ascension" 
                        enabled={settings.confirmAscension} 
                        onChange={(value) => handleToggle('confirmAscension', value)} 
                    />
                </SettingsSection>

                <SettingsSection title="Affichage">
                    <ToggleSwitch 
                        label="Effets Visuels (Particules)" 
                        enabled={settings.visualEffects} 
                        onChange={(value) => handleToggle('visualEffects', value)}
                    />
                     <ToggleSwitch 
                        label="Texte Flottant (+Énergie)" 
                        enabled={settings.showFloatingText} 
                        onChange={(value) => handleToggle('showFloatingText', value)}
                    />
                    <ToggleSwitch 
                        label="Notation Scientifique" 
                        enabled={settings.scientificNotation} 
                        onChange={(value) => handleToggle('scientificNotation', value)}
                    />
                    <label className="flex flex-col text-xs">
                        <span className="mb-1.5">Vitesse d'animation : <span className="font-bold text-cyan-300">{settings.animSpeed}x</span></span>
                        <input type="range" min="1" max="5" step="0.5" value={settings.animSpeed} onChange={(e) => onSettingsChange({ animSpeed: parseFloat(e.target.value) })} />
                    </label>
                </SettingsSection>

                <SettingsSection title="Thème Visuel">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {themes.map(theme => (
                            <button
                                key={theme.id}
                                onClick={() => onSettingsChange({ theme: theme.id as any })}
                                className={`p-2 rounded-md border-2 transition-all ${settings.theme === theme.id ? 'border-cyan-400 scale-105' : 'border-transparent hover:border-cyan-400/50'}`}
                            >
                                <div className="w-full h-10 rounded" style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}></div>
                                <p className="text-xs mt-1" style={{ color: theme.text }}>{theme.name}</p>
                            </button>
                        ))}
                    </div>
                </SettingsSection>

                <SettingsSection title="Audio">
                    <label className="flex flex-col text-xs">
                        <span className="mb-1.5">Volume des effets sonores : <span className="font-bold text-cyan-300">{Math.round(settings.sfxVolume * 100)}%</span></span>
                        <input type="range" min="0" max="1" step="0.01" value={settings.sfxVolume} onChange={(e) => onSettingsChange({ sfxVolume: parseFloat(e.target.value) })} />
                    </label>
                </SettingsSection>

                <SettingsSection title="Gestion des Données">
                    <div className="flex gap-2 text-xs">
                        <button disabled className="flex-1 bg-gray-600 text-white/50 p-2 rounded cursor-not-allowed">Exporter la Sauvegarde</button>
                        <button disabled className="flex-1 bg-gray-600 text-white/50 p-2 rounded cursor-not-allowed">Importer la Sauvegarde</button>
                    </div>
                     <p className="text-center text-[10px] opacity-60">Bientôt disponible !</p>
                </SettingsSection>
                
                <SettingsSection title="Zone de Danger">
                    <button 
                        onClick={() => {
                            playSfx('click');
                            onHardReset();
                        }} 
                        className="w-full bg-red-800/80 text-white p-2 rounded transition-colors hover:bg-red-700 active:bg-red-900 border border-red-500/50 flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">⚠️</span> Réinitialiser Toute la Progression
                    </button>
                </SettingsSection>

            </div>
        </div>
    );
};

export default SettingsPopup;