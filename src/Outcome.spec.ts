import { REEL_SIZE, REELS_COUNT } from "./config";
import { Outcome } from "./Outcome";

describe('Outcome generator', () => {
    it('Outcome::resolve generates a 2d array of size REELS_COUNTxREELS_SIZE', () => {
        const outcome = Outcome.resolve();
        expect(outcome.length).toEqual(REELS_COUNT);
        for (let column of outcome) {
            expect(column.length).toEqual(REEL_SIZE);
        }
    })
})