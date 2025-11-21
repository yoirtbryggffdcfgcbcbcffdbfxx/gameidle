
import { GameState } from '../../types';

export const processCoreSystem = (currentState: GameState) => {
    let isCoreDischarging = currentState.isCoreDischarging;
    let coreDischargeEndTimestamp = currentState.coreDischargeEndTimestamp;

    if (isCoreDischarging && coreDischargeEndTimestamp && Date.now() >= coreDischargeEndTimestamp) {
        isCoreDischarging = false;
        coreDischargeEndTimestamp = null;
    }

    return { isCoreDischarging, coreDischargeEndTimestamp };
};
