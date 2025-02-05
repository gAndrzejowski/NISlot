import {Container, Size} from "pixi.js";
import { Reel } from "./Reel";
import { REEL_SIZE, REELS_COUNT } from "./config";
import { SpinOutcome } from "./Outcome";

export class Machine extends Container {
    

    constructor(size: Size) {
        super();
        this._reelAreaDimensions = size;
        this._setupReels();
        console.log(`REEL AREA SIZE: ${size.width}x${size.height}`)
    }

    private _reels: Array<Reel>
    private _reelAreaDimensions: Size

    private _setupReels() {
        const width = this._reelAreaDimensions.width / REELS_COUNT, height = this._reelAreaDimensions.height;


        this._reels = [];
        for (let i = 0; i < REELS_COUNT; i++) {
            const reel = 
                new Reel(
                    { x: width * i, y: 0, },
                    { width, height }
                    , REEL_SIZE)
            this._reels.push(reel)
            this.addChild(reel);
            console.log(`reel ${i+1}`, width * i, '-->', width * (i+1));
        }
    }

    public displayResult(result: SpinOutcome) {
        this._reels.forEach((reel, index) => reel.drawSymbols(result[index]))
    }


    update(dt: number): void {}
}