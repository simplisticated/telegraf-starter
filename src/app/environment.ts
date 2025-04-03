import ENV from "../env";

export enum AppEnvironment {
    production = "production",
    test = "test",
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

export const CURRENT_ENVIRONMENT = isAppEnvironment(ENV.APP_ENVIRONMENT)
    ? ENV.APP_ENVIRONMENT
    : AppEnvironment.local;

export type AppEnvironmentValue<Value> = {
    production: Value;
    test: Value;
    local: Value;
};

export function getValueForCurrentEnvironment<Value>(
    value: AppEnvironmentValue<Value>
): Value {
    return value[CURRENT_ENVIRONMENT];
}
