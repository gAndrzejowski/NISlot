import {Assets, Container, Size} from "pixi.js";
import { Reel } from "./Reel";
import { REEL_HEIGHT_PX, REEL_SIZE, REEL_WIDTH_PX, REELS_COUNT } from "./config";
import { SpinOutcome } from "./Outcome";
import { StateManager } from "./StateManager";

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
    }

    private _setupReels() {
        const center  = {
            x: this._reelAreaDimensions.width / 2,
            y: this._reelAreaDimensions.height / 2
        }
        const width = REEL_WIDTH_PX
        const height = REEL_HEIGHT_PX

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

    public displayResult(result: SpinOutcome) {
        this._reels.forEach((reel, index) => reel.drawSymbols(result[index]))
    }


    update(dt: number): void {}
}