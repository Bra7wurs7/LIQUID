export function scrollIncrementDecrement(invert: boolean, e: WheelEvent, n: number, step: number = 1, max: number = 100, min: number = 0): number {
    if (invert ? e.deltaY > 0 : e.deltaY < 0) {
        if (n - step >= min) {
            return n - step;
        }
    } else {
        if (n + step <= max) {
            return n + step;
        }
    }
    return n;
}