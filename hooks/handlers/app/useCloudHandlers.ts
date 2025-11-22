
import React from 'react';
import { Settings, Notification, Achievement, GameState, SaveSlotMetadata } from '../../../types';
import { useGameState } from '../../useGameState';
import { usePopupManager } from '../../usePopupManager';
import { getEncodedSaveData, importEncodedSaveData, saveToStorage } from '../../../utils/storage';
import { getInitialState } from '../../../utils/helpers';

// --- SYSTEME MOCK (FALLBACK HORS-LIGNE) ---
const getMockDb = () => {
    try {
        return JSON.parse(localStorage.getItem('QUANTUM_MOCK_CLOUD') || '{}');
    } catch { return {}; }
};
const saveMockDb = (db: any) => {
    localStorage.setItem('QUANTUM_MOCK_CLOUD', JSON.stringify(db));
};

type CloudHandlersProps = {
    actions: ReturnType<typeof useGameState>['actions'];
    popups: ReturnType<typeof usePopupManager>;
    playSfx: (sound: 'click' | 'buy' | 'ui_hover') => void;
    addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    setAppState: React.Dispatch<React.SetStateAction<'loading' | 'menu' | 'game' | 'cinematic'>>;
    setCloudStatus: React.Dispatch<React.SetStateAction<'none' | 'connected' | 'offline'>>;
};

