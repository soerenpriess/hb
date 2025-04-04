// opponentAiGlobal.ts
import OpponentAi from './opponentAi';

let opponentAiGlobal: OpponentAi | null = null;

export function setOpponentAiInstance(instance: OpponentAi) {
    opponentAiGlobal = instance;
    console.log('Opponent AI instance set:', opponentAiGlobal);
}

export function getOpponentAiInstance(): OpponentAi | null {
    console.log('Getting Opponent AI instance:', opponentAiGlobal);
    return opponentAiGlobal;
}
