import background from './img/background.jpg'
import * as img from './img/*.png';
import gargle from './font/gargle.rg-bold.woff2';

export const urls = Object.freeze([
    {alias: 'background', src: background},
    // {alias: 'gargle', src: gargle},
    ...Object.entries(img).map(([alias, src]) => ({alias, src}))
]);