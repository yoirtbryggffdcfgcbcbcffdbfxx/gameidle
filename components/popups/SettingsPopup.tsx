
import React, { useState } from 'react';
import { Settings, GameState } from '../../types';
import ToggleSwitch from '../ui/ToggleSwitch';
import Accordion from '../ui/Accordion';
import ShieldCheckIcon from '../ui/ShieldCheckIcon';
import EyeIcon from '../ui/EyeIcon';
import PaletteIcon from '../ui/PaletteIcon';
import VolumeIcon from '../ui/VolumeIcon';
import DatabaseIcon from '../ui/DatabaseIcon';
import AlertTriangleIcon from '../ui/AlertTriangleIcon';
import CheckIcon from '../ui/CheckIcon';
import GlobeIcon from '../ui/GlobeIcon';
import { useGameContext } from '../../contexts/GameContext';
import CloudSyncPanel from './settings/CloudSyncPanel';

interface SettingsPopupProps {
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
    onClose: () => void;
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

const SettingsPopup: React.FC<SettingsPopupProps> = ({ settings, onSettingsChange, onHardReset, playSfx }) => {
    const [openSection, setOpenSection] = useState<string | null>(null);
    
    const { handlers, gameState } = useGameContext();

    const handleToggle = (key: keyof Settings, value: boolean) => {
        playSfx('click');
        onSettingsChange({ [key]: value });
    };

    const toggleSection = (sectionId: string) => {
        setOpenSection(prev => prev === sectionId ? null : sectionId);
    };

    return (
        <div className="-m-4">
            <Accordion 
                title="Général" 
                icon={<ShieldCheckIcon />} 
                isOpen={openSection === 'Général'} 
                onToggle={() => toggleSection('Général')} 
                colorClass="text-green-400"
            >
                 <div className="space-y-3">
                    <ToggleSwitch 
                        label="Confirmer l'Ascension" 
                        enabled={settings.confirmAscension} 
                        onChange={(value) => handleToggle('confirmAscension', value)} 
                    />
                </div>
            </Accordion>

            <Accordion 
                title="Affichage" 
                icon={<EyeIcon />} 
                isOpen={openSection === 'Affichage'} 
                onToggle={() => toggleSection('Affichage')} 
                colorClass="text-cyan-400"
            >
                <div className="space-y-3">
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
                </div>
            </Accordion>

            <Accordion 
                title="Thème Visuel" 
                icon={<PaletteIcon />} 
                isOpen={openSection === 'Thème Visuel'} 
                onToggle={() => toggleSection('Thème Visuel')} 
                colorClass="text-purple-400"
            >
                <div className="grid grid-cols-2 gap-3">
                    {themes.map(theme => {
                        const isActive = settings.theme === theme.id;
                        return (
                            <button
                                key={theme.id}
                                onClick={() => {
                                    playSfx('click');
                                    onSettingsChange({ theme: theme.id as any });
                                }}
                                className={`relative p-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
                                    isActive ? 'border-cyan-400 scale-105 shadow-lg' : 'border-white/10'
                                }`}
                                style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
                            >
                                <span 
                                    className="font-bold text-sm" 
                                    style={{ color: theme.text, textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}
                                >
                                    {theme.name}
                                </span>
                                {isActive && (
                                    <div className="absolute top-1 right-1 bg-cyan-500 rounded-full p-0.5 text-black">
                                        <CheckIcon className="w-3 h-3" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </Accordion>

            <Accordion 
                title="Audio" 
                icon={<VolumeIcon />} 
                isOpen={openSection === 'Audio'} 
                onToggle={() => toggleSection('Audio')} 
                colorClass="text-blue-400"
            >
                <div className="space-y-3">
                    <label className="flex flex-col text-xs">
                        <span className="mb-1.5">Volume des effets sonores : <span className="font-bold text-cyan-300">{Math.round(settings.sfxVolume * 100)}%</span></span>
                        <input type="range" min="0" max="1" step="0.01" value={settings.sfxVolume} onChange={(e) => onSettingsChange({ sfxVolume: parseFloat(e.target.value) })} />
                    </label>
                </div>
            </Accordion>

            <Accordion 
                title="Sauvegarde Locale / Export" 
                icon={<DatabaseIcon />} 
                isOpen={openSection === 'Sauvegarde Locale'} 
                onToggle={() => toggleSection('Sauvegarde Locale')} 
                colorClass="text-gray-400"
            >
                <div className="space-y-3">
                    <div className="flex gap-2 text-xs">
                        <button 
                            onClick={() => handlers.onExportSave(gameState, settings)}
                            className="flex-1 bg-cyan-900/50 hover:bg-cyan-800 border border-cyan-600 text-cyan-200 p-2 rounded transition-colors"
                        >
                            Copier le Code
                        </button>
                        <button 
                            onClick={() => handlers.onImportSave()}
                            className="flex-1 bg-yellow-900/50 hover:bg-yellow-800 border border-yellow-600 text-yellow-200 p-2 rounded transition-colors"
                        >
                            Coller un Code
                        </button>
                    </div>
                    <p className="text-center text-[10px] opacity-60">Utilisez ceci pour transférer votre partie manuellement.</p>
                </div>
            </Accordion>

            <Accordion 
                title="Cloud Personnel" 
                icon={<GlobeIcon className="w-5 h-5" />} 
                isOpen={openSection === 'Cloud'} 
                onToggle={() => toggleSection('Cloud')} 
                colorClass="text-pink-400"
            >
               <CloudSyncPanel 
                   settings={settings} 
                   onSettingsChange={onSettingsChange} 
                   onSave={handlers.onCloudSave}
                   onLoad={handlers.onCloudLoad}
               />
            </Accordion>
            
            <Accordion 
                title="Zone de Danger" 
                icon={<AlertTriangleIcon />} 
                isOpen={openSection === 'Zone de Danger'} 
                onToggle={() => toggleSection('Zone de Danger')} 
                colorClass="text-red-500"
            >
                <div className="space-y-3">
                    <button 
                        onClick={() => {
                            playSfx('click');
                            onHardReset();
                        }} 
                        className="w-full bg-red-800/80 text-white p-2 rounded transition-colors hover:bg-red-700 active:bg-red-900 border border-red-500/50 flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">⚠️</span> Réinitialiser Toute la Progression
                    </button>
                </div>
            </Accordion>
        </div>
    );
};

export default SettingsPopup;
