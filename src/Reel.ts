import { Container, Rectangle, Sprite } from "pixi.js";
import { Symbols } from './Symbols';

export class Reel extends Container {

    constructor(rect: Rectangle, symbolsCount: number) {
        super();
        this.position = {x: rect.x, y: rect.y};
        this.width = rect.width;
        this.height = rect.height;
        this._symbolsCount = symbolsCount
    }

    private readonly _symbolsCount: number;

    public drawSymbols(...syms: [Symbols]) {
        this.removeChildren();
        syms.forEach((sym, index) => {
            const symbol = Sprite.from(sym);
            symbol.anchor.set(0.5);
            symbol.position.set(this.width/2, this.height / this._symbolsCount * index);
            this.addChild(symbol)
        })
    }

    update(dt: number): void {}
}