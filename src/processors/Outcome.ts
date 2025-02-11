import { REEL_SIZE, REELS_COUNT, Sym, symbols } from '../config';

export type SpinOutcome = Sym[][]

export class Outcome {
    constructor() {}

    static resolve(): SpinOutcome {
        const columns = REELS_COUNT;
        const rows = REEL_SIZE;
        const outcome: SpinOutcome = [];

        for (let i = 0; i < columns; i++) {
            const column = [];
            for (let j = 0; j < rows; j++) {
                column.push(symbols[Math.floor(Math.random() * symbols.length)]);
            }
            outcome.push(column);
        }
        return outcome;
    }
}
