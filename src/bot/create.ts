import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import botData from "../middleware/common/bot-data";
import checkIfBlocked from "../middleware/common/check-if-blocked";
import onlyPrivate from "../middleware/common/only-private";
import overrideContextMethods from "../middleware/common/override-context-methods";
import setupSession from "../middleware/common/setup-session";
import telegramProfileData from "../middleware/common/telegram-profile-data";
import userData from "../middleware/common/user-data";
import privateCommand from "../middleware/private/private-command";
import privateMessageCount from "../middleware/private/private-message-count";
import privateMessageWithoutScene from "../middleware/private/private-message-without-scene";
import stage from "../middleware/private/stage";
import { EngineContext } from "../session/context";
import queue from "../middleware/common/queue";
import { isGroup } from "../app/context";
import { APP_CONFIGURATION } from "../app/configuration";
import groupCommand from "../middleware/group/group-command";

export function createBot(token: string): Telegraf<EngineContext> {
    const bot = new Telegraf<EngineContext>(token, {
        handlerTimeout: APP_CONFIGURATION.app.incomingRequestHandlerTimeout,
    });
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
     * Подсчет количества приватных сообщений от пользователя.
     */
    bot.use(privateMessageCount);
    /**
     * Проверяем, что пользователь не заблокирован в приватном режиме.
     */
    bot.use(onlyPrivate(checkIfBlocked));
    /**
     * На этом этапе выполняются middleware из текущей сцены.
     */
    bot.use(stage);
    /**
     * Если активной сцены нет, здесь будет обработана приватная команда.
     */
    bot.use(privateCommand);
    /**
     * Если активной сцены нет, здесь будет обработано приватное сообщение.
     */
    bot.use(privateMessageWithoutScene);
    /**
     * Обработка команды в группе.
     */
    bot.use(groupCommand);
    /**
     * Обработка публичного сообщения в группе.
     */
    bot.on(message("text"), context => {
        if (!isGroup(context)) return;
        console.log(`PUBLIC MESSAGE:`, context.message.text);
        // Реализация обработчика...
    });
    bot.catch(async (error, context) => {
        console.error(error);
        if (context.message !== undefined) {
            await context.reply(
                `Запрос не обработан. Попробуйте повторить запрос позже.`,
                {
                    ...(context.message !== undefined
                        ? {
                              reply_parameters: {
                                  message_id: context.message.message_id,
                              },
                          }
                        : undefined),
                }
            );
        }
    });
    return bot;
}
