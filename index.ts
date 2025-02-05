import { Application, Assets, Sprite, Container } from 'pixi.js';
import { Machine } from "./src/Machine";
import { urls } from "./img";
import { SpinButton } from "./src/SpinButton";
import { screen } from './src/config';
import { Outcome } from './src/Outcome';

class MainScene extends Container {
    private _machine: Machine;
    private _spinButton: SpinButton;

    constructor() {
        super();

        const background = Sprite.from('background');
        this.addChild(background);

        const reels = Sprite.from('reels_base');
        reels.anchor.set(0.5);
        reels.position.set(screen.width * 0.5, screen.height * 0.5);
        this.addChild(reels);

        const machine = new Machine({ width: reels.width, height: reels.height });
        machine.position.set(screen.width * 0.5 - reels.width * 0.5, screen.height * 0.5 - reels.height * 0.5);
        this.addChild(machine);

        console.log(`reels RECT: ${reels.getBounds()}`)
        console.log(`machine position: ${machine.x} - ${machine.y}`)

        const spinButton = new SpinButton();
        spinButton.position.set(screen.width * 0.85, screen.height * 0.85);
        this.addChild(spinButton);
        spinButton.setEventHandlers(() => this.setResult())

        this._machine = machine;
        this._spinButton = spinButton;

        this.setResult();
    }

    public setResult() {
        this._machine.displayResult(Outcome.resolve())
        console.log('result set')
    }

    update(dt) {
        this._machine.update(dt);
        this._spinButton.update(dt);
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

    
    app.ticker.add(({deltaTime}) => {
        main.update(deltaTime);
    });
})();