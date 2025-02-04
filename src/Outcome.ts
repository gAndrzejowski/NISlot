import { Symbols } from "./Symbols";

export class Outcome {
    constructor() {}

    static resolve(): string[][] {
        const columns = 5;
        const rows = 3;
        const symbols = [
            Symbols.HIGH1,
            Symbols.HIGH2,
            Symbols.HIGH3,
            Symbols.LOW1,
            Symbols.LOW2,
            Symbols.LOW3,
            Symbols.LOW4
        ];

        const outcome: string[][] = [];
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