export const useCloudHandlers = ({
    actions,
    popups,
    playSfx,
    addMessage,
    setAppState,
    setCloudStatus
}: CloudHandlersProps) => {

    const performCloudRequest = async (url: string, payload: any) => {
        // Définition de la logique de repli (Mock) en cas d'échec réseau
        const executeMockFallback = async (reason: string) => {
            console.warn(`Cloud Request Failed (${reason}). Switching to OFFLINE MOCK MODE.`);
            setCloudStatus('offline');
            
            // Simulation de latence réseau
            await new Promise(resolve => setTimeout(resolve, 600));

            // MOCK TIME pour l'action getTime en hors-ligne
            if (payload.action === 'getTime') {
                return { status: 'success', message: new Date().toISOString() };
            }

            const db = getMockDb();
            const action = payload.action;
            const userId = payload.userId;
            const slotId = payload.slotId;
            const fullId = `${userId}_${slotId}`;

            if (action === 'register') {
                if (db[userId]) return { status: 'error', message: 'ID déjà pris (Mode Hors-ligne)' };
                db[userId] = { password: payload.password };
                saveMockDb(db);
                return { status: 'success', message: 'Compte local créé (Hors-ligne)' };
            }

            if (action === 'login') {
                const user = db[userId];
                if (!user || user.password !== payload.password) return { status: 'error', message: 'Identifiants invalides (Mode Hors-ligne)' };
                return { status: 'success', message: 'Connexion locale réussie' };
            }

            if (action === 'save') {
                const user = db[userId];
                // Vérification basique type serveur
                if (!user || user.password !== payload.password) return { status: 'error', message: 'Auth échouée (Local)' };
                
                db[fullId] = {
                    data: payload.saveData,
                    timestamp: new Date().toISOString(),
                    password: payload.password
                };
                saveMockDb(db);
                return { status: 'success', message: 'Sauvegarde locale effectuée' };
            }

            if (action === 'load') {
                const slotData = db[fullId];
                if (!slotData) return { status: 'empty' };
                
                // Vérification mot de passe du slot (optionnel dans le mock mais gardons la logique)
                if (slotData.password && slotData.password !== payload.password) {
                     return { status: 'error', message: 'Mot de passe slot invalide' };
                }

                return {
                    status: 'found',
                    data: slotData.data,
                    lastSaveTime: slotData.timestamp
                };
            }

            return { status: 'error', message: 'Action inconnue' };
        };

        try {
            const isWrite = payload.action === 'register' || payload.action === 'save';
            let response;
            
            if (isWrite) {
                response = await fetch(url, {
                    method: 'POST',
                    redirect: "follow",
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
                    body: JSON.stringify(payload)
                });
            } else {
                const params = new URLSearchParams(payload as any).toString();
                response = await fetch(`${url}?${params}`);
            }

            // Si la réponse n'est pas OK ou ne contient pas de JSON valide, le catch prendra le relais
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const json = await response.json();
            setCloudStatus('connected');
            return json;

        } catch (error: any) {
            // Déclenchement du mode secours
            return executeMockFallback(error.message || "Network Error");
        }
    };

    // Fonction utilitaire pour récupérer l'heure serveur
    const checkServerTime = async (apiUrl: string): Promise<string | null> => {
        const cleanUrl = apiUrl.replace(/\s/g, '');
        if (!cleanUrl) return null;
        try {
            const res = await performCloudRequest(cleanUrl, { action: 'getTime' });
            if (res.status === 'success') {
                return res.message; // Returns ISO string
            }
        } catch (e) {
            console.error("Time check failed", e);
        }
        return null;
    };

    // Inscription
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
                const msg = res.message.includes('Hors-ligne') 
                    ? "Compte local (simulé) créé !" 
                    : "Compte Cloud créé avec succès !";
                addMessage(msg, 'info');
                return true;
            } else {
                addMessage(`Erreur : ${res.message}`, 'error');
                return false;
            }
        } catch (e) {
            addMessage("Erreur critique lors de l'inscription.", 'error');
            return false;
        }
    };

    // Connexion
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
                // Modification demandée : Suppression du message de succès
                // addMessage("Connexion réussie.", 'info'); 
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
                addMessage(`Erreur: ${res.message}`, 'error');
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
                        // FIX: use data.lastSaveTime (from server response) instead of parsed.lastSaveTime (which is undefined in game state)
                        timestamp: data.lastSaveTime ? new Date(data.lastSaveTime).getTime() : Date.now() 
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

                // Ré-encodage pour l'import helper
                const reEncoded = btoa(encodeURIComponent(JSON.stringify(parsed)));
                
                const newState = importEncodedSaveData(reEncoded);
                if (newState) {
                    playSfx('buy');
                    addMessage(`Slot ${slotId} chargé !`, 'info');
                    
                    actions.loadSave(newState);

                    // DETECTION INTELLIGENTE :
                    // Si c'est une sauvegarde vierge (début du jeu), on lance l'intro + tuto.
                    // Sinon, on lance le jeu directement.
                    if (newState.totalClicks === 0 && newState.energy === 0 && newState.ascensionLevel === 0) {
                        popups.setTutorialStep(1);
                        setAppState('cinematic');
                    } else {
                        setAppState('game');
                    }
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
            // 2. Sauvegarde LOCALE immédiate (Cache)
            saveToStorage(initialState, settingsToSave);

            // 3. Chargement dans le jeu (Transition sans reload)
            actions.loadSave(initialState);
            
            // 4. ACTIVATION DU TUTO ET LANCEMENT CINEMATIQUE
            popups.setTutorialStep(1);
            setAppState('cinematic'); 

            // 5. Encodage pour envoi Cloud
            const encoded = getEncodedSaveData(initialState, settingsToSave) || "";
            if (!encoded) {
                addMessage("Erreur critique: Données corrompues.", 'error');
                return false;
            }

            // 6. Envoi CLOUD en tâche de fond
            performCloudRequest(cleanUrl, {
                action: 'save',
                userId: cleanUser,
                password: cleanPass,
                slotId: slotId,
                saveData: encoded
            }).then(res => {
                if (res.status === 'success') {
                    const msg = res.message.includes('locale')
                        ? `Slot ${slotId} initialisé (Localement) !`
                        : `Slot ${slotId} initialisé dans le Cloud !`;
                    addMessage(msg, 'info');
                } else {
                    console.error("Cloud Error:", res);
                    addMessage(`Cloud Échec: ${res.message}. Partie locale active.`, 'error');
                }
            }).catch(cloudError => {
                console.error("Cloud Network Error:", cloudError);
                addMessage("Mode Hors-ligne activé.", 'error');
            });

            return true; 
            
        } catch (e) {
            console.error(e);
            addMessage("Erreur critique lors de l'initialisation locale.", 'error');
            return false;
        }
    };

    return {
        onCloudSave,
        onCloudLoad,
        registerCloudAccount,
        loginCloudAccount,
        checkCloudSlots,
        loadCloudSlot,
        saveNewGameToSlot,
        checkServerTime
    };
};
