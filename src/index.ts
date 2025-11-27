import { Scenes, session, Telegraf } from "telegraf";
import "reflect-metadata";
import STORE from "./data/store/store";
import Context from "./session/context";
import START_SCENE, { START_SCENE_ID } from "./scenes/start";
import MIDDLEWARE_LIST from "./middleware";
import ENV from "./app/env";

async function start(): Promise<Telegraf<Context>> {
    if (!ENV.TELEGRAM_TOKEN) {
        throw new Error("Telegram token not found");
    }

    await STORE.initialize();

    const stage = new Scenes.Stage<Context>([START_SCENE]);

    const bot = new Telegraf<Context>(ENV.TELEGRAM_TOKEN);
    MIDDLEWARE_LIST.forEach(middleware => bot.use(middleware));
    bot.use(session());
    bot.use(stage.middleware());
    bot.start(async context => context.scene.enter(START_SCENE_ID));
    bot.launch();
    return bot;
}

start();
