import { Container, PointData, Size, Sprite } from "pixi.js";
import { SPIN_INTERVAL, Sym } from '../config';
import { getRandomSymbol } from "../processors/RandomSymbol";

enum ReelState {
    IDLE = 'idle',
    SPIN_IN_PROGRESS = 'spinInProgress',
    SPIN_RESOLVING = 'spinResolving'
}

export class Reel extends Container {

    constructor(position: PointData, size: Size, trueSymbolsCount: number) {
        super();
        this.position = position;
        this._areaWidth = size.width;
        this._areaHeight = size.height;
        this._symbolsCount = trueSymbolsCount;
        this._currentSymbols = [];
        this._resolutionStack = [];
        this._spinPhase = 0;
        this.state = ReelState.IDLE;
    }

    private _areaWidth: number;
    private _areaHeight: number;
    private _currentSymbols: Array<Sprite>;
    private _spinPhase: number;
    private _resolutionStack: Array<Sym>;
    private _resolutionComplete: () => void;
    private state: ReelState;

    private get symbolHeight() {
        return this._areaHeight / this._symbolsCount;
    }

    public async beginResolveWith(newSyms: Array<Sym>) {
        this._resolutionStack = newSyms;
        this.state = ReelState.SPIN_RESOLVING;
        return new Promise<void>(resolve => {
            this._resolutionComplete = resolve;
        })
    }

    public beginInfiniteSpin() {
        this.state = ReelState.SPIN_IN_PROGRESS;
        this._spinPhase = 0;
    }

    // eslint-disable-next-line
    public startWinAnimationForSymbol(index: number) {
        // this._currentSymbols[index].showWin()
    }

    public clearWinningAnimation() { 
        // this._currentSymbols.forEach(sym => sym.stopShowWin())
    }

    private readonly _symbolsCount: number;

    private positionSymbolInRow(sym:Sprite, rowIndex: number) { // 0-based, -1 is used to put symbol outside normal area to prepare in spinning phase
        sym.position.set(
            0,
            this.symbolHeight * (0.5 + rowIndex - this._symbolsCount / 2)
        )
    }

    private addSymbolToTop(symbol: Sym) {
        const sym = this.createSymbolFromAlias(symbol);
        this.positionSymbolInRow(sym, -1);
        this._currentSymbols.unshift(sym);
    }

    private createSymbolFromAlias(alias: Sym): Sprite {
        const symbol = Sprite.from(alias);
        symbol.anchor.set(0.5);
        this.addChild(symbol)
        return symbol;
    }

    public setSymbols(syms: Array<Sym>) {
        this.removeChildren();
        this._spinPhase = 0;
        syms.forEach((sym, index) => {
            const symbol = this.createSymbolFromAlias(sym);
            this.positionSymbolInRow(symbol, index);
            this._currentSymbols.push(symbol);
        });
        this.addSymbolToTop(getRandomSymbol());
    }

    update(dt: number): void {
        if (this.state === ReelState.SPIN_IN_PROGRESS) {
            const phaseProgression = dt/SPIN_INTERVAL;
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
         
        else if (this.state === ReelState.SPIN_RESOLVING) {
            this._spinPhase += dt/SPIN_INTERVAL;
            const phaseProgression = dt/SPIN_INTERVAL;
            if (this._spinPhase >= 1) {
                this._spinPhase -= 1;
                const removedSymbol = this._currentSymbols.pop();
                this.removeChild(removedSymbol);
                if (this._resolutionStack.length > 0) { 
                    this.addSymbolToTop(this._resolutionStack.pop());
                } else {
                    this.state = ReelState.IDLE;
                    this._resolutionComplete()
                }
            }
            this._currentSymbols.forEach(sym => {
                sym.y += this.symbolHeight * phaseProgression;
            })
        }

    }
}