import { Scenes, session, Telegraf } from "telegraf";
import "reflect-metadata";
import STORE from "./data/store/store";
import START_SCENE from "./scenes/start";
import ENV from "./app/env";
import { EngineContext } from "./session/context";
import { SessionStore } from "./session/store";
import { INCOMING_MESSAGE_QUEUE } from "./tasks/instances";
import userData from "./middleware/user-data";
import messageCount from "./middleware/message-count";
import checkIfBlocked from "./middleware/check-if-blocked";
import { commandWithoutScene } from "./middleware/command";
import messageWithoutScene from "./middleware/message-without-scene";

async function start(): Promise<Telegraf<EngineContext>> {
    if (!ENV.TELEGRAM_TOKEN) {
        throw new Error("Telegram token not found");
    }

    await STORE.initialize();

    const stage = new Scenes.Stage<EngineContext>([START_SCENE]);

    const bot = new Telegraf<EngineContext>(ENV.TELEGRAM_TOKEN);
    bot.use(async (_context, next) => INCOMING_MESSAGE_QUEUE.add(next));
    bot.use(
        session({
            store: new SessionStore({ dataStore: STORE }),
            getSessionKey: context => {
                if (!context.from || !context.chat) return undefined;
                return `${context.from.id}:${context.chat.id}`;
            },
        })
    );
    bot.use(userData);
    bot.use(messageCount);
    bot.use(checkIfBlocked);
    bot.use(stage.middleware());
    bot.use(commandWithoutScene);
    bot.use(messageWithoutScene);
    bot.launch();
    return bot;
}

start();
