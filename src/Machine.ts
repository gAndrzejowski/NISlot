import {Container} from "pixi.js";
import { Reel } from "./Reel";
import { REEL_SIZE, REELS_COUNT } from "./config";
import { SpinOutcome } from "./Outcome";

export class Machine extends Container {
    constructor() {
        super();
        this._setupReels();
    }

    private _reels: Array<Reel>

    private _setupReels() {
        const width = this.width / REELS_COUNT, height = this.height;

        this._reels = [];
        for (let i = 0; i < REELS_COUNT; i++) {
            const reel = 
                new Reel(
                    { x: width * i, y: 0, },
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