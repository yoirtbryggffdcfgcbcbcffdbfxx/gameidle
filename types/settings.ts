
export type Theme = 'dark' | 'light' | 'matrix' | 'solaris' | 'cyberpunk';

export interface Settings {
    visualEffects: boolean;
    showFloatingText: boolean;
    animSpeed: number;
    scientificNotation: boolean;
    theme: Theme;
    sfxVolume: number;
    confirmAscension: boolean;
    // Cloud DIY Configuration
    cloudApiUrl: string;
    cloudUserId: string;
    cloudPassword?: string; // Nouveau champ optionnel pour le mot de passe
}
