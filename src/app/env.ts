/* eslint-disable @typescript-eslint/no-unused-vars */
import { configDotenv } from "dotenv";
import { AppEnvironment, isAppEnvironment } from "./app-environment";

configDotenv();

function getString(key: string): string | null {
    return process.env[key] ?? null;
}

function getNonEmptyStringOrThrowError(key: string): string {
    const value = getString(key);
    if (value === null) {
        throw new Error(`${key} not found`);
    } else if (value.length === 0) {
        throw new Error(`${key} is empty`);
    }
    return value;
}

function getNumber(key: string): number | null {
    const stringValue = getString(key)?.trim();
    if (!stringValue) return null;
    const parsedNumber = Number(stringValue);
    return Number.isNaN(parsedNumber) ? null : parsedNumber;
}

function getNumberOrThrowError(key: string): number {
    const value = getNumber(key);
    if (value === null) {
        throw new Error(`${key} not found`);
    }
    return value;
}

function getBoolean(key: string): boolean | null {
    const stringValue = getString(key)?.trim().toLowerCase();
    if (!stringValue) return null;
    const TRUE = String(true).toLowerCase();
    const FALSE = String(false).toLowerCase();
    const isBoolean = [TRUE, FALSE].includes(stringValue);
    return isBoolean ? stringValue === TRUE : null;
}

function getBooleanOrThrowError(key: string): boolean {
    const value = getBoolean(key);
    if (value === null) {
        throw new Error(`${key} not found`);
    }
    return value;
}

function getStringList(key: string, divider: string = ","): string[] | null {
    const stringValue = getString(key)?.trim();
    if (!stringValue) return null;
    return stringValue.split(divider);
}

function getNonEmptyStringListOrThrowError(key: string): string[] {
    const value = getStringList(key);
    if (value === null) {
        throw new Error(`${key} not found`);
    } else if (value.length === 0) {
        throw new Error(`${key} is empty`);
    }
    return value;
}

function getNumberList(key: string, divider: string = ","): number[] | null {
    const stringValue = getString(key)?.trim();
    if (!stringValue) return null;
    const stringList = stringValue.split(divider);
    return stringList
        .map(value => {
            const parsedNumber = Number(value);
            return Number.isNaN(parsedNumber) ? null : parsedNumber;
        })
        .filter(value => value !== null);
}

function getNonEmptyNumberListOrThrowError(key: string): number[] {
    const value = getNumberList(key);
    if (value === null) {
        throw new Error(`${key} not found`);
    } else if (value.length === 0) {
        throw new Error(`${key} is empty`);
    }
    return value;
}

const ENV = {
    APP_ENVIRONMENT: (() => {
        const value = getString("APP_ENVIRONMENT");
        return isAppEnvironment(value) ? value : AppEnvironment.local;
    })(),
    TELEGRAM_TOKEN: getNonEmptyStringListOrThrowError("TELEGRAM_TOKEN"),
    LOG_TIMEZONE: getString("LOG_TIMEZONE") ?? "UTC",
    SERVER_PORT: getNumber("SERVER_PORT") ?? 3000,
    USE_HTTPS: getBoolean("USE_HTTPS") ?? false,
    LOG_SERVER_REQUESTS: getBoolean("LOG_SERVER_REQUESTS") ?? false,
};

export default ENV;
