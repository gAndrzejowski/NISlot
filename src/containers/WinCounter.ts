import { Container, Text } from "pixi.js";
import { AppEvents, StateManager } from "../StateManager";

enum WinCounterStates {
    HIDDEN,
    COUNTUP,
    IDLE
}

const BIG_WIN_THRESHOLD = 2;
const SUPER_WIN_THRESHOLD = 5;
const MEGA_WIN_THRESHOLD = 15;
const COUNTUP_UNIT_TIME = 500;
export const COUNTER_WIDTH = 200;
export const COUNTER_HEIGHT = 150;
const BIG_WIN_TEXT = 'Big Win!';
const SUPER_WIN_TEXT = 'Super Win!!!';
const MEGA_WIN_TEXT = 'Mega Win!!!!!!1'

export class WinCounter extends Container {

    constructor(stateManager: StateManager) {
        super();
        this._currentValue = 0;
        this.visible = false;
        this._state = WinCounterStates.HIDDEN;
        this._stateManager = stateManager;
        this._counter = new Text({
            text: this._currentValue.toFixed(2),
            style: {
              fontSize: 40,
              letterSpacing: 5,
              fontFamily: 'Helvetica',
              fill: '#DAA520',
            }
        })
        this._counter.anchor.set(0.5);
        this._counter.position.set(COUNTER_WIDTH / 2, COUNTER_HEIGHT - this._counter.height / 2)

        this._winExclamation = new Text({
            text: BIG_WIN_TEXT,
            style: {
                fontSize: 80,
                fontFamily: 'Helvetica',
                fill: '#DAA520'
            }
        });
        this._winExclamation.anchor.set(0.5);
        this._winExclamation.position.set(COUNTER_WIDTH / 2, this._winExclamation.height / 2);
        this._winExclamation.scale = 0;

        this.addChild(this._counter);
        this.addChild(this._winExclamation);

        this._stateManager.on(AppEvents.WIN_TRIGGERED, this.countupWin.bind(this));
        this._stateManager.on(AppEvents.IDLE_END, this.clearWinCountup.bind(this));
    }

    private _currentValue: number;
    private _targetValue: number;
    private _counter: Text;
    private _winExclamation: Text;
    private _state: WinCounterStates;
    private _stateManager: StateManager;
    private _countupEnd: () => void;

    private async countupWin({amount}) {
       this.visible = true;
       this._state = WinCounterStates.COUNTUP;
       this._targetValue = amount;
       await this.waitForCountupEnd();
       this.displayWinIdle();
    }

    private waitForCountupEnd(): Promise<void> {
        return new Promise<void>((resolve) => {
            this._countupEnd = resolve;
        })
    }

    private displayBigWin() {

    }

    private displaySuperWin() {

    }

    private displayMegaWin() {

    }

    private displayWinIdle() {
        this._state = WinCounterStates.IDLE;
        console.log('display win idle animation');
    }

    private clearWinCountup() {
        this._state = WinCounterStates.HIDDEN
        this.visible = false;
        this._currentValue = 0;
        console.log('stopCountup')
    }

    public update(dt) {
        if (this._state === WinCounterStates.COUNTUP) {
            this._currentValue += dt/COUNTUP_UNIT_TIME;
            if (this._currentValue >= this._targetValue) {
                this._currentValue = this._targetValue;
                this._countupEnd();
            }
            this._counter.text = this._currentValue.toFixed(2);
        }

    }

}