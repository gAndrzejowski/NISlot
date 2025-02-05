import { Sym } from "./config";

export type SpinOutcome = Sym[][]

export class Outcome {
    constructor() {}

    static resolve(): SpinOutcome {
        const columns = 5;
        const rows = 3;
        const symbols = [
            Sym.HIGH1,
            Sym.HIGH2,
            Sym.HIGH3,
            Sym.LOW1,
            Sym.LOW2,
            Sym.LOW3,
            Sym.LOW4
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