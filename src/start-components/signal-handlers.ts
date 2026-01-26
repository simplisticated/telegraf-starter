import { stop } from "../app/stop";

export function setupSignalHandlers() {
    ["SIGINT", "SIGTERM", "SIGQUIT"].forEach(event => {
        process.once(event, async () => stop(event));
    });
}
