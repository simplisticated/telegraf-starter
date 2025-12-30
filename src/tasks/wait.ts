export function wait(interval: number) {
    return new Promise(resolve => {
        setTimeout(resolve, interval);
    });
}

export async function getDuration<Result>(
    task: Promise<Result> | (() => Result | Promise<Result>)
): Promise<number> {
    const startTimestamp = performance.now();
    if (typeof task === "function") {
        await task();
    } else {
        await task;
    }
    return performance.now() - startTimestamp;
}
