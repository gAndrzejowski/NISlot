import { Container, Graphics, Size} from "pixi.js";
import { Reel } from "./Reel";
import { REEL_HEIGHT_PX, REEL_SIZE, REEL_WIDTH_PX, REELS_COUNT, Sym } from "../config";
import { AppEvents, AppState, StateManager } from "../StateManager";

export class Machine extends Container {
    

    constructor(size: Size, stateManager: StateManager) {
        super();
        this._reelAreaDimensions = size;
        this._stateManager = stateManager;
        this._winLines = [];
    }

    private _reels: Array<Reel>
    private _reelAreaDimensions: Size
    private _stateManager: StateManager
    private _winLines: Array<Graphics>

    public init() {
        this._setupReels();
        this._stateManager.on(AppEvents.SPIN_START, this.startSpin.bind(this));
        this._stateManager.on(AppEvents.WIN_TRIGGERED, this.displayWin.bind(this));
        this._stateManager.on(AppEvents.IDLE_END, this.clearWin.bind(this));
        
        const { width, height} = this._reelAreaDimensions;
        const mask = new Graphics().rect(this.x - width * 0.5, this.y - height * 0.5 + 57, width, height - 114).fill('red')
        this.setMask({mask})
    }

    private startSpin() {
        this._reels.forEach(reel => {
            reel.beginInfiniteSpin();
        })
    }

    private clearWin() {
        this._winLines.forEach((line => {
            this.removeChild(line);
        }))
        this._winLines = [];
        this._reels.forEach(reel => {
            reel.clearWinningAnimation();
        })
    }

    public async startResolve() {
        const outcome = this._stateManager.currentOutcome;
        await Promise.all(this._reels.map((reel, i) => reel.beginResolveWith(outcome[i])))
        this._stateManager.setState(AppState.IDLE);
    }

    private symbolAddressToXY(symX: number, symY: number) {
        const xy =  {
            x: REEL_WIDTH_PX * (symX + 0.5 - REELS_COUNT / 2),
            y: (REEL_HEIGHT_PX / REEL_SIZE) * (symY + 0.5 - REEL_SIZE / 2)
        };
        return xy;
    }

    private _setupReels() {
        const width = REEL_WIDTH_PX
        const height = REEL_HEIGHT_PX

        this._reels = [];
        for (let i = 0; i < REELS_COUNT; i++) {
            const reel =
                new Reel(
                    {
                        x: width * (0.5 + i - REELS_COUNT / 2),
                        y: 0
                    },
                    { width, height }
                    , REEL_SIZE)
            this._reels.push(reel)
            this.addChild(reel);
        }
    }

    private displayWin({winningCombinations}) {

        for (const combination of winningCombinations) {
            const [first, ...rest] = combination.split('').map(posX => Number.parseInt(posX));
            const firstPoint = this.symbolAddressToXY(0, first);
            const winLine = new Graphics().moveTo(firstPoint.x, firstPoint.y);
            this._reels[0].startWinAnimationForSymbol(first);
            rest.forEach((symbol, index) => {
                const point = this.symbolAddressToXY(index + 1, symbol);
                winLine.lineTo(point.x, point.y);
                this._reels[index + 1].startWinAnimationForSymbol(symbol);
            });
            const symbol = this._stateManager.currentOutcome[0][combination[0]]
            const color = [Sym.HIGH1, Sym.HIGH2, Sym.HIGH3].includes(symbol) ? 'red' : 'yellow';
            winLine.stroke({color, width: 10});
            this.addChildAt(winLine, 0)
            this._winLines.push(winLine);
        }
    }

    public displayResult() {
        const result = this._stateManager.currentOutcome;
        this._reels.forEach((reel, index) => reel.setSymbols([...result[index]]))
    }


    update(dt: number): void {
        this._reels.forEach((reel) => {
            reel.update(dt);
        })
    }
}