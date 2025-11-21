
import React, { useState } from 'react';
import ChevronLeftIcon from '../ui/ChevronLeftIcon';
import LockIcon from '../ui/LockIcon';

interface CloudAuthPanelProps {
    onBack: () => void;
    onRegister: (user: string, pass: string, confirm: string) => void;
    onLogin: (user: string, pass: string) => void;
    isLoading: boolean;
    statusMsg: string;
    initialUser?: string;
    playSfx: (sound: 'ui_hover') => void;
}

const CloudAuthPanel: React.FC<CloudAuthPanelProps> = ({ 
    onBack, onRegister, onLogin, isLoading, statusMsg, initialUser, playSfx 
}) => {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [cloudUserId, setCloudUserId] = useState(initialUser || '');
    const [cloudPassword, setCloudPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <div className="w-full animate-fade-in h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <button onClick={onBack} className="text-cyan-500 hover:text-white flex items-center gap-1 text-xs uppercase tracking-wider">
                    <ChevronLeftIcon className="w-4 h-4" /> Retour
                </button>
                <span className="text-purple-400 font-bold text-xs uppercase tracking-widest">QUANTUM UPLINK // ACCESS</span>
            </div>

            <div className="flex flex-col gap-4 animate-fade-in flex-grow justify-center">
                <div className="flex justify-center gap-4 mb-2">
                    <button 
                        onClick={() => { setAuthMode('login'); playSfx('ui_hover'); }}
                        className={`text-xs uppercase font-bold pb-1 border-b-2 transition-colors ${authMode === 'login' ? 'text-white border-cyan-500' : 'text-gray-500 border-transparent'}`}
                    >
                        Connexion
                    </button>
                    <button 
                        onClick={() => { setAuthMode('register'); playSfx('ui_hover'); }}
                        className={`text-xs uppercase font-bold pb-1 border-b-2 transition-colors ${authMode === 'register' ? 'text-white border-purple-500' : 'text-gray-500 border-transparent'}`}
                    >
                        Initialisation
                    </button>
                </div>

                <div className="space-y-3 bg-black/30 p-4 rounded border border-white/5">
                    <input 
                        type="text" 
                        value={cloudUserId}
                        onChange={(e) => setCloudUserId(e.target.value)}
                        placeholder="ID Pilote"
                        className="w-full bg-black/60 border border-white/20 rounded p-2 text-white text-sm font-mono focus:border-cyan-500 outline-none placeholder:text-gray-600"
                    />
                    <div className="relative">
                        <input 
                            type="password" 
                            value={cloudPassword}
                            onChange={(e) => setCloudPassword(e.target.value)}
                            placeholder="Clé d'Accès (Mdp)"
                            className="w-full bg-black/60 border border-white/20 rounded p-2 pl-8 text-white text-sm font-mono focus:border-cyan-500 outline-none placeholder:text-gray-600"
                        />
                        <LockIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    </div>

                    {authMode === 'register' && (
                        <div className="relative animate-slide-in-up">
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirmer Clé d'Accès"
                                className="w-full bg-black/60 border border-white/20 rounded p-2 pl-8 text-white text-sm font-mono focus:border-purple-500 outline-none placeholder:text-gray-600"
                            />
                            <LockIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        </div>
                    )}

                    <button 
                        onClick={() => authMode === 'login' ? onLogin(cloudUserId, cloudPassword) : onRegister(cloudUserId, cloudPassword, confirmPassword)}
                        disabled={isLoading || !cloudUserId || !cloudPassword}
                        className={`w-full py-3 rounded font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
                            authMode === 'login' 
                                ? 'bg-cyan-700 hover:bg-cyan-600 text-white shadow-cyan-900/20' 
                                : 'bg-purple-700 hover:bg-purple-600 text-white shadow-purple-900/20'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? 'Traitement...' : (authMode === 'login' ? 'Établir Liaison' : "Créer Identifiant")}
                    </button>
                    
                    {statusMsg && <p className="text-[10px] text-center text-yellow-400 mt-2 animate-pulse">{statusMsg}</p>}
                </div>
            </div>
        </div>
    );
};

export default CloudAuthPanel;
