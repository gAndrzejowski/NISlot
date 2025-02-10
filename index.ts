import { Application, Assets, Sprite, Container } from 'pixi.js';
import FontFaceObserver from 'fontfaceobserver';
import { Machine } from "./src/containers/Machine";
import { urls } from "./media";
import { SpinButton } from "./src/containers/SpinButton";
import { screen, SPIN_DURATION_MS } from './src/config';
import { Outcome } from './src/processors/Outcome';
import { AppEvents, AppState, StateManager } from './src/StateManager';
import { WinProcessor } from './src/processors/WinProcessor';
import { WinCounter } from './src/containers/WinCounter';
import { GameTitle, TITLE_SIZE } from './src/containers/GameTitle';

class MainScene extends Container {
    private _machine: Machine;
    private _spinButton: SpinButton;
    private _stateManager: StateManager;
    private _winCounter: WinCounter;
    private _gameTitle: GameTitle;

    constructor() {
        super();

        const background = Sprite.from('background');
        this.addChild(background);

        const reels = Sprite.from('reels_base');
        reels.anchor.set(0.5);
        reels.position.set(screen.width * 0.5, screen.height * 0.5);
        this.addChild(reels);

        this._stateManager = new StateManager();

        this._gameTitle = new GameTitle();
        this._gameTitle.position.set(screen.width * 0.6, screen.height * 0.5 - reels.height * 0.5 - TITLE_SIZE * 0.65);
        this.addChild(this._gameTitle);

        const machine = new Machine({ width: reels.width, height: reels.height }, this._stateManager);
        machine.position.set(reels.position.x, reels.position.y);
        machine.init();
        this.addChild(machine);

        const spinButton = new SpinButton(this._stateManager);
        spinButton.position.set(screen.width * 0.85, screen.height * 0.85);
        this.addChild(spinButton);
        spinButton.setEventHandlers();

        const winCounter = new WinCounter(this._stateManager);
        winCounter.position.set((screen.width * 0.5 - reels.width * 0.6) * 0.5, screen.height * 0.5 - reels.height * 0.5)
        this.addChild(winCounter);

        this._machine = machine;
        this._spinButton = spinButton;
        this._winCounter = winCounter;

        this._stateManager.currentOutcome = Outcome.resolve();
        this.displayResult();
        this._stateManager.on(AppEvents.SPIN_START, this.scheduleResolve.bind(this))
        this._stateManager.on(AppEvents.SPIN_RESOLVING_START, async () => {
            await this._machine.startResolve();
            this.displayResult()
        })
    }

    private scheduleResolve() {

        this._stateManager.currentOutcome = Outcome.resolve();
        const win = new WinProcessor(this._stateManager.currentOutcome);
        const winAmount = win.winTotal;
        this._stateManager.scheduleState(AppState.SPIN_RESOLVING, SPIN_DURATION_MS);
        if (winAmount > 0) {
            const winHandler = () => {
                this._stateManager.triggerWin(win.winningCombinations, winAmount);
                this._stateManager.off(AppEvents.IDLE_START, winHandler);
            }
            this._stateManager.on(AppEvents.IDLE_START, winHandler);
        }

    }


    public displayResult() {
        this._machine.displayResult()
    }

    update(dt) {
        this._machine.update(dt);
        this._spinButton.update(dt);
        this._stateManager.update(dt);
        this._winCounter.update(dt);
        this._gameTitle.update(dt);
    }
}

class Game {
    public app: Application;

    constructor() {}

    async initialize(app: Application, urls: any) {
        this.app = app;
        await Assets.load(urls);
    }

    setScene(scene: Container) {
        this.app.stage = scene;
    }
}

(async () => {
    const app = new Application();
    globalThis.__PIXI_APP__ = app;
    await app.init({width: screen.width, height: screen.height});
    document.body.appendChild(app.canvas);

    const game = new Game();
    await game.initialize(app, urls);

    const main = new MainScene();
    game.setScene(main);

    
    app.ticker.add(({deltaMS}) => {
        main.update(deltaMS);
    });
})();