import { Container, PointData, Size, Sprite } from "pixi.js";
import { Symbol } from './config';

export class Reel extends Container {

    constructor(position: PointData, size: Size, symbolsCount: number) {
        super();
        this.position = position;
        this.width = size.width;
        this.height = size.height;
        this._symbolsCount = symbolsCount
    }

    private readonly _symbolsCount: number;

    public drawSymbols(syms: Array<Symbol>) {
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