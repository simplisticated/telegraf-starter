import { Telegraf } from "telegraf";
import "reflect-metadata";
import STORE from "./data/store/store";
import ENV from "./app/env";
import { EngineContext } from "./session/context";
import userData from "./middleware/user-data";
import messageCount from "./middleware/message-count";
import checkIfBlocked from "./middleware/check-if-blocked";
import { commandWithoutScene } from "./middleware/command";
import messageWithoutScene from "./middleware/message-without-scene";
import overrideContextMethods from "./middleware/override-context-methods";
import queue from "./middleware/queue";
import setupSession from "./middleware/setup-session";
import stage from "./middleware/stage";
import botData from "./middleware/bot-data";
import { setupConsole } from "./app/console";
import telegramProfileData from "./middleware/telegram-profile-data";
import messageTimestamp from "./middleware/message-timestamp";
import onlyPrivate from "./middleware/only-private";

function createBot(token: string) {
    const bot = new Telegraf<EngineContext>(token);
    /**
     * Добавляем обработку сообщения в очередь с целью контроля нагрузки на сервер.
     */
    bot.use(queue);
    /**
     * Переопределяем методы контекста.
     * Это нужно для контроля количества запросов к серверу Telegram.
     */
    bot.use(overrideContextMethods);
    /**
     * Настройка сессии для пользователя.
     */
    bot.use(setupSession);
    /**
     * Обработка данных бота.
     */
    bot.use(botData);
    /**
     * Обработка пользовательских данных: сохранение информации о пользователе в базу.
     */
    bot.use(telegramProfileData);
    /**
     * Создание экземпляра UserModel.
     */
    bot.use(userData);
    /**
     * Подсчет количества сообщений от пользователя.
     */
    bot.use(messageCount);
    /**
     * Проверяем, что пользователь не заблокирован.
     */
    bot.use(onlyPrivate(checkIfBlocked));
    /**
     * Проверяем дату отправки сообщения.
     */
    bot.use(onlyPrivate(messageTimestamp));
    bot.use(stage);
    bot.use(commandWithoutScene);
    bot.use(messageWithoutScene);
    return bot;
}

async function start(): Promise<any> {
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

    await STORE.initialize();

    const botList = ENV.TELEGRAM_TOKEN.map(createBot);
    return Promise.allSettled(botList.map(bot => bot.launch()));
}

start();
