
export interface ResourceState {
    energy: number;
    totalGenerated: number;
}

export const initialResourceState: ResourceState = {
    energy: 0,
    totalGenerated: 0,
};
