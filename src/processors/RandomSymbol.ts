import { Sym } from "../config";

const symbols = [
    Sym.HIGH1,
    Sym.HIGH2,
    Sym.HIGH3,
    Sym.LOW1,
    Sym.LOW2,
    Sym.LOW3,
    Sym.LOW4
];

export const getRandomSymbol = function(): Sym { 
    return symbols[Math.floor(Math.random() * symbols.length)]
}