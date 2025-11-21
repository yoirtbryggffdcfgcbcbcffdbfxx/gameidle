
import { GameState, Settings, Achievement } from '../types';
import { SAVE_KEY } from '../constants';
import { getInitialState } from './helpers';

// Fonction helper pour charger et fusionner l'état de manière synchrone
export const loadAndMergeState = (): GameState => {
    const initialState = getInitialState();
    try {
        const savedGame = localStorage.getItem(SAVE_KEY);
        if (savedGame) {
            const loadedData = JSON.parse(savedGame);
            
            // Fusion intelligente des données pour gérer les mises à jour de version
            const mergedState: GameState = {
                ...initialState,
                ...loadedData,
                // Assurer que les tableaux et objets critiques sont fusionnés correctement
                purchasedAscensionUpgrades: [...new Set(['start', ...(loadedData.purchasedAscensionUpgrades || [])])],
                purchasedCoreUpgrades: [...new Set(['core_start', ...(loadedData.purchasedCoreUpgrades || [])])],
                achievements: initialState.achievements.map(initialAch => {
                    const savedAch = loadedData.achievements?.find((sa: Achievement) => sa.name === initialAch.name);
                    return { ...initialAch, ...(savedAch || {}) };
                }),
                // Valeurs par défaut pour les nouvelles propriétés si absentes de la sauvegarde
                seenUpgrades: loadedData.seenUpgrades || [],
                viewedCategories: loadedData.viewedCategories || [],
                messageLog: loadedData.messageLog || [],
                
                isShopUnlocked: loadedData.isShopUnlocked || false,
                isCoreUnlocked: loadedData.isCoreUnlocked || false,
                isBankDiscovered: loadedData.isBankDiscovered || false,
                hasUnseenShopItems: loadedData.hasUnseenShopItems || false,
                hasSeenShopCinematic: loadedData.hasSeenShopCinematic || false,
                chosenQuantumPath: loadedData.chosenQuantumPath || null,
                quantumPathLevel: loadedData.quantumPathLevel || 0,
                hasInteractedWithQuantumCore: loadedData.hasInteractedWithQuantumCore || false,
                loanTier: loadedData.loanTier || 0,
                timePlayedInSeconds: loadedData.timePlayedInSeconds || 0,
            };
            return mergedState;
        }
    } catch (error) {
        console.error("Failed to load game state synchronously:", error);
    }
    return initialState;
};

export const saveToStorage = (state: GameState, settings: Settings) => {
    try {
        const stateToSave = { ...state, settings };
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
        console.error("Failed to save game state:", error);
    }
};

export const clearStorage = () => {
    localStorage.removeItem(SAVE_KEY);
};

// --- NOUVELLES FONCTIONS D'EXPORT/IMPORT ---

export const getEncodedSaveData = (state: GameState, settings: Settings): string => {
    try {
        const data = { ...state, settings };
        const jsonString = JSON.stringify(data);
        
        // CORRECTION UNICODE :
        // btoa ne supporte pas nativement les caractères hors Latin1 (comme les accents ou emojis).
        // On utilise encodeURIComponent pour transformer ces caractères en séquences d'échappement ASCII sûres.
        return btoa(encodeURIComponent(jsonString));
    } catch (e) {
        console.error("Export failed", e);
        return "";
    }
};

export const importEncodedSaveData = (encodedData: string): boolean => {
    try {
        if (!encodedData || typeof encodedData !== 'string') return false;

        // TENTATIVE 1 : Décodage Standard (Base64 -> URI -> JSON)
        let jsonString;
        try {
            jsonString = decodeURIComponent(atob(encodedData));
        } catch (e) {
            // TENTATIVE 2 : Si l'encodage URI échoue, peut-être que c'est du Base64 pur (vieux format ou autre source)
            try {
                jsonString = atob(encodedData);
            } catch (e2) {
                console.error("Base64 decode failed:", e2);
                return false;
            }
        }

        const data = JSON.parse(jsonString);
        
        // Vérification robuste de l'intégrité
        // On vérifie les propriétés fondamentales qui doivent absolument exister dans une sauvegarde valide
        const hasEnergy = typeof data.energy === 'number';
        const hasUpgrades = Array.isArray(data.upgrades);
        
        // Note: achievements might be missing in very old saves, so allow slight flexibility but prefer check
        const hasAchievements = Array.isArray(data.achievements);

        if (hasEnergy && hasUpgrades) { // On assouplit légèrement pour la compatibilité ascendante
            // Sauvegarde validée, on l'écrit
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));
            return true;
        } else {
            console.error("Import validation failed: Missing critical properties.", { hasEnergy, hasUpgrades, hasAchievements });
            return false;
        }
    } catch (e) {
        console.error("Import failed (JSON Parse or Decode error)", e);
        return false;
    }
};
