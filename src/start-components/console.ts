import { setupConsole } from "../app/console";
import ENV from "../app/env";
import STORE from "../data/store/store";

export function initializeConsole() {
    setupConsole({
        outputTimestamp: true,
        timezone: ENV.LOG_TIMEZONE,
        handleMessage: async (message, level) => {
            await STORE.createLog({
                level,
                message: message ?? "",
            });

            // Здесь можно реализовать отправку сообщений в бэкенд. Пример:
            // if (level === "error") send(message)
        },
    });
}
