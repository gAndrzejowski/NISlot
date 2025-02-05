import { Container, Text } from "pixi.js";
import { StateManager } from "./StateManager";

enum WinCounterStates {
    HIDDEN,
    COUNTUP,
    IDLE
}

const BIG_WIN_THRESHOLD = 2;
const SUPER_WIN_THRESHOLD = 5;
const MEGA_WIN_THRESHOLD = 15;
const COUNTER_WIDTH = 200;
const COUNTER_HEIGHT = 100
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
              fontSize: 20,  
              fontFamily: 'Helvetica',
              fill: 'goldenrodyellow',
            }
        })
        this._counter.anchor.set(0.5);
        this._counter.position.set(COUNTER_WIDTH / 2, COUNTER_HEIGHT - this._counter.height / 2)

        this._winExclamation = new Text({
            text: BIG_WIN_TEXT,
            style: {
                fontSize: 28,
                fontFamily: 'Helvetica',
                fill: 'goldenrodyellow'
            }
        });
        this._winExclamation.anchor.set(0.5);
        this._winExclamation.position.set(COUNTER_WIDTH / 2, this._winExclamation.height / 2);
        this._winExclamation.scale = 0;
    }

    private _currentValue: number;
    private _counter: Text;
    private _winExclamation: Text;
    private _state: WinCounterStates;
    private _stateManager: StateManager;

    private countupWin(targetValue = 0) {
       this.visible = true;
       this._state = WinCounterStates.COUNTUP;
       console.log('countup win');
       this.displayWinIdle();
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

    }

}