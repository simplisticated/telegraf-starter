import os from "os";
import ENV from "./env";

function getLocalNetworkAddress() {
    const interfaces = os.networkInterfaces();

    // eslint-disable-next-line no-restricted-syntax
    for (const name of Object.keys(interfaces)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const networkInterface of interfaces[name] || []) {
            if (
                networkInterface.family === "IPv4" &&
                !networkInterface.internal
            ) {
                return networkInterface.address;
            }
        }
    }

    return "localhost";
}

function getProtocol() {
    return ENV.USE_HTTPS ? "https" : "http";
}

export function getLocalBaseUrl(): string {
    return `${getProtocol()}://${getLocalNetworkAddress()}:${ENV.SERVER_PORT}`;
}

export function getPublicBaseUrl(): string | null {
    if (!ENV.SERVER_HOSTNAME || ENV.SERVER_HOSTNAME.length === 0) return null;
    return `${getProtocol()}://${ENV.SERVER_HOSTNAME}:${ENV.SERVER_PORT}`;
}
