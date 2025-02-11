import { EventEmitter } from 'pixi.js';
import { SpinOutcome } from './processors/Outcome';
import { REEL_SIZE, REELS_COUNT } from './config';

export enum AppState {
    IDLE = 'idle',
    SPIN = 'spin',
    SPIN_RESOLVING = 'spinResolving',
}

export enum AppEvents {
    IDLE_START = 'idleStart',
    IDLE_END = 'idleEnd',
    SPIN_START = 'spinStart',
    SPIN_END = 'spinEnd',
    SPIN_RESOLVING_START = 'spinResolvingStart',
    SPIN_RESOLVING_END = 'spinResolvingEnd',
    WIN_TRIGGERED = 'winTriggered',
}

export type ScheduledStateChange = {
    state: AppState,
    delayMs: number
}

export class StateManager extends EventEmitter<AppEvents> {
    constructor() {
        super()
        this.stateQueue = [];
        this.currentState = AppState.IDLE;
        this._currentOutcome = [[]]
    }

    stateQueue: Array<ScheduledStateChange>
    currentState: AppState
    private _currentOutcome: SpinOutcome

    public scheduleState(state: AppState, delayMs: number): void {
        this.stateQueue.push({ state, delayMs });
    }

    public setState(state: AppState): void {
        if (this.currentState === state) return;

        this.emit(`${this.currentState}End` as AppEvents);
        this.currentState = state;
        this.emit(`${state}Start` as AppEvents);
    }

    public set currentOutcome(outcome: SpinOutcome) {
        if (outcome.length === REELS_COUNT && outcome.every(column => column.length === REEL_SIZE)) {
            this._currentOutcome = outcome;
        } else {
            throw new Error(`
                Bad dimensions for outcome: 
                Expected ${REELS_COUNT}x${Array(REELS_COUNT).fill(REEL_SIZE)}
                Received ${outcome.length}x${outcome.map(column => column.length).join(',')}
            `)
        }
    }

    public get currentOutcome(): SpinOutcome {
        return [...this._currentOutcome].map(column => [...column])
    }

    public triggerWin(winningCombinations: Set<string>, amount: number): void {
        this.emit(AppEvents.WIN_TRIGGERED, { winningCombinations, amount });
    }

    public update(dt: number): void {
        if (this.stateQueue.length === 0) {
            return;
        }

        const scheduledState = this.stateQueue[0].state;

        this.stateQueue[0].delayMs -= dt;
        if (this.stateQueue[0].delayMs <= 0) {
            this.stateQueue.shift();
            this.setState(scheduledState)
        }
    }
}
