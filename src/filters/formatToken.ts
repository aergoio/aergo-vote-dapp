import { Amount } from '@herajs/client';

const tryUnits = ['aergo', 'gaer', 'aer'];

export function formatToken(_value: any, unit = '', showUnit = true): string {
    const value = new Amount(_value, 'aer');
    let amount;
    if (unit) {
        [amount, ] = value.toUnit(unit).toString().split(' ');
    } else {
        // if no unit given, try formatting from biggest to smallest
        let i = 0;
        while(true) {
            unit = tryUnits[i++];
            [amount, ] = value.toUnit(unit).toString().split(' ');
            if (i >= tryUnits.length || !amount.match(/^0\.0{3,}/)) break;
            // try next smaller unit if too many leading zeros
        }
    }
    if (!amount) amount = '0';
    if (!showUnit) return `${amount}`;
    return `${amount} ${unit}`;
}
