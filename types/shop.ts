
export interface ShopUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    currency: 'energy' | 'quantumShards';
    icon: string;
}
