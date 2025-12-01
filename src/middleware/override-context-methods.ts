import { EngineContext } from "../session/context";
import { TELEGRAM_API_REQUEST_QUEUE } from "../tasks/instances";

function overrideObjectMethod<Target, MethodName extends keyof Target>(
    targetObject: Target,
    methodName: MethodName,
    overrideBlock: Target[MethodName] extends (...args: infer A) => infer R
        ? (original: (...args: A) => R, ...args: A) => R
        : (...args: any[]) => any
) {
    const sourceMethod = targetObject[methodName];

    if (typeof sourceMethod !== "function") return;

    const original = sourceMethod.bind(targetObject) as (...args: any[]) => any;

    targetObject[methodName] = ((...args: any[]) =>
        overrideBlock(original, ...args)) as Target[MethodName];
}

export default async function overrideContextMethods(
    context: EngineContext,
    next: () => Promise<void>
) {
    overrideObjectMethod(context.telegram, "callApi", (source, ...args) =>
        TELEGRAM_API_REQUEST_QUEUE.add(async () => {
            const result = await source(...args);
            console.log(`Request to API`);
            return result;
        })
    );

    await next();
}
