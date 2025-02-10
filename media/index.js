import background from './img/background.jpg'
import * as img from './img/*.png';

export const urls = Object.freeze([
    {alias: 'background', src: background},
    ...Object.entries(img).map(([alias, src]) => ({alias, src}))
]);