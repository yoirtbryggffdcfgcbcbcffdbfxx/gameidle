import React, { useState, useRef } from 'react';
import { Settings } from '../../types';
import ToggleSwitch from '../ui/ToggleSwitch';
import ShieldCheckIcon from '../ui/ShieldCheckIcon';
import EyeIcon from '../ui/EyeIcon';
import PaletteIcon from '../ui/PaletteIcon';
import VolumeIcon from '../ui/VolumeIcon';
import DatabaseIcon from '../ui/DatabaseIcon';
import AlertTriangleIcon from '../ui/AlertTriangleIcon';
import ChevronDownIcon from '../ui/ChevronDownIcon';
import CheckIcon from '../ui/CheckIcon';

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

const AccordionSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    sectionId: string;
    openSection: string | null;
    setOpenSection: (id: string | null) => void;
    colorClass: string;
    children: React.ReactNode;
}> = ({ title, icon, sectionId, openSection, setOpenSection, colorClass, children }) => {
    const isOpen = openSection === sectionId;
    const toggle = () => {
        setOpenSection(isOpen ? null : sectionId);
    };

    return (
        <div className="border-b border-white/10 last:border-b-0">
            <button
                onClick={toggle}
                className="w-full flex justify-between items-center p-3 text-left transition-colors hover:bg-white/5"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 ${colorClass}`}>{icon}</div>
                    <span className={`font-bold ${colorClass}`}>{title}</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 accordion-chevron-rotation ${isOpen ? 'open' : ''}`} />
            </button>
            <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
                <div>
                    <div className="p-3 pt-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsPopup: React.FC<SettingsPopupProps> = ({ settings, onSettingsChange, onHardReset, playSfx }) => {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const handleToggle = (key: keyof Settings, value: boolean) => {
        playSfx('click');
        onSettingsChange({ [key]: value });
    };

    return (
        <div className="-m-4">
            <AccordionSection title="Général" icon={<ShieldCheckIcon />} sectionId="Général" openSection={openSection} setOpenSection={setOpenSection} colorClass="text-green-400">
                 <div className="space-y-3">
                    <ToggleSwitch 
                        label="Confirmer l'Ascension" 
                        enabled={settings.confirmAscension} 
                        onChange={(value) => handleToggle('confirmAscension', value)} 
                    />
                </div>
            </AccordionSection>

            <AccordionSection title="Affichage" icon={<EyeIcon />} sectionId="Affichage" openSection={openSection} setOpenSection={setOpenSection} colorClass="text-cyan-400">
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
            </AccordionSection>

            <AccordionSection title="Thème Visuel" icon={<PaletteIcon />} sectionId="Thème Visuel" openSection={openSection} setOpenSection={setOpenSection} colorClass="text-purple-400">
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
            </AccordionSection>

            <AccordionSection title="Audio" icon={<VolumeIcon />} sectionId="Audio" openSection={openSection} setOpenSection={setOpenSection} colorClass="text-blue-400">
                <div className="space-y-3">
                    <label className="flex flex-col text-xs">
                        <span className="mb-1.5">Volume des effets sonores : <span className="font-bold text-cyan-300">{Math.round(settings.sfxVolume * 100)}%</span></span>
                        <input type="range" min="0" max="1" step="0.01" value={settings.sfxVolume} onChange={(e) => onSettingsChange({ sfxVolume: parseFloat(e.target.value) })} />
                    </label>
                </div>
            </AccordionSection>

            <AccordionSection title="Gestion des Données" icon={<DatabaseIcon />} sectionId="Gestion des Données" openSection={openSection} setOpenSection={setOpenSection} colorClass="text-gray-400">
                <div className="space-y-3">
                    <div className="flex gap-2 text-xs">
                        <button disabled className="flex-1 bg-gray-600 text-white/50 p-2 rounded cursor-not-allowed">Exporter la Sauvegarde</button>
                        <button disabled className="flex-1 bg-gray-600 text-white/50 p-2 rounded cursor-not-allowed">Importer la Sauvegarde</button>
                    </div>
                    <p className="text-center text-[10px] opacity-60">Bientôt disponible !</p>
                </div>
            </AccordionSection>
            
            <AccordionSection title="Zone de Danger" icon={<AlertTriangleIcon />} sectionId="Zone de Danger" openSection={openSection} setOpenSection={setOpenSection} colorClass="text-red-500">
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
            </AccordionSection>
        </div>
    );
};

export default SettingsPopup;