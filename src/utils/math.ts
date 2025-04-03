export const SECONDS_IN_HOUR = 3600;

export function getRandom(min: number, max: number, decimals: number): number {
    return parseFloat((Math.random() * (min - max) + max).toFixed(decimals));
}