
import React from 'react';
import { Settings, Notification, Achievement, GameState } from '../../../types';
import { useGameState } from '../../useGameState';
import { getEncodedSaveData, importEncodedSaveData } from '../../../utils/storage';

type LocalSaveHandlersProps = {
    actions: ReturnType<typeof useGameState>['actions'];
    playSfx: (sound: 'click' | 'buy' | 'ui_hover') => void;
    addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    setAppState: React.Dispatch<React.SetStateAction<'loading' | 'menu' | 'game' | 'cinematic'>>;
};

export const useLocalSaveHandlers = ({
    actions,
    playSfx,
    addMessage,
    setAppState
}: LocalSaveHandlersProps) => {

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
            const newState = importEncodedSaveData(input);
            if (newState) {
                playSfx('buy');
                actions.loadSave(newState);
                setAppState('game');
                addMessage("Sauvegarde chargée avec succès.", 'info');
            } else {
                playSfx('click');
                addMessage("Code de sauvegarde invalide ou corrompu.", 'error');
            }
        }
    };

    return {
        onExportSave,
        onImportSave
    };
};
