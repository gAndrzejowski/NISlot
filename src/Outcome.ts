import { Symbol } from "./config";

export type SpinOutcome = Symbol[][]

export class Outcome {
    constructor() {}

    static resolve(): SpinOutcome {
        const columns = 5;
        const rows = 3;
        const symbols = [
            Symbol.HIGH1,
            Symbol.HIGH2,
            Symbol.HIGH3,
            Symbol.LOW1,
            Symbol.LOW2,
            Symbol.LOW3,
            Symbol.LOW4
        ];

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