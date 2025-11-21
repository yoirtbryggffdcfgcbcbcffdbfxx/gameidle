
import React from 'react';
import { Settings, Notification, Achievement, GameState, SaveSlotMetadata } from '../../types';
import { useGameState } from '../useGameState';
import { usePopupManager } from '../usePopupManager';
import { ACHIEVEMENT_IDS } from '../../constants/achievements';
import { getEncodedSaveData, importEncodedSaveData, saveToStorage } from '../../utils/storage';
import { getInitialState } from '../../utils/helpers';

type AppHandlersProps = {
    hasSaveData: boolean;
    actions: ReturnType<typeof useGameState>['actions'];
    popups: ReturnType<typeof usePopupManager>;
    playSfx: (sound: 'click' | 'buy' | 'ui_hover') => void;
    addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    setAppState: React.Dispatch<React.SetStateAction<'loading' | 'menu' | 'game' | 'cinematic'>>;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    unlockAudio: () => void;
};

export const useAppHandlers = ({
    hasSaveData,
    actions,
    popups,
    playSfx,
    addMessage,
    setAppState,
    setSettings,
    unlockAudio,
}: AppHandlersProps) => {
    
    const startNewGame = () => {
        actions.resetGame(true);
        // Re-apply theme in case it was changed in a previous session
        setSettings(s => ({...s, theme: s.theme})); 
        popups.setTutorialStep(1);
        setAppState('game');
    };

    const handleContinue = () => {
        playSfx('click');
        unlockAudio();
        setAppState('game');
    };

    const handleNewGameClick = () => {
        playSfx('click');
        unlockAudio();
        if (hasSaveData) {
            popups.setShowNewGameConfirm(true);
        } else {
            setAppState('cinematic');
        }
    };
    
    const handleStartGameAfterCinematic = () => {
        startNewGame();
    };
    
    const handleCreditsClick = () => {
        playSfx('ui_hover');
        popups.setActivePopup('credits');
        actions.unlockAchievement(ACHIEVEMENT_IDS.CURIOUS);
    };

    const handleConfirmNewGame = () => {
        playSfx('click');
        popups.setShowNewGameConfirm(false);
        setAppState('cinematic');
    };

    const onConfirmHardReset = () => {
        playSfx('click');
        actions.resetGame(true);
        popups.setShowHardResetConfirm(false);
        addMessage("Jeu réinitialisé.", 'info');
        setAppState('menu'); // Go back to menu after reset
    };

    // --- EXPORT / IMPORT MANUEL ---

    const onExportSave = (gameState: GameState, settings: Settings) => {
        const encoded = getEncodedSaveData(gameState, settings);
        if (encoded) {
            navigator.clipboard.writeText(encoded).then(() => {
                playSfx('buy');
                addMessage("Sauvegarde copiée dans le presse-papier !", 'info', { title: 'Export Réussi' });
            }).catch(() => {
                addMessage("Erreur lors de la copie. Vérifiez les permissions.", 'error');
            });
        } else {
            addMessage("Erreur lors de la génération de la sauvegarde.", 'error');
        }
    };

    const onImportSave = () => {
        const input = window.prompt("Collez votre code de sauvegarde ici :");
        if (input) {
            const success = importEncodedSaveData(input);
            if (success) {
                playSfx('buy');
                window.location.reload();
            } else {
                playSfx('click');
                addMessage("Code de sauvegarde invalide ou corrompu.", 'error');
            }
        }
    };

    // --- CLOUD SAVE (GOOGLE SHEETS) ---

    const performCloudRequest = async (url: string, payload: any) => {
        console.log("Cloud Request:", url, payload.action); // Debug log
        try {
            const isWrite = payload.action === 'register' || payload.action === 'save';
            
            if (isWrite) {
                const response = await fetch(url, {
                    method: 'POST',
                    redirect: "follow", // Important pour suivre les redirections de Google Apps Script
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
                    body: JSON.stringify(payload)
                });
                
                // Gestion sécurisée du JSON au cas où le serveur renvoie une erreur HTML ou opaque
                try {
                    const json = await response.json();
                    return json;
                } catch (jsonError) {
                    console.warn("Réponse non-JSON du serveur (CORS ou erreur HTML)", jsonError);
                    return { status: 'unknown', message: 'Réponse serveur invalide (JSON error)' };
                }
            } else {
                // GET pour le load / check
                const params = new URLSearchParams(payload as any).toString();
                const fetchUrl = `${url}?${params}`;
                
                const response = await fetch(fetchUrl);
                const json = await response.json();
                return json;
            }
        } catch (error: any) {
            console.error("Cloud Request Error", error);
            return { status: 'error', message: error.message || 'Erreur réseau' };
        }
    };

    // NOUVEAU : Inscription
    const registerCloudAccount = async (userId: string, pass: string, apiUrl: string) => {
        const cleanUrl = apiUrl.replace(/\s/g, '');
        const cleanUser = userId.trim();
        const cleanPass = pass.trim();

        if (!cleanUrl || !cleanUser || !cleanPass) return false;

        try {
            const res = await performCloudRequest(cleanUrl, {
                action: 'register',
                userId: cleanUser,
                password: cleanPass
            });

            if (res.status === 'success') {
                playSfx('buy');
                addMessage("Compte créé avec succès !", 'info');
                return true;
            } else {
                addMessage(`Erreur : ${res.message}`, 'error');
                return false;
            }
        } catch (e) {
            addMessage("Erreur de connexion au serveur.", 'error');
            return false;
        }
    };

    // NOUVEAU : Connexion
    const loginCloudAccount = async (userId: string, pass: string, apiUrl: string) => {
        const cleanUrl = apiUrl.replace(/\s/g, '');
        const cleanUser = userId.trim();
        const cleanPass = pass.trim();

        if (!cleanUrl || !cleanUser || !cleanPass) return false;

        try {
            const res = await performCloudRequest(cleanUrl, {
                action: 'login',
                userId: cleanUser,
                password: cleanPass
            });

            if (res.status === 'success') {
                playSfx('buy');
                addMessage("Connexion réussie !", 'info');
                return true;
            } else {
                addMessage(`Erreur : ${res.message}`, 'error');
                return false;
            }
        } catch (e) {
            addMessage("Erreur de connexion.", 'error');
            return false;
        }
    };

    const onCloudSave = async (gameState: GameState, settings: Settings) => {
        // Sauvegarde sur le slot 1 par défaut via le menu settings (legacy support)
        const cleanUrl = settings.cloudApiUrl.replace(/\s/g, '');
        
        let userId = settings.cloudUserId;
        let slotId = 1;
        
        if (userId.includes('_')) {
            const parts = userId.split('_');
            userId = parts[0];
            slotId = parseInt(parts[1]);
        }
        userId = userId.trim();

        const cleanPass = settings.cloudPassword ? settings.cloudPassword.trim() : '';

        if (!cleanUrl || !userId) {
            addMessage("Non connecté.", 'error');
            return false;
        }

        const encodedSave = getEncodedSaveData(gameState, settings);
        
        try {
            const res = await performCloudRequest(cleanUrl, {
                action: 'save',
                userId: userId,
                password: cleanPass,
                slotId: slotId,
                saveData: encodedSave
            });
            
            if (res.status === 'success' || res.status === 'sent_blindly') {
                playSfx('buy');
                addMessage(`Sauvegarde Slot ${slotId} réussie !`, 'info', { title: 'Cloud Sync' });
                return true;
            } else {
                addMessage(`Erreur serveur: ${res.message}`, 'error');
                return false;
            }
        } catch (error) {
            addMessage("Échec de l'envoi.", 'error');
            return false;
        }
    };

    const onCloudLoad = async (settings: Settings) => {
        // Legacy load function from settings panel
        return false; // Deprecated in favor of Slot Menu
    };

    // --- MULTI-SLOT LOGIC FOR MENU ---

    const checkCloudSlots = async (userId: string, password: string, apiUrl: string): Promise<SaveSlotMetadata[]> => {
        const cleanUser = userId.trim();
        const cleanPass = password.trim();
        if (!apiUrl || !cleanUser) return [];
        const cleanUrl = apiUrl.replace(/\s/g, '');

        const promises = [1, 2, 3].map(async (i) => {
            try {
                const data = await performCloudRequest(cleanUrl, {
                    action: 'load',
                    userId: cleanUser,
                    password: cleanPass,
                    slotId: i
                });
                
                if (data.status === "found" && data.data) {
                    let jsonString;
                    try {
                        jsonString = decodeURIComponent(atob(data.data));
                    } catch (e) {
                        jsonString = atob(data.data);
                    }
                    const parsed = JSON.parse(jsonString);
                    
                    return {
                        slotId: i,
                        isEmpty: false,
                        energy: parsed.energy,
                        ascensionLevel: parsed.ascensionLevel,
                        timestamp: parsed.lastSaveTime || Date.now() 
                    } as SaveSlotMetadata;
                }
            } catch (e) {
                console.warn(`Failed to fetch slot ${i}`, e);
            }
            return { slotId: i, isEmpty: true } as SaveSlotMetadata;
        });

        const results = await Promise.all(promises);
        return results.sort((a, b) => a.slotId - b.slotId);
    };

    const loadCloudSlot = async (userId: string, password: string, slotId: number, apiUrl: string) => {
        const cleanUrl = apiUrl.replace(/\s/g, '');
        const cleanUser = userId.trim();
        const cleanPass = password.trim();

        try {
            const data = await performCloudRequest(cleanUrl, {
                action: 'load',
                userId: cleanUser,
                password: cleanPass,
                slotId: slotId
            });

            if (data.status === "found" && data.data) {
                const fullId = `${cleanUser}_${slotId}`;
                
                let jsonString;
                try { jsonString = decodeURIComponent(atob(data.data)); } catch (e) { jsonString = atob(data.data); }
                const parsed = JSON.parse(jsonString);
                
                if (!parsed.settings) parsed.settings = {};
                parsed.settings.cloudUserId = fullId;
                parsed.settings.cloudPassword = cleanPass;
                parsed.settings.cloudApiUrl = apiUrl;

                const reEncoded = btoa(encodeURIComponent(JSON.stringify(parsed)));
                
                const success = importEncodedSaveData(reEncoded);
                if (success) {
                    playSfx('buy');
                    addMessage(`Slot ${slotId} chargé !`, 'info');
                    // Petite pause pour laisser l'utilisateur voir le message
                    setTimeout(() => window.location.reload(), 500);
                }
            } else {
                addMessage("Impossible de charger le slot (vide ou erreur).", 'error');
            }
        } catch (e) {
            addMessage("Erreur de chargement.", 'error');
        }
    };

    const saveNewGameToSlot = async (userId: string, password: string, slotId: number, apiUrl: string): Promise<boolean> => {
        const cleanUrl = apiUrl.replace(/\s/g, '');
        const cleanUser = userId.trim();
        const cleanPass = password.trim();
        
        if (!cleanUser || !cleanPass) {
            addMessage("Identifiants invalides pour la création.", 'error');
            // On retourne false ici car sans identifiants, on ne peut rien faire de sensé même en local (pas de cloudUserId)
            return false;
        }

        // 1. Création de l'état initial
        const initialState = getInitialState();
        const fullId = `${cleanUser}_${slotId}`;
        
        const settingsToSave: Settings = { 
            visualEffects: true, showFloatingText: true, animSpeed: 1, scientificNotation: false, theme: 'dark', sfxVolume: 0.5, confirmAscension: true,
            cloudApiUrl: apiUrl, 
            cloudUserId: fullId, 
            cloudPassword: cleanPass
        };

        try {
            // 2. Sauvegarde LOCALE immédiate (Fallback de sécurité)
            // Si le cloud échoue, le joueur peut quand même jouer, mais il saura que la sync a échoué.
            saveToStorage(initialState, settingsToSave);

            // 3. Encodage
            const encoded = getEncodedSaveData(initialState, settingsToSave) || "";
            if (!encoded) {
                addMessage("Erreur critique: Données corrompues.", 'error');
                return false;
            }

            // 4. Envoi CLOUD (Tentative)
            try {
                const res = await performCloudRequest(cleanUrl, {
                    action: 'save',
                    userId: cleanUser,
                    password: cleanPass,
                    slotId: slotId,
                    saveData: encoded
                });
                
                if (res.status === 'success') {
                    playSfx('buy');
                    addMessage(`Slot ${slotId} initialisé dans le Cloud !`, 'info');
                } else {
                    console.error("Cloud Error:", res);
                    addMessage(`Cloud Échec: ${res.message}. Mode Hors-ligne activé.`, 'error');
                }
            } catch (cloudError) {
                console.error("Cloud Network Error:", cloudError);
                addMessage("Erreur Réseau Cloud. Mode Hors-ligne activé.", 'error');
            }

            // 5. Succès Global : On a une sauvegarde locale valide, donc on peut lancer le jeu.
            // On retourne true pour que MainMenu déclenche le rechargement de la page.
            return true; 
            
        } catch (e) {
            console.error(e);
            addMessage("Erreur critique lors de l'initialisation locale.", 'error');
            return false;
        }
    };

    return {
        handleContinue,
        handleNewGameClick,
        handleConfirmNewGame,
        handleCreditsClick,
        handleStartGameAfterCinematic,
        onConfirmHardReset,
        onExportSave,
        onImportSave,
        onCloudSave,
        onCloudLoad,
        registerCloudAccount,
        loginCloudAccount,
        checkCloudSlots,
        loadCloudSlot,
        saveNewGameToSlot
    };
};
