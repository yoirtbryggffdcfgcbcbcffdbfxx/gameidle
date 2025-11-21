
export interface AscensionUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    effect: {
        type: 'PRODUCTION_MULTIPLIER' | 'CLICK_POWER_MULTIPLIER' | 'COST_REDUCTION' | 'STARTING_ENERGY';
        value: number;
    };
    required: string[];
    position: {
        angle: number;
        radius: number;
    };
}
