import { EventEmitter } from "pixi.js";

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
    durationMs: number
}

export class StateManager extends EventEmitter<AppEvents> {
    constructor() {
        super()
        this.stateQueue = [];
        this.currentState = AppState.IDLE;
    }

    stateQueue: Array<ScheduledStateChange>
    currentState: AppState

    public scheduleState(state: AppState, durationMs: number): void {
        this.stateQueue.push({state, durationMs});
    }

    public scheduleStateImmediate(state: AppState, durationMs: number): void {
        this.stateQueue = [{state, durationMs}];
    }

    private setState(state: AppState): void {
        if (this.currentState === state) return;

        this.emit(`${this.currentState}End` as AppEvents);
        this.currentState = state;
        this.emit(`${state}Start` as AppEvents);
    }

    public update(dt) {
        if (this.stateQueue.length === 0) {
            this.setState(AppState.IDLE);
            return;
        }

        const scheduledState = this.stateQueue[0].state;
        this.setState(scheduledState)

        this.stateQueue[0].durationMs -= dt;
        if (this.stateQueue[0].durationMs <= 0) this.stateQueue.shift();
    }

    public override emit(event: AppEvents, ...rest): boolean {
        console.log(event);
        return super.emit(event, ...rest)
    }

}