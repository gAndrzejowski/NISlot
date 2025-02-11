import { Sym, symbols } from '../config';

export const getRandomSymbol = function(): Sym { 
    return symbols[Math.floor(Math.random() * symbols.length)]
}
