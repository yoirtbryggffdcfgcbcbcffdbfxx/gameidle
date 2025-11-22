
import React, { useState, useEffect } from 'react';
import { SaveSlotMetadata } from '../types';
import { useGameContext } from '../contexts/GameContext';
import GlobeIcon from './ui/GlobeIcon';
import ConfirmationPopup from './popups/ConfirmationPopup';
import CreditsPopup from './popups/CreditsPopup';

// Nouveaux composants refactorisés
import Menu3DContainer from './menu/Menu3DContainer';
import CloudAuthPanel from './menu/CloudAuthPanel';
import CloudSlotsPanel from './menu/CloudSlotsPanel';
import CloudStatusIndicator from './menu/CloudStatusIndicator';

interface MainMenuProps {
    hasSaveData: boolean;
    onContinue: () => void;
    onNewGame: () => void;
    onCreditsClick: () => void;
    playSfx: (sound: 'ui_hover' | 'click' | 'buy') => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ hasSaveData, onContinue, onNewGame, onCreditsClick, playSfx }) => {
    const { uiState, handlers, memoizedFormatNumber, popups } = useGameContext();
    
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

    // Détermine si l'utilisateur est configuré pour le Cloud
    const isCloudConfigured = !!(uiState.settings.cloudUserId && uiState.settings.cloudPassword);
    
    // On n'affiche "Reprendre Local" que si on a une sauvegarde ET qu'on n'est PAS en mode Cloud.
    // Si on est en mode Cloud, on force l'utilisateur à passer par le bouton Uplink (qui fera l'auto-login).
    const showLocalContinue = hasSaveData && !isCloudConfigured;

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
        
        try {
            if (slot.isEmpty) {
                // Initialisation d'une nouvelle partie sur le slot
                setLoadingOperation(`INITIALISATION SECTEUR ${slot.slotId}...`);
                const success = await handlers.saveNewGameToSlot(cloudUserId, cloudPassword, slot.slotId, apiUrl);
                
                if (!success) {
                    // Si échec, on retire le loader pour rendre la main à l'utilisateur.
                    // Si succès, handlers.saveNewGameToSlot a déjà changé l'appState vers 'game', 
                    // ce composant va donc démonter, pas besoin de setLoadingOperation(null).
                    setLoadingOperation(null);
                }
            } else {
                // Chargement d'une partie existante
                setLoadingOperation(`TÉLÉCHARGEMENT SECTEUR ${slot.slotId}...`);
                await handlers.loadCloudSlot(cloudUserId, cloudPassword, slot.slotId, apiUrl);
                
                // Même logique : si loadCloudSlot réussit, l'état global change et on quitte le menu.
                // Si ça échoue (géré en interne par des Toasts d'erreur), on rend la main.
                setLoadingOperation(null); 
            }
        } catch (e) {
            console.error("Slot Action Failed", e);
            setLoadingOperation(null);
        }
    };

    const handleLogout = () => {
        setSlots([]);
        setCloudPassword('');
        setView('cloud-auth');
        playSfx('click');
    };

    return (
        <>
            <CloudStatusIndicator />
            <Menu3DContainer 
                onCreditsClick={onCreditsClick} 
                playSfx={playSfx} 
                apiUrl={apiUrl}
            >
                {/* --- VIEW 1: MAIN BUTTONS --- */}
                {view === 'main' && (
                    <div className="space-y-3 md:space-y-4 w-full max-w-xs flex flex-col animate-fade-in m-auto">
                        {showLocalContinue && (
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
                                {isCloudConfigured ? "REPRENDRE (CLOUD)" : "QUANTUM UPLINK"}
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

            {/* POPUPS DU MENU */}
            <ConfirmationPopup
                show={popups.showNewGameConfirm}
                title={isCloudConfigured ? "Réinitialisation Locale ?" : "Commencer une nouvelle partie ?"}
                message={isCloudConfigured 
                    ? "Attention : Cela effacera uniquement les données LOCALES sur cet appareil. Vos sauvegardes Cloud (Uplink) sont en sécurité et ne seront PAS touchées."
                    : "Votre progression locale actuelle sera définitivement effacée. Êtes-vous sûr de vouloir recommencer à zéro ?"
                }
                onConfirm={handlers.handleConfirmNewGame}
                onCancel={() => {
                    playSfx('click');
                    popups.setShowNewGameConfirm(false);
                }}
            />
            {uiState.activePopup === 'credits' && (
                <CreditsPopup onClose={() => popups.setActivePopup(null)} />
            )}
        </>
    );
};

export default MainMenu;
