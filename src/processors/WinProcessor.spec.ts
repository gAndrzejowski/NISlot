import { Sym } from '../config'
import { payoutStructure } from '../payoutStructure'
import { WinProcessor } from './WinProcessor'

const NOWIN = [
    [Sym.LOW1, Sym.LOW3, Sym.HIGH2],
    [Sym.LOW1, Sym.HIGH3, Sym.LOW2],
    [Sym.HIGH1, Sym.HIGH1, Sym.HIGH1],
    [Sym.HIGH1, Sym.HIGH1, Sym.HIGH1],
    [Sym.HIGH1, Sym.HIGH1, Sym.HIGH1],
]


const SINGLEWIN = [
    [Sym.LOW1, Sym.LOW3, Sym.HIGH2],
    [Sym.HIGH1, Sym.HIGH3, Sym.LOW1],
    [Sym.LOW1, Sym.HIGH1, Sym.HIGH1],
    [Sym.LOW1, Sym.HIGH1, Sym.HIGH1],
    [Sym.HIGH1, Sym.HIGH1, Sym.HIGH1],
]

const MULTIWIN = [
    [Sym.LOW1, Sym.LOW3, Sym.HIGH2],
    [Sym.HIGH1, Sym.HIGH2, Sym.LOW1],
    [Sym.LOW1, Sym.HIGH2, Sym.HIGH1],
    [Sym.LOW1, Sym.LOW1, Sym.HIGH1],
    [Sym.LOW1, Sym.HIGH1, Sym.HIGH1],
]

describe('WinProcessor', () => {

    it('winning combinations are an empty set when there are no wins', () => {
        const noWinProcessor = new WinProcessor(NOWIN);
        expect(noWinProcessor.winningCombinations.size).toBe(0);
    })

    it('has a single correct member when there is a single win', () => {
        const singleWinProcessor = new WinProcessor(SINGLEWIN);
        expect(singleWinProcessor.winningCombinations).toEqual(new Set(['0200']))
    })

    it('has proper members with multiple wins', () => {
        const multiWinProcessor = new WinProcessor(MULTIWIN);
        expect(multiWinProcessor.winningCombinations).toEqual(new Set(['02000', '02010', '211']))
    })

    it('calculates total win of 0 when there is no win', () => {
        const noWinProcessor = new WinProcessor(NOWIN);
        expect(noWinProcessor.winTotal).toBe(0);
    })

    it('correctly calculates value of single win', () => {
        const singleWinProcessor = new WinProcessor(SINGLEWIN);
        expect(singleWinProcessor.winTotal).toBe(payoutStructure.low1[4]);
    })

    it('correctly calculates value of multiple wins', () => {
        const multiWinProcessor = new WinProcessor(MULTIWIN);
        expect(multiWinProcessor.winTotal).toBe(
            payoutStructure.low1[5] + payoutStructure.low1[5] + payoutStructure.high2[3]
        )
    })

})
