export default function overrideObjectMethod<
    Target,
    MethodName extends keyof Target,
>(
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
