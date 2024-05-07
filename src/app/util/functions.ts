export function scrollIncrementDecrement(invert: boolean, e: WheelEvent, n: number | string, step: number = 1, max: number = 100, min: number = 0): number {
    let m = Number(n)
    if (invert ? e.deltaY > 0 : e.deltaY < 0) {
        if (m - step >= min) {
            return m - step;
        } else {
            return min;
        }
    } else {
        if (m + step <= max) {
            return m + step;
        } else {
            return max;
        }
    }
}