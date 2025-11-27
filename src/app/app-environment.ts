export enum AppEnvironment {
    production = "production",
    internal = "internal",
    local = "local",
}

export function isAppEnvironment(obj: any): obj is AppEnvironment {
    if (typeof obj === "string") {
        const possibleValues = Object.values(AppEnvironment).map(value =>
            value.toString()
        );
        return possibleValues.includes(obj);
    }
    return false;
}
