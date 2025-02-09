import { Container, Point, Sprite } from "pixi.js";
import { AppEvents, StateManager } from "../StateManager";

export type SymbolConfig = {
    position: Point;
    width: number;
    height: number;
    spriteKey: string;
}

const SHOW_WIN_INTERVAL = 3000;
const MAX_SCALING_CHANGE = 0.2;

export class Symbol extends Container {

    constructor({position, width, height, spriteKey}: SymbolConfig) {
        super();
        this.position.set(position.x, position.y);
        this._sprite = Sprite.from(spriteKey);
        this._sprite.anchor.set(0.5);
        this._sprite.x = width/2;
        this._sprite.y = height/2;
        this.addChild(this._sprite);
        this._isShowingWin = false;
    }

    public showWin() {
        this._isShowingWin = true;
    }

    public stopShowWin() {
        this._isShowingWin = false;
        this._showWinProgression = 0;
        this._sprite.scale = 1;
    }

    private _sprite: Sprite;
    private _isShowingWin: boolean;
    private _showWinProgression: number;


    update(dt) {
        if (this._isShowingWin) {
            this._showWinProgression += dt / SHOW_WIN_INTERVAL;
            this._sprite.scale = 1 + Math.sin(Math.PI * 2 * this._showWinProgression) * MAX_SCALING_CHANGE;
        }
    }

}