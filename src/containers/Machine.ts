import { Container, Graphics, Size} from "pixi.js";
import { Reel } from "./Reel";
import { REEL_HEIGHT_PX, REEL_SIZE, REEL_WIDTH_PX, REELS_COUNT, Sym } from "../config";
import { SpinOutcome } from "../processors/Outcome";
import { AppEvents, AppState, StateManager } from "../StateManager";

export class Machine extends Container {
    

    constructor(size: Size, stateManager: StateManager) {
        super();
        this._reelAreaDimensions = size;
        this._stateManager = stateManager;
    }

    private _reels: Array<Reel>
    private _reelAreaDimensions: Size
    private _stateManager: StateManager

    public init() {
        this._setupReels();
        this._stateManager.on(AppEvents.SPIN_START, this.startSpin.bind(this));
        this._stateManager.on(AppEvents.WIN_TRIGGERED, this.displayWin.bind(this));
        
        const mask = new Graphics().rect(this.x, this.y - 50, this._reelAreaDimensions.width, this._reelAreaDimensions.height - 100).fill('red')
        this.setMask({mask})
    }

    private startSpin() {
        this._reels.forEach(reel => {
            reel.beginInfiniteSpin();
        })
    }

    private get center() {
        return {
            x: this._reelAreaDimensions.width / 2,
            y: this._reelAreaDimensions.height / 2
        }
    }

    public async startResolve() {
        const outcome = this._stateManager.currentOutcome;
        await Promise.all(this._reels.map((reel, i) => reel.beginResolveWith(outcome[i])))
        this._stateManager.setState(AppState.IDLE);
    }

    private symbolAddressToXY(symX, symY) {
        return {
            x: this.center.x + REEL_WIDTH_PX * (symX + 0.5 - REELS_COUNT / 2),
            y: this.center.y + (REEL_HEIGHT_PX / REEL_SIZE) * (symY - REEL_SIZE / 2)
        }
    }

    private _setupReels() {
        const width = REEL_WIDTH_PX
        const height = REEL_HEIGHT_PX

        const {center} = this;

        this._reels = [];
        for (let i = 0; i < REELS_COUNT; i++) {
            const reel =
                new Reel(
                    {
                        x: center.x + width * (i - REELS_COUNT / 2),
                        y: center.y - 0.5 * height
                    },
                    { width, height }
                    , REEL_SIZE)
            this._reels.push(reel)
            this.addChild(reel);
        }
    }

    private displayWin({winningCombinations}) {

        const {center} = this

        for (let combination of winningCombinations) {
            const [first, ...rest] = combination;
            const firstPoint = this.symbolAddressToXY(0, first);
            console.log(first, firstPoint);
            const winLine = new Graphics().moveTo(firstPoint.x, firstPoint.y);
            this._reels[0].startWinAnimationForSymbol(first);
            rest.forEach((symbol, index) => {
                const point = this.symbolAddressToXY(index + 1, symbol);
                console.log(symbol, point)
                winLine.lineTo(point.x, point.y);
                this._reels[index + 1].startWinAnimationForSymbol(symbol);
            });
            const symbol = this._stateManager.currentOutcome[0][combination[0]]
            const color = [Sym.HIGH1, Sym.HIGH2, Sym.HIGH3].includes(symbol) ? 'red' : 'yellow';
            winLine.stroke({color, width: 10});
            this.addChildAt(winLine, 0)
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