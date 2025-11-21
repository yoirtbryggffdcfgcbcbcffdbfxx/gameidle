
export const SAVE_KEY = 'quantum-core-idle-save';
export const TICK_RATE = 100; // ms per tick for production
export const CLICK_POWER = 1;
export const MAX_UPGRADE_LEVEL = 100;
export const CORE_CHARGE_RATE = 0.555; // charge per second (100 charge / 180 seconds = ~0.555/s)
export const CORE_DISCHARGE_DURATION = 10000; // 10 seconds in ms

// REBALANCING V2: "Triple to Triumph"
// x3 multiplier ensures production keeps up with the steeper 1.15 cost curve.
export const TIER_PRODUCTION_MULTIPLIER = 3; 
// REBALANCING V5: "Exponential Boost"
// x2 multiplier per tier for Boosters ensures they remain relevant against huge ascension bonuses.
export const TIER_BOOSTER_MULTIPLIER = 2; 

export const PARTICLE_COLORS = {
    CLICK: '#ffffff',
    BUY: '#ffdd00',
    ASCEND: '#cc00ff',
};