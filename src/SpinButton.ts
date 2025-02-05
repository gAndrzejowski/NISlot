import {Container, Sprite} from "pixi.js";

export class SpinButton extends Container {
    constructor() {
        super();

        const button = Sprite.from('spin_btn_normal');
        button.anchor.set(0.5);
        this.addChild(button);
        this._button = button;
    }

    setEventHandlers(respinHandler: () => void) {
        this._button.eventMode = 'static';
        this._button.cursor = 'pointer';
        this._button.on('pointertap', respinHandler)
        console.log(this._button)
    }

    private _button: Sprite;

    update(dt: number): void {}
}