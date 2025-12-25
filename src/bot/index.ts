import { Telegraf } from "telegraf";
import botData from "../middleware/common/bot-data";
import checkIfBlocked from "../middleware/common/check-if-blocked";
import onlyPrivate from "../middleware/common/only-private";
import overrideContextMethods from "../middleware/common/override-context-methods";
import setupSession from "../middleware/common/setup-session";
import telegramProfileData from "../middleware/common/telegram-profile-data";
import userData from "../middleware/common/user-data";
import { commandWithoutScene } from "../middleware/private/command";
import messageCount from "../middleware/private/message-count";
import messageTimestamp from "../middleware/private/message-timestamp";
import messageWithoutScene from "../middleware/private/message-without-scene";
import stage from "../middleware/private/stage";
import { EngineContext } from "../session/context";
import queue from "../middleware/common/queue";

export function createBot(token: string) {
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
    bot.use(messageTimestamp);
    bot.use(stage);
    bot.use(commandWithoutScene);
    bot.use(messageWithoutScene);
    return bot;
}
