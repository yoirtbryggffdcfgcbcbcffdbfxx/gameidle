
import React, { useState, useEffect } from 'react';
import { SaveSlotMetadata } from '../types';
import { useGameContext } from '../contexts/GameContext';
import GlobeIcon from './ui/GlobeIcon';

// Nouveaux composants refactorisés
import Menu3DContainer from './menu/Menu3DContainer';
import CloudAuthPanel from './menu/CloudAuthPanel';
import CloudSlotsPanel from './menu/CloudSlotsPanel';

interface MainMenuProps {
    hasSaveData: boolean;
    onContinue: () => void;
    onNewGame: () => void;
    onCreditsClick: () => void;
    playSfx: (sound: 'ui_hover' | 'click' | 'buy') => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ hasSaveData, onContinue, onNewGame, onCreditsClick, playSfx }) => {
    const { uiState, handlers, memoizedFormatNumber } = useGameContext();
    
    // Menu View State
    const [view, setView] = useState<'main' | 'cloud-auth' | 'cloud-slots'>('main');
    
    // Cloud State
    const initialUserId = uiState.settings.cloudUserId ? uiState.settings.cloudUserId.split('_')[0] : '';
    
    const [cloudUserId, setCloudUserId] = useState(initialUserId);
    const [cloudPassword, setCloudPassword] = useState(uiState.settings.cloudPassword || '');
    
    const [slots, setSlots] = useState<SaveSlotMetadata[]>([]);
    
    // Changement: on utilise une string pour décrire l'action en cours, null si rien
    const [loadingOperation, setLoadingOperation] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState('');

    const defaultUrl = 'https://script.google.com/macros/s/AKfycbxWwHScSbi7vbC1D-NxmnPIRhdLV0-XybifytgqeblokkgbRXCK8ypxLsyDkpjmplp8/exec';
    const [apiUrl] = useState(uiState.settings.cloudApiUrl || defaultUrl);

    // Cloud Logic
    const handleCloudClick = () => {
        playSfx('click');
        if (initialUserId && uiState.settings.cloudPassword) {
            // Auto-login flow
            setView('cloud-slots');
            handleLogin(initialUserId, uiState.settings.cloudPassword, true);
        } else {
            setView('cloud-auth');
        }
    };

    const handleBackToMain = () => {
        playSfx('click');
        setView('main');
        setStatusMsg('');
    };

    const handleRegister = async (user: string, pass: string, confirm: string) => {
        playSfx('click');
        if (!user || !pass) {
            setStatusMsg("Champs manquants.");
            return;
        }
        if (pass !== confirm) {
            setStatusMsg("Les mots de passe ne correspondent pas.");
            return;
        }
        
        setLoadingOperation("CRÉATION DU COMPTE...");
        setStatusMsg("Initialisation du protocole...");
        
        const success = await handlers.registerCloudAccount(user, pass, apiUrl);
        setLoadingOperation(null);
        
        if (success) {
            setStatusMsg("Uplink établi ! Connectez-vous.");
            setCloudUserId(user);
        } else {
            setStatusMsg("Échec initialisation (ID existant ?).");
        }
    };

    const handleLogin = async (user: string, pass: string, silent = false) => {
        if (!silent) playSfx('click');
        if (!user || !pass) {
            if (!silent) setStatusMsg("Identifiants requis.");
            return;
        }

        setLoadingOperation(silent ? "CONNEXION AUTO..." : "AUTHENTIFICATION...");
        if (!silent) setStatusMsg("Synchronisation...");

        // On sauvegarde les credentials localement pour usage futur
        setCloudUserId(user);
        setCloudPassword(pass);

        const success = await handlers.loginCloudAccount(user, pass, apiUrl);
        
        if (success) {
            if (!silent) setView('cloud-slots');
            setStatusMsg("");
            // Charger les slots immédiatement après le login
            await fetchSlots(user, pass);
        } else {
            if (!silent) setStatusMsg("Signature non reconnue.");
            if (silent) setView('cloud-auth'); // Fallback si auto-login échoue
            setLoadingOperation(null); // Stop loading only on failure
        }
        
        // Note: fetchSlots will handle clearing loadingOperation if needed, 
        // but generally we keep it generic here.
        if (!success) setLoadingOperation(null);
    };

    const fetchSlots = async (user = cloudUserId, pass = cloudPassword) => {
        try {
            if (slots.length === 0) setLoadingOperation("ANALYSE DES SECTEURS...");
            const data = await handlers.checkCloudSlots(user, pass, apiUrl);
            setSlots(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingOperation(null);
        }
    };

    const handleSlotAction = async (slot: SaveSlotMetadata) => {
        playSfx('click');
        let success = false;

        try {
            if (slot.isEmpty) {
                // Suppression du window.confirm pour éviter les blocages dans les environnements sandboxés
                setLoadingOperation(`INITIALISATION SECTEUR ${slot.slotId}...`);
                success = await handlers.saveNewGameToSlot(cloudUserId, cloudPassword, slot.slotId, apiUrl);
            } else {
                setLoadingOperation(`TÉLÉCHARGEMENT SECTEUR ${slot.slotId}...`);
                await handlers.loadCloudSlot(cloudUserId, cloudPassword, slot.slotId, apiUrl);
                // Note: loadCloudSlot handles reload internally on success
                return; 
            }
        } catch (e) {
            console.error("Slot Action Failed", e);
            success = false;
        } finally {
            // IMPORTANT : Si succès (ou mode dégradé réussi), on reload la page
            if (success) {
                // Petit délai pour être sûr que le LocalStorage est bien écrit
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                // Si échec, on retire le loader pour rendre la main à l'utilisateur
                setLoadingOperation(null);
            }
        }
    };

    const handleLogout = () => {
        setSlots([]);
        setCloudPassword('');
        setView('cloud-auth');
        playSfx('click');
    };

    return (
        <Menu3DContainer 
            onCreditsClick={onCreditsClick} 
            playSfx={playSfx} 
            apiUrl={apiUrl}
        >
            {/* --- VIEW 1: MAIN BUTTONS --- */}
            {view === 'main' && (
                <div className="space-y-3 md:space-y-4 w-full max-w-xs flex flex-col animate-fade-in m-auto">
                    {hasSaveData && (
                        <button 
                            onClick={onContinue}
                            onMouseEnter={() => playSfx('ui_hover')}
                            className="menu-btn menu-btn-cyan group"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                                REPRENDRE (LOCAL)
                            </span>
                            <div className="absolute inset-0 bg-cyan-500/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 skew-x-12"></div>
                        </button>
                    )}
                    
                    <button 
                        onClick={handleCloudClick}
                        onMouseEnter={() => playSfx('ui_hover')} 
                        className="menu-btn menu-btn-purple group"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <GlobeIcon className="w-4 h-4" />
                            QUANTUM UPLINK
                        </span>
                        <div className="absolute inset-0 bg-purple-600/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 skew-x-12"></div>
                    </button>

                    <button 
                        onClick={onNewGame}
                        onMouseEnter={() => playSfx('ui_hover')} 
                        className="menu-btn border-gray-600 text-gray-400 hover:text-white hover:border-white group text-xs"
                    >
                        <span className="relative z-10">NOUVELLE SESSION (RESET LOCAL)</span>
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 skew-x-12"></div>
                    </button>
                </div>
            )}

            {/* --- VIEW 2: AUTH FORMS --- */}
            {view === 'cloud-auth' && (
                <CloudAuthPanel 
                    onBack={handleBackToMain}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    isLoading={!!loadingOperation}
                    statusMsg={statusMsg}
                    initialUser={cloudUserId}
                    playSfx={playSfx}
                />
            )}

            {/* --- VIEW 3: SLOTS DASHBOARD --- */}
            {view === 'cloud-slots' && (
                <CloudSlotsPanel 
                    username={cloudUserId}
                    slots={slots}
                    loadingOperation={loadingOperation}
                    onSlotAction={handleSlotAction}
                    onLogout={handleLogout}
                    onBack={handleBackToMain}
                    onRefresh={() => fetchSlots(cloudUserId, cloudPassword)}
                    formatNumber={memoizedFormatNumber}
                />
            )}
        </Menu3DContainer>
    );
};

export default MainMenu;
