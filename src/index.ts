import { Scenes, session, Telegraf } from "telegraf";
import "reflect-metadata";
import STORE from "./data/store/store";
import START_SCENE from "./scenes/start";
import ENV from "./app/env";
import { EngineContext } from "./session/context";
import { MIDDLEWARE_LIST } from "./middleware";
import { SessionStore } from "./session/store";

async function start(): Promise<Telegraf<EngineContext>> {
    if (!ENV.TELEGRAM_TOKEN) {
        throw new Error("Telegram token not found");
    }

    await STORE.initialize();

    const stage = new Scenes.Stage<EngineContext>([START_SCENE]);

    const bot = new Telegraf<EngineContext>(ENV.TELEGRAM_TOKEN);
    bot.use(
        session({
            store: new SessionStore({ dataStore: STORE }),
            getSessionKey: context => {
                if (!context.from || !context.chat) return undefined;
                return `${context.from.id}:${context.chat.id}`;
            },
        })
    );
    bot.use(stage.middleware());
    MIDDLEWARE_LIST.forEach(middleware => bot.use(middleware));
    bot.launch();
    return bot;
}

start();
