import "reflect-metadata";
import STORE from "./data/store/store";
import ENV from "./app/env";
import { setupConsole } from "./app/console";
import { createBot } from "./bot/common/create";
import PATH from "./app/path";
import { startListening } from "./server/launch";
import BOT_MANAGER from "./bot/common/manager";
import { getLocalBaseUrl, getPublicBaseUrl } from "./app/base-url";
import { getDuration, wait } from "./tasks/wait";
import { createServer } from "./server/create";
import SERVER_MANAGER from "./server/manager";

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
    const server = await createServer({
        useHttps: ENV.USE_HTTPS,
    });
    server.addListener("error", console.error);
    const serverLaunched = await startListening(server, {
        port: ENV.SERVER_PORT,
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
    SERVER_MANAGER.add("api", server);
}

function setupSignalHandlers() {
    ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((event: any) => {
        process.once(event, async () => {
            console.log(`Получил сигнал ${event}`);
            console.log(`Уведомляем администраторов ботов...`);
            const botInstances = BOT_MANAGER.getAll().filter(
                instance => instance.state.isActive
            );
            await Promise.allSettled(
                botInstances.map(async instance => {
                    if (!instance.bot.botInfo) return;
                    const bot = await STORE.getBotByTelegramId(
                        instance.bot.botInfo.id.toString()
                    );
                    if (!bot) return;
                    const administrators = bot.users
                        .filter(user => user.is_administrator)
                        .map(user => user.telegramProfile);
                    await Promise.allSettled(
                        administrators.map(async user => {
                            await instance.bot.telegram.sendMessage(
                                user.telegram_id,
                                `Bot stopped: @${bot.username}\nReason: ${event}`
                            );
                        })
                    );
                    instance.bot.stop(event ? `${event}` : undefined);
                })
            );
            console.log(`Закрываем все соединения...`);
            await SERVER_MANAGER.close();
            console.log(`Завершаем процесс`);
            await wait(1000);
            process.exit();
        });
    });
}

async function start(): Promise<boolean> {
    const duration = await getDuration(async () => {
        initializeConsole();
        await initializeDatabase();
        initializeFolderStructure();
        await initializeBots();
        await initializeServer();
        setupSignalHandlers();
    });
    console.log(
        `Launched everything in ${(duration / 1000).toFixed(3)} seconds`
    );
    return true;
}

start();
