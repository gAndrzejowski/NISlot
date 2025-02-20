import { Container, PointData, Size } from 'pixi.js';

import { SPIN_INTERVAL, Sym } from '../config';
import { getRandomSymbol } from '../processors/RandomSymbol';
import { GameSymbol } from './Symbol';

enum ReelState {
    IDLE = 'idle',
    SPIN_IN_PROGRESS = 'spinInProgress',
    SPIN_RESOLVING = 'spinResolving'
}

export class Reel extends Container {

    constructor(position: PointData, size: Size, trueSymbolsCount: number) {
        super();
        this.position = position;
        this._areaHeight = size.height;
        this._symbolsCount = trueSymbolsCount;
        this._currentSymbols = [];
        this._resolutionStack = [];
        this._spinPhase = 0;
        this._state = ReelState.IDLE;
        this._winAnimationIn = [];
    }

    private _areaHeight: number;
    private _currentSymbols: Array<GameSymbol>;
    private _spinPhase: number;
    private _resolutionStack: Array<Sym>;
    private _resolutionComplete: () => void;
    private _state: ReelState;
    private _winAnimationIn: Array<number>;
    private readonly _symbolsCount: number;

    private get symbolHeight() {
        return this._areaHeight / this._symbolsCount;
    }

    public async beginResolveWith(newSyms: Array<Sym>) {
        this._resolutionStack = newSyms;
        this._state = ReelState.SPIN_RESOLVING;
        return new Promise<void>(resolve => {
            this._resolutionComplete = resolve;
        })
    }

    public beginInfiniteSpin() {
        this._state = ReelState.SPIN_IN_PROGRESS;
        this._spinPhase = 0;
    }

    public startWinAnimationForSymbol(index: number) {
        this._currentSymbols[index].showWin()
        this._winAnimationIn.push(index);
    }

    public clearWinningAnimation() {
        this._currentSymbols.forEach(sym => sym.stopShowWin())
        this._winAnimationIn = [];
    }

    public setSymbols(syms: Array<Sym>) {
        this.removeChildren();
        this._spinPhase = 0;
        syms.forEach((sym, index) => {
            const symbol = new GameSymbol(sym);
            this.positionSymbolInRow(symbol, index);
            this._currentSymbols.push(symbol);
            if (this._winAnimationIn.includes(index)) {
                symbol.showWin();
            }
        });
        this.addSymbolToTop(getRandomSymbol());
    }

    private positionSymbolInRow(sym: GameSymbol, rowIndex: number) { // 0-based, -1 is used to put symbol outside normal area to prepare in spinning phase
        sym.x = 0;
        sym.y = this.symbolHeight * (0.5 + rowIndex - this._symbolsCount / 2)
        this.addChild(sym);
    }

    private addSymbolToTop(symbol: Sym) {
        const sym = new GameSymbol(symbol);
        this.positionSymbolInRow(sym, -1);
        this._currentSymbols.unshift(sym);
    }

    public update(dt: number): void {
        if (this._state === ReelState.SPIN_IN_PROGRESS) {
            const phaseProgression = dt / SPIN_INTERVAL;
            this._spinPhase += phaseProgression;
            if (this._spinPhase >= 1) {
                this._spinPhase -= 1;
                const removedSymbol = this._currentSymbols.pop();
                this.removeChild(removedSymbol);
                this.addSymbolToTop(getRandomSymbol());
            }
            this._currentSymbols.forEach(sym => {
                sym.y += this.symbolHeight * phaseProgression;
            })
        }

        else if (this._state === ReelState.SPIN_RESOLVING) {
            this._spinPhase += dt / SPIN_INTERVAL;
            const phaseProgression = dt / SPIN_INTERVAL;
            if (this._spinPhase >= 1) {
                this._spinPhase -= 1;
                const removedSymbol = this._currentSymbols.pop();
                this.removeChild(removedSymbol);
                if (this._resolutionStack.length > 0) {
                    this.addSymbolToTop(this._resolutionStack.pop());
                } else {
                    this._state = ReelState.IDLE;
                    this._resolutionComplete()
                }
            }
            this._currentSymbols.forEach(sym => {
                sym.y += this.symbolHeight * phaseProgression;
            })
        }

        this._currentSymbols.forEach(sym => sym.update(dt));
    }
}
