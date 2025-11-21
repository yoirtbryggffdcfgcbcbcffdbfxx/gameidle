
import { Achievement } from './player';

export interface Particle {
    id: number;
    startX: number;
    startY: number;
    color: string;
}

export interface FloatingText {
    id: number;
    text: string;
    x: number;
    y: number;
    color: string;
}

export interface Notification {
    id: string;
    timestamp: number;
    read: boolean;
    message: string;
    type: 'achievement' | 'error' | 'info' | 'system';
    title?: string;
    achievement?: Achievement;
}

export interface SaveSlotMetadata {
    slotId: number;
    isEmpty: boolean;
    timestamp?: number;
    energy?: number;
    ascensionLevel?: number;
    previewText?: string;
}
