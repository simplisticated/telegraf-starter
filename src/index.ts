import "reflect-metadata";
import STORE from "./data/store/store";
import ENV from "./app/env";
import { setupConsole } from "./app/console";
import { createBot } from "./bot/common/create";
import PATH from "./app/path";
import { launchServer } from "./server/launch";
import BOT_MANAGER from "./bot/common/manager";
import { getLocalBaseUrl, getPublicBaseUrl } from "./app/base-url";
import { getDuration } from "./tasks/wait";

function initializeConsole() {
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

async function initializeDatabase() {
    console.log(`Preparing database...`);
    const isStoreInitialized = await STORE.initialize();
    if (!isStoreInitialized) {
        console.error(`Database is not initialized`);
        process.exit();
    }
    console.log(`Database initialized`);
}

async function initializeFolderStructure() {
    await PATH.initializeStructure();
    console.log(`Folder structure initialized`);
}

async function initializeBots() {
    console.log(`Launching bots...`);
    const botList = ENV.TELEGRAM_TOKEN.map(createBot);
    BOT_MANAGER.add(botList);
    await BOT_MANAGER.launch();
    console.log(`All bots launched`);
}

async function initializeServer() {
    console.log(`Starting server`);
    const serverLaunched = await launchServer({
        port: ENV.SERVER_PORT,
        useHttps: ENV.USE_HTTPS,
    });
    if (serverLaunched) {
        const publicBaseUrl = getPublicBaseUrl();
        const resultBaseUrl = publicBaseUrl ?? getLocalBaseUrl();
        const isLocal = publicBaseUrl === null;
        const output = [
            `Server is listening on port ${ENV.SERVER_PORT}`,
            "",
            `Administrator panel${
                isLocal ? " (local network)" : ""
            }: ${resultBaseUrl}`,
            "",
            `Stop all bots: ${resultBaseUrl}/api/bot/stop`,
            `Stop bot with ID: ${resultBaseUrl}/api/bot/stop/:id`,
            `Stop bot with username: ${resultBaseUrl}/api/bot/stop/:username`,
            "",
            `Launch all bots: ${resultBaseUrl}/api/bot/launch`,
            `Launch bot with ID: ${resultBaseUrl}/api/bot/launch/:id`,
            `Launch bot with username: ${resultBaseUrl}/api/bot/launch/:username`,
        ].join("\n");
        console.log(output);
    }
}

async function start(): Promise<boolean> {
    const duration = await getDuration(async () => {
        initializeConsole();
        await initializeDatabase();
        initializeFolderStructure();
        await initializeBots();
        await initializeServer();
    });
    console.log(
        `Launched everything in ${(duration / 1000).toFixed(3)} seconds`
    );
    return true;
}

start();
