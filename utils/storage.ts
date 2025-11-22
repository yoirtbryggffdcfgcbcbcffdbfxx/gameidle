
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

export const importEncodedSaveData = (encodedData: string): GameState | null => {
    try {
        if (!encodedData || typeof encodedData !== 'string') return null;

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
                return null;
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
            
            // On retourne les données nettoyées (sans la clé settings qui est racine dans le json d'export)
            // Mais attend, loadAndMergeState s'attend à ce que localStorage contienne { ...state, settings }
            // Donc data contient probablement { energy: ..., settings: ... }
            // Si on retourne data tel quel, TypeScript risque de râler si on l'assigne à GameState
            // Mais en JS/TS lâche, data est un 'any' ou compatible.
            // Pour être propre, on devrait retourner data sans les settings, mais GameState contient pas settings
            // Donc c'est bon.
            
            return data as GameState;
        } else {
            console.error("Import validation failed: Missing critical properties.", { hasEnergy, hasUpgrades, hasAchievements });
            return null;
        }
    } catch (e) {
        console.error("Import failed (JSON Parse or Decode error)", e);
        return null;
    }
};
