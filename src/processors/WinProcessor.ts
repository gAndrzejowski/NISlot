import { MIN_WINNING_COMBINATION_LENGTH, REELS_COUNT, Sym } from '../config';
import { SpinOutcome } from './Outcome';
import { payoutStructure } from '../payoutStructure';

export class WinProcessor {

    constructor(outcome: SpinOutcome) {
        this.outcome = outcome;
        this._winningCombinations = null;
        this._winTotal = null;
    }

    private outcome: SpinOutcome;
    private _winningCombinations: Set<string> | null
    private _winTotal: number | null;

    private processWinningCombinations() {
        this._winningCombinations = new Set<string>();
        const rootNode = new CombinationNode({
            outcome: this.outcome,
            combinations: this._winningCombinations
        });
        rootNode.process();
        this._winningCombinations = new Set([...this._winningCombinations].filter(
            com => com.length >= MIN_WINNING_COMBINATION_LENGTH)
        );
        return this._winningCombinations;
    }

    private processWinTotal() {
        const combinations = this.winningCombinations;
        this._winTotal = [...combinations].reduce((runningTotal, nextCombination) => {
            const sym = this.outcome[0][nextCombination[0]];
            return runningTotal + payoutStructure[sym][nextCombination.length];
        }, 0);
        return this._winTotal;
    }

    public get winningCombinations() {
        return this._winningCombinations ?? this.processWinningCombinations();
    }

    public get winTotal() {
        return this._winTotal ?? this.processWinTotal();
    }

}

/* This is Node of the tree structure used to calculate winning paths */
class CombinationNode {

    constructor({ outcome, combinations, parent = null, symbol = null, index = null, depth = 0 }) {
        this._outcome = outcome;
        this._combinations = combinations;
        this._parent = parent;
        this._symbol = symbol;
        this._index = index;
        this._depth = depth;
        this._children = [];
    }

    private _outcome: SpinOutcome;
    private _combinations: Set<string>;
    private _parent: CombinationNode | null;
    private _symbol: Sym | null;
    private _index: number | null;
    private _depth: number;
    private _children: CombinationNode[];

    public get pathString() {
        if (!this._parent) {
            return '';
        }
        return `${this._parent.pathString}${this._index}`;
    }

    private canChildBeAttached(childSymbol: Sym) {
        return !this._symbol || this._symbol === childSymbol;
    }

    public process() {
        // root node has depth 0 and its children are from 0th column and so on
        const childCandidates = this._depth < REELS_COUNT ? this._outcome[this._depth] : [];
        childCandidates.forEach((symbol, index) => {
            if (this.canChildBeAttached(symbol)) this._children.push(new CombinationNode({
                outcome: this._outcome,
                combinations: this._combinations,
                parent: this,
                depth: this._depth + 1,
                symbol,
                index,
            }))
        })
        if (this._children.length === 0) {
            this._combinations.add(this.pathString);
        } else {
            for (const child of this._children) {
                child.process();
            }
        }
    }
}
