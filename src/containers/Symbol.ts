import { Container, Sprite } from "pixi.js";
import { Sym } from "../config";

const SHOW_WIN_INTERVAL = 2000;
const MAX_SCALING_CHANGE = 0.2;
const PROGRESSION_WITHOUT_SCALING = 0.4;

export class Symbol extends Container {

    constructor(spriteKey: Sym) {
        super();
        this._sprite = Sprite.from(spriteKey);
        this._sprite.anchor.set(0.5);
        this.addChild(this._sprite);
        this._isShowingWin = false;
        this._showWinProgression = 0;
    }

    public showWin() {
        this._isShowingWin = true;
    }

    public stopShowWin() {
        this._isShowingWin = false;
        this._showWinProgression = 0;
        this._sprite.scale = 1;
    }

    static getScaleFromShowWinProgression(prog: number): number {
        if (prog <= PROGRESSION_WITHOUT_SCALING) return 1;
        const subProgression = (prog - PROGRESSION_WITHOUT_SCALING)/(1-PROGRESSION_WITHOUT_SCALING);
        return 1 + Math.sin(Math.PI * subProgression) * MAX_SCALING_CHANGE;
    }

    private _sprite: Sprite;
    private _isShowingWin: boolean;
    private _showWinProgression: number;


    update(dt) {
        if (this._isShowingWin) {
            this._showWinProgression += dt / SHOW_WIN_INTERVAL;
            if (this._showWinProgression >= 1) this._showWinProgression -= 1;
            this._sprite.scale.set(Symbol.getScaleFromShowWinProgression(this._showWinProgression));
        }
    }

}