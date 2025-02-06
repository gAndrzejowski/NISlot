import { MIN_WINNING_COMBINATION_LENGTH, REELS_COUNT, Sym } from "./config";
import { SpinOutcome } from "./Outcome";
import { payoutStructure } from "./payoutStructure";

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
        this._winningCombinations = new Set([...this._winningCombinations].filter(com => com.length >= MIN_WINNING_COMBINATION_LENGTH));
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

    constructor({outcome, combinations, parent = null, symbol = null, index = null, depth = 0}) {
        this.outcome = outcome;
        this.combinations = combinations;
        this.parent = parent;
        this.symbol = symbol;
        this.index = index;
        this.depth = depth;
        this.children = [];
    }

    private outcome: SpinOutcome;
    private combinations: Set<string>;
    private parent: CombinationNode | null;
    private symbol: Sym | null;
    private index: number | null;
    private depth: number;
    private children: CombinationNode[];

    public get pathString() {
        if (!this.parent) {
            return '';
        }
        return `${this.parent.pathString}${this.index}`;
    }

    private canChildBeAttached(childSymbol: Sym) {
        return !this.symbol || this.symbol === childSymbol;
    }

    public process() {
        const childCandidates = this.depth < REELS_COUNT ? this.outcome[this.depth] : []; // root node has depth 0 and its children are from 0th column and so on
        childCandidates.forEach((symbol, index) => {
            if (this.canChildBeAttached(symbol)) this.children.push(new CombinationNode({
                outcome: this.outcome,
                combinations: this.combinations,
                parent: this,
                depth: this.depth + 1,
                symbol,
                index,
            }))
        })
        if (this.children.length === 0) {
            this.combinations.add(this.pathString);
        } else {
            for (const child of this.children) {
                child.process();
            }
        }
    }
}
