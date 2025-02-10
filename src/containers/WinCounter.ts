import { Container, Text } from "pixi.js";
import { AppEvents, StateManager } from "../StateManager";

enum WinCounterStates {
    HIDDEN,
    COUNTUP,
    IDLE
}

enum WinStages {
    WIN = 0,
    BIG_WIN,
    SUPER_WIN,
    MEGA_WIN
}

const WinTexts = {
    [WinStages.WIN]: 'Win',
    [WinStages.BIG_WIN]: 'Big Win!',
    [WinStages.SUPER_WIN]: 'Super Win!!!',
    [WinStages.MEGA_WIN]: 'Mega Win!!!!!1'
}

const WinCountupUnitTimes = {
    [WinStages.WIN]: 500,
    [WinStages.BIG_WIN]: 300,
    [WinStages.SUPER_WIN]: 200,
    [WinStages.MEGA_WIN]: 100
}

const WinTextScaleValues = {
    [WinStages.WIN]: 0.6,
    [WinStages.BIG_WIN]: 0.7,
    [WinStages.SUPER_WIN]: 0.9,
    [WinStages.MEGA_WIN]: 1.3 
}

const WinThresholds = {
    [WinStages.WIN]: 0,
    [WinStages.BIG_WIN]: 2,
    [WinStages.SUPER_WIN]: 5,
    [WinStages.MEGA_WIN]: 15
}
const COUNTUP_UNIT_TIME = 500;
const COUNTER_OFFSET = 50;
const EXCLAMATION_OFFSET = -50;

export class WinCounter extends Container {

    constructor(stateManager: StateManager) {
        super();
        this._currentValue = 0;
        this.visible = false;
        this._state = WinCounterStates.HIDDEN;
        this._stateManager = stateManager;
        this._winStage = WinStages.WIN;
        this._countupEnd = () => {};
        this._counter = new Text({
            text: this._currentValue.toFixed(2),
            style: {
              fontSize: 80,
              fontFamily: 'gargle',
              fill: '#fad64f',
              stroke: {
                color: "#222222",
                width: 20,
              }
            }
        })
        this._counter.anchor.set(0.5);
        this._counter.position.set(0, COUNTER_OFFSET);

        this._winExclamation = new Text({
            text: WinTexts[this._winStage],
            style: {
                fontSize: 100,
                fontFamily: 'gargle',
                fill: '#fad64f',
                stroke: {
                    color: '#222222',
                    width: 20,
                }
            }
        });
        this._winExclamation.anchor.set(0, 0.5);
        this._winExclamation.position.set(-0.5 * this._counter.width, EXCLAMATION_OFFSET);
        this._winExclamation.scale = WinTextScaleValues[this._winStage];

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
    private _winStage: WinStages;
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

    private setWinStage(stage: WinStages) {
        this._winStage = stage;
        this._winExclamation.text = WinTexts[stage];
    }

    private displayWinIdle() {
        this._state = WinCounterStates.IDLE;
    }

    private clearWinCountup() {
        this._state = WinCounterStates.HIDDEN
        this.visible = false;
        this._currentValue = 0;
        this._winExclamation.scale = WinTextScaleValues[WinStages.WIN]
        this.setWinStage(WinStages.WIN)
        this._counter.y = COUNTER_OFFSET;
        this._counter.text = this._currentValue.toFixed(2);
    }
    
    private interpolateScale(winStageCurrent: WinStages, valueToInterpolate: number) {

        if (winStageCurrent === WinStages.MEGA_WIN) return WinTextScaleValues[WinStages.MEGA_WIN]

        const bottomBound = WinThresholds[winStageCurrent];
        const topBound = WinThresholds[winStageCurrent + 1];
        const lowScale = WinTextScaleValues[winStageCurrent];
        const highScale = WinTextScaleValues[winStageCurrent + 1]
        const valueRange = topBound - bottomBound;
        const scaleRange = highScale - lowScale;

        return lowScale + scaleRange * (valueToInterpolate - bottomBound) / valueRange;
    }

    public update(dt) {
        if (this._state === WinCounterStates.COUNTUP) {
            this._currentValue += dt/COUNTUP_UNIT_TIME;
            if (this._currentValue >= this._targetValue) {
                this._currentValue = this._targetValue;
                this._countupEnd();
            }
            this._counter.text = this._currentValue.toFixed(2);
            this._counter.y = COUNTER_OFFSET + Math.sqrt(this._currentValue) * 10;
            this._winExclamation.scale = this.interpolateScale(this._winStage, this._currentValue);
            if (this._currentValue >= WinThresholds[this._winStage + 1]) {
                this.setWinStage(this._winStage + 1);
            }
        }
    }

}