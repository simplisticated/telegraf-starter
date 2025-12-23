/* eslint-disable @typescript-eslint/no-unused-vars */
import { configDotenv } from "dotenv";
import { AppEnvironment, isAppEnvironment } from "./app-environment";

configDotenv();

function getString(key: string): string | null {
    return process.env[key] ?? null;
}

function getNumber(key: string): number | null {
    const stringValue = getString(key)?.trim();
    if (!stringValue) return null;
    const parsedNumber = Number(stringValue);
    return Number.isNaN(parsedNumber) ? null : parsedNumber;
}

function getBoolean(key: string): boolean | null {
    const stringValue = getString(key)?.trim().toLowerCase();
    if (!stringValue) return null;
    const TRUE = String(true).toLowerCase();
    const FALSE = String(false).toLowerCase();
    const isBoolean = [TRUE, FALSE].includes(stringValue);
    return isBoolean ? stringValue === TRUE : null;
}

function getStringList(key: string, divider: string = ","): string[] | null {
    const stringValue = getString(key)?.trim();
    if (!stringValue) return null;
    return stringValue.split(divider);
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

const ENV = {
    APP_ENVIRONMENT: (() => {
        const value = getString("APP_ENVIRONMENT");
        return isAppEnvironment(value) ? value : AppEnvironment.local;
    })(),
    TELEGRAM_TOKEN: (() => {
        const name = "TELEGRAM_TOKEN";
        const value = getStringList(name);
        if (!value || !value.length) {
            throw new Error(`${name} not found`);
        }
        return value;
    })(),
    LOG_TIMEZONE: getString("LOG_TIMEZONE") ?? "UTC",
};

export default ENV;
