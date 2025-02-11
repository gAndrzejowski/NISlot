import {Assets, Container, Sprite, Texture} from "pixi.js";
import { AppEvents, AppState, StateManager } from "../StateManager";

export class SpinButton extends Container {
    constructor(stateManager: StateManager) {
        super();

        this._buttonNormal = Assets.get('spin_btn_normal');
        this._buttonHover = Assets.get('spin_btn_over');
        this._buttonDown = Assets.get('spin_btn_down')
        this._buttonDisabled = Assets.get('spin_btn_disabled');
        
        const button = Sprite.from(this._buttonNormal);
        button.anchor.set(0.5);
        this.addChild(button);
        this._button = button;
        this._stateManager = stateManager
    }

    private _isDisabled: boolean;
    private _buttonNormal: Texture;
    private _buttonHover: Texture;
    private _buttonDown: Texture;
    private _buttonDisabled: Texture;
    private _button: Sprite;
    private _stateManager: StateManager;

    public setEventHandlers() {
        this._button.eventMode = 'static';
        this._button.interactive = true;
        this._button.cursor = 'pointer';
        this._button.on('pointertap', this.trySpin.bind(this))
        this._button.on('pointerover', () => this.setEnabledButtonTexture(this._buttonHover));
        this._button.on('pointerdown', () => this.setEnabledButtonTexture(this._buttonDown));
        this._button.on('pointerout', () => this.setEnabledButtonTexture(this._buttonNormal))
        this._stateManager.on(AppEvents.SPIN_START, this.disable.bind(this));
        this._stateManager.on(AppEvents.SPIN_RESOLVING_END, this.enable.bind(this));
    }

    private trySpin() {
        if (this._isDisabled === true) return;
        this._stateManager.setState(AppState.SPIN);
    }

    private disable() {
        this._isDisabled = true;
        this._button.texture = this._buttonDisabled;
    }

    private enable() {
        this._isDisabled = false;
        this._button.texture = this._buttonNormal;
    }

    private setEnabledButtonTexture(texture: Texture) {
        if (this._isDisabled || this._button.texture === texture) return;
        this._button.texture = texture;
    }

}