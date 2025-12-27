import "reflect-metadata";
import STORE from "./data/store/store";
import ENV from "./app/env";
import { setupConsole } from "./app/console";
import { createBot } from "./bot/create";
import { launchBot } from "./bot/launch";

async function start(): Promise<boolean> {
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

    console.log(`Preparing database...`);
    const isStoreInitialized = await STORE.initialize();
    if (!isStoreInitialized) {
        console.error(`Database is not initialized`);
        return false;
    }
    console.log(`Database initialized`);

    console.log(`Launching bots...`);
    const botList = ENV.TELEGRAM_TOKEN.map(createBot);
    await Promise.allSettled(botList.map(launchBot));
    console.log(`All bots launched`);

    return true;
}

start();
