import { type ColorSource, Container, Filter, FilterSystem, Text } from "pixi.js";
import FFO from "fontfaceobserver";

const TITLE = "Super retro spinner";
const TINT_CHANGE_INTERVAL = 10000;
export const TITLE_SIZE = 150;
const TINT_OPTIONS = [
    '#cccc44', // yellow
    '#ff0088', // pink
    '#dd4444', // red
    '#44dd44', // green
    '#4444dd', // blue
    '#ffa500', // orange
    '#cc44cc', // magenta
]

export class GameTitle extends Container {

    constructor() {
        super();
        this._text = new Text({
            text: TITLE,
            style: {
                fontSize: TITLE_SIZE,
                fill: '#dddddd',
                stroke: {
                    color: '#222222',
                    width: 5
                }
            }
        });
        this._text.anchor.set(0.5)
        this._text.position.set(0,0);
        this._tintChangeCountdown = TINT_CHANGE_INTERVAL;
        this._text.tint = this._getRandomTint();
        this.addChild(this._text);
        this._init();
    }

    private _getRandomTint(): ColorSource {
        const optionsCount = TINT_OPTIONS.length;
        return TINT_OPTIONS[Math.floor(Math.random() * optionsCount)]

    }

    private async _init() {
        const ffo = new FFO('angelos'); 
        await ffo.load();
        this._text.style.fontFamily = 'angelos';
    }

    private _text: Text;
    private _tintChangeCountdown: number;


    public update(dt) {
        this._tintChangeCountdown -= dt;
        if (this._tintChangeCountdown < 0) {
            this._tintChangeCountdown = TINT_CHANGE_INTERVAL;
            this._text.tint = this._getRandomTint()
        }
    }

}