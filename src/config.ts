export const screen = {
    width: 1920,
    height: 1080
}

export const REEL_SIZE = 3;
export const REELS_COUNT = 5;
export const MIN_WINNING_COMBINATION_LENGTH = 3;

export const REEL_WIDTH_PX = 200;
export const REEL_HEIGHT_PX = 578;

export const SPIN_DURATION_MS = 1000;
export const SPIN_INTERVAL = 150;

export enum Sym {
    HIGH1 = 'high1',
    HIGH2 = 'high2',
    HIGH3 = 'high3',
    LOW1 = 'low1',
    LOW2 = 'low2',
    LOW3 = 'low3',
    LOW4 = 'low4',
}

export const symbols = [
    Sym.HIGH1,
    Sym.HIGH2,
    Sym.HIGH3,
    Sym.LOW1,
    Sym.LOW2,
    Sym.LOW3,
    Sym.LOW4
];
