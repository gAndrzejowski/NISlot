import { Application, Assets, Sprite, Container } from 'pixi.js';
import { Machine } from "./src/Machine";
import { urls } from "./img";
import { SpinButton } from "./src/SpinButton";
import { screen, SPIN_RESOLVE_DURATION_MS } from './src/config';
import { Outcome } from './src/Outcome';
import { AppEvents, AppState, StateManager } from './src/StateManager';

class MainScene extends Container {
    private _machine: Machine;
    private _spinButton: SpinButton;
    private _stateManager: StateManager;

    constructor() {
        super();

        const background = Sprite.from('background');
        this.addChild(background);

        const reels = Sprite.from('reels_base');
        reels.anchor.set(0.5);
        reels.position.set(screen.width * 0.5, screen.height * 0.5);
        this.addChild(reels);

        this._stateManager = new StateManager();

        const machine = new Machine({ width: reels.width, height: reels.height }, this._stateManager);
        machine.position.set(reels.position.x - reels.width * 0.5, reels.position.y - reels.height * 0.5);
        machine.init();
        this.addChild(machine);

        const spinButton = new SpinButton(this._stateManager);
        spinButton.position.set(screen.width * 0.85, screen.height * 0.85);
        this.addChild(spinButton);
        spinButton.setEventHandlers()

        this._machine = machine;
        this._spinButton = spinButton;

        this.setResult();
        this._stateManager.on(AppEvents.SPIN_START, this.scheduleResolve.bind(this))
        this._stateManager.on(AppEvents.SPIN_RESOLVING_END, this.setResult.bind(this))
    }

    private scheduleResolve() {
        this._stateManager.scheduleState(AppState.SPIN_RESOLVING, SPIN_RESOLVE_DURATION_MS);

    }


    public setResult() {
        this._machine.displayResult(Outcome.resolve())
    }

    update(dt) {
        this._machine.update(dt);
        this._spinButton.update(dt);
        this._stateManager.update(dt);
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