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
import messageQueue from "./middleware/message-queue";
import setupSession from "./middleware/setup-session";
import stage from "./middleware/stage";

async function start(): Promise<Telegraf<EngineContext>> {
    await STORE.initialize();

    const bot = new Telegraf<EngineContext>(ENV.TELEGRAM_TOKEN);
    /**
     * Добавляем обработку сообщения в очередь с целью контроля нагрузки на сервер.
     */
    bot.use(messageQueue);
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
     * Обработка пользовательских данных: сохранение информации о пользователе в базу.
     */
    bot.use(userData);
    /**
     * Подсчет количества сообщений от пользователя.
     */
    bot.use(messageCount);
    /**
     * Проверяем, что пользователь не заблокирован.
     */
    bot.use(checkIfBlocked);
    bot.use(stage);
    bot.use(commandWithoutScene);
    bot.use(messageWithoutScene);
    bot.launch();
    return bot;
}

start();
