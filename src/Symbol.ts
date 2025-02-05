import { Container, Point, Sprite } from "pixi.js";
import { AppEvents, StateManager } from "./StateManager";

export type SymbolConfig = {
    position: Point;
    width: number;
    height: number;
    spriteKey: string;
}

export class Symbol extends Container {

    constructor({position, width, height, spriteKey}: SymbolConfig, stateManager: StateManager) {
        super();
        this.position.set(position.x, position.y);
        this._width = width;
        this._height = height;
        this._sprite = Sprite.from(spriteKey);
        this._sprite.anchor.set(0.5);
        this._sprite.x = width/2;
        this._sprite.y = height/2;
        this.addChild(this._sprite);
        this._stateManager = stateManager;
    }

    private _init() {
        this._stateManager.on(AppEvents.WIN_TRIGGERED, this.showWin.bind(this))
        this._stateManager.on(AppEvents.IDLE_END, this.stopShowWin.bind(this))
    }

    private showWin() {
        console.log('show win');
    }

    private stopShowWin() {
        console.log('stop show win');
    }

    private _width: number;
    private _height: number;
    private _sprite: Sprite;

    private _stateManager: StateManager;

    update(dt) {

    }

}