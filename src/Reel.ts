import { Container, PointData, Size, Sprite } from "pixi.js";
import { Symbol } from './config';

export class Reel extends Container {

    constructor(position: PointData, size: Size, symbolsCount: number) {
        super();
        this.position = position;
        this._areaWidth = size.width;
        this._areaHeight = size.height;
        this._symbolsCount = symbolsCount;
        console.log(this.position)
    }

    private _areaWidth: number;
    private _areaHeight: number;

    private readonly _symbolsCount: number;

    public drawSymbols(syms: Array<Symbol>) {
        this.removeChildren();
        const symbolHeight = this._areaHeight / this._symbolsCount;
        syms.forEach((sym, index) => {
            const symbol = Sprite.from(sym);
            symbol.anchor.set(0.5);
            symbol.position.set(this._areaWidth/2, this._areaHeight / 2 + symbolHeight * (index - this._symbolsCount/2));
            this.addChild(symbol)
        })
    }

    update(dt: number): void {}
}