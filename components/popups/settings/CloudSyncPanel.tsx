
import React, { useState } from 'react';
import { Settings, GameState } from '../../../types';
import { useGameContext } from '../../../contexts/GameContext';
import GlobeIcon from '../../ui/GlobeIcon';
import CheckIcon from '../../ui/CheckIcon';
import LockIcon from '../../ui/LockIcon';

interface CloudSyncPanelProps {
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
    onSave: (gameState: GameState, settings: Settings) => Promise<boolean>;
    onLoad: (settings: Settings) => Promise<boolean>;
}

const DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbxWwHScSbi7vbC1D-NxmnPIRhdLV0-XybifytgqeblokkgbRXCK8ypxLsyDkpjmplp8/exec';

const CloudSyncPanel: React.FC<CloudSyncPanelProps> = ({ settings, onSettingsChange, onSave, onLoad }) => {
    const { gameState, playSfx, uiState, handlers } = useGameContext();
    const [isLoading, setIsLoading] = useState<'save' | 'load' | 'time' | null>(null);
    const [lastActionStatus, setLastActionStatus] = useState<'success' | 'error' | null>(null);

    const { cloudStatus } = uiState;

    const handleSave = async () => {
        if (isLoading) return;
        setIsLoading('save');
        setLastActionStatus(null);
        const success = await onSave(gameState, settings);
        setIsLoading(null);
        setLastActionStatus(success ? 'success' : 'error');
    };

    const handleLoad = async () => {
        if (isLoading) return;
        setIsLoading('load');
        setLastActionStatus(null);
        const success = await onLoad(settings);
        // Si succès, la page reload, donc pas besoin de reset loading
        if (!success) {
            setIsLoading(null);
            setLastActionStatus('error');
        }
    };

    const handleCheckTime = async () => {
        if (isLoading) return;
        setIsLoading('time');
        playSfx('click');
        const serverTime = await handlers.checkServerTime(settings.cloudApiUrl);
        setIsLoading(null);
        
        if (serverTime) {
            const date = new Date(serverTime);
            handlers.addMessage(`Horloge Serveur : ${date.toLocaleTimeString()}`, 'info', { title: 'Temps UTC' });
        } else {
            handlers.addMessage("Impossible de joindre le serveur de temps.", 'error');
        }
    };

    // Nettoyage automatique à la saisie
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const clean = e.target.value.replace(/\s/g, '');
        onSettingsChange({ cloudApiUrl: clean });
    };

    const resetDefaultUrl = () => {
        playSfx('click');
        onSettingsChange({ cloudApiUrl: DEFAULT_API_URL });
    };

    const testUrl = () => {
        const cleanUrl = settings.cloudApiUrl.replace(/\s/g, '');
        const cleanUser = settings.cloudUserId.trim();
        if (cleanUrl) {
            const target = cleanUser ? `${cleanUrl}?userId=${encodeURIComponent(cleanUser)}` : cleanUrl;
            window.open(target, '_blank');
        }
    };

    // Statut visuel pour le header
    const statusColor = cloudStatus === 'connected' ? 'text-green-400' : cloudStatus === 'offline' ? 'text-orange-400' : 'text-gray-500';
    const statusLabel = cloudStatus === 'connected' ? 'CONNECTÉ' : cloudStatus === 'offline' ? 'LOCAL' : 'OFF';

    return (
        <div className="bg-gradient-to-br from-pink-950/30 to-purple-950/30 rounded-lg border border-pink-500/30 overflow-hidden">
            {/* Header Visuel */}
            <div className="bg-black/40 p-3 flex items-center justify-between border-b border-pink-500/20">
                <div className="flex items-center gap-2 text-pink-400">
                    <GlobeIcon className="w-5 h-5" />
                    <span className="font-bold text-sm">Synchronisation Cloud</span>
                </div>
                <div className="flex items-center gap-2">
                    {isLoading && <div className="text-xs text-pink-300 animate-pulse">Traitement...</div>}
                    <div className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/50 border border-white/10 ${statusColor}`}>
                        {statusLabel}
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Identification */}
                <div className="space-y-3 bg-black/20 p-3 rounded border border-pink-500/10">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider ml-1">ID (Pseudo)</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={settings.cloudUserId}
                                onChange={(e) => onSettingsChange({ cloudUserId: e.target.value })}
                                placeholder="Ex: Joueur99"
                                className="w-full bg-black/60 border border-gray-600 rounded p-2 pl-3 text-white text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all font-mono"
                            />
                            {settings.cloudUserId && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                                    <CheckIcon className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider ml-1">Mot de Passe</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                value={settings.cloudPassword || ''}
                                onChange={(e) => onSettingsChange({ cloudPassword: e.target.value })}
                                placeholder="Secret..."
                                className="w-full bg-black/60 border border-gray-600 rounded p-2 pl-8 text-white text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all font-mono"
                            />
                            <LockIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        </div>
                    </div>
                    
                    <p className="text-[9px] text-gray-500 ml-1 italic">Ces identifiants sont nécessaires pour récupérer votre partie.</p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Save Button */}
                    <button 
                        onClick={handleSave}
                        disabled={!settings.cloudUserId || !settings.cloudPassword || !!isLoading}
                        className={`
                            relative overflow-hidden p-3 rounded border transition-all duration-200 flex flex-col items-center justify-center gap-1 group
                            ${!settings.cloudUserId || !settings.cloudPassword || isLoading 
                                ? 'bg-gray-800/50 border-gray-700 text-gray-600 cursor-not-allowed' 
                                : 'bg-pink-900/20 border-pink-600/50 hover:bg-pink-800/40 hover:border-pink-400 text-pink-200'
                            }
                        `}
                    >
                        {isLoading === 'save' ? (
                            <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-1"></div>
                        ) : (
                            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">☁️</div>
                        )}
                        <span className="font-bold text-xs uppercase tracking-wider">Sauvegarder</span>
                    </button>

                    {/* Load Button */}
                    <button 
                        onClick={handleLoad}
                        disabled={!settings.cloudUserId || !settings.cloudPassword || !!isLoading}
                        className={`
                            relative overflow-hidden p-3 rounded border transition-all duration-200 flex flex-col items-center justify-center gap-1 group
                            ${!settings.cloudUserId || !settings.cloudPassword || isLoading 
                                ? 'bg-gray-800/50 border-gray-700 text-gray-600 cursor-not-allowed' 
                                : 'bg-purple-900/20 border-purple-600/50 hover:bg-purple-800/40 hover:border-purple-400 text-purple-200'
                            }
                        `}
                    >
                        {isLoading === 'load' ? (
                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-1"></div>
                        ) : (
                            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📥</div>
                        )}
                        <span className="font-bold text-xs uppercase tracking-wider">Charger</span>
                    </button>
                </div>

                {/* Configuration Avancée (URL) */}
                <details className="group pt-2 border-t border-white/5">
                    <summary className="cursor-pointer text-[9px] text-gray-600 hover:text-gray-400 transition-colors list-none flex items-center gap-1 mt-2">
                        <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                        <span>Configuration Serveur</span>
                    </summary>
                    <div className="mt-2 pl-2 border-l-2 border-gray-800 space-y-2">
                        <div>
                            <label className="block text-[9px] text-gray-500 mb-1">URL Script Google</label>
                            <input 
                                type="text" 
                                value={settings.cloudApiUrl}
                                onChange={handleUrlChange}
                                className="w-full bg-black/30 border border-gray-700 rounded p-1.5 text-gray-400 text-[10px] focus:text-white focus:border-gray-500 outline-none font-mono"
                            />
                        </div>
                        
                        <div className="flex justify-between items-center gap-2">
                            <button 
                                onClick={resetDefaultUrl}
                                className="flex-1 text-[10px] text-yellow-400 hover:text-yellow-200 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-600/30 transition-colors"
                            >
                                ↺ Reset URL
                            </button>
                            <button 
                                onClick={testUrl}
                                className="flex-1 text-[10px] text-cyan-400 hover:text-cyan-200 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/30 transition-colors"
                            >
                                🔗 Test
                            </button>
                            <button 
                                onClick={handleCheckTime}
                                disabled={isLoading === 'time'}
                                className="flex-1 text-[10px] text-purple-400 hover:text-purple-200 bg-purple-900/20 px-2 py-1 rounded border border-purple-500/30 transition-colors"
                            >
                                {isLoading === 'time' ? '...' : '⏱️ Clock'}
                            </button>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    );
};

export default CloudSyncPanel;
