
export type QuantumPathType = 'RATE' | 'MULTIPLIER' | 'BALANCED';

export interface PathUpgrade {
    level: number;
    description: string;
    cost: number; // Cost in Quantum Shards
    effects: {
        rate?: number;
        multiplier?: number;
    };
}

export interface QuantumPath {
    name: string;
    description: string;
    upgrades: PathUpgrade[];
}

export interface CoreUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    effect: {
        type: 'CORE_CHARGE_RATE' | 'CORE_BOOST_MULTIPLIER' | 'CORE_BOOST_DURATION';
        value: number;
    };
    required: string[];
    position: {
        angle: number;
        radius: number;
    };
}
