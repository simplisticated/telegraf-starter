import { Scenes, session, Telegraf } from "telegraf";
import ENV from "./env";
import "reflect-metadata";
import STORE from "./data/store/store";
import handleUserData from "./middleware/handle-user-data";
import checkIfBlocked from "./middleware/check-if-blocked";
import handleMessageCount from "./middleware/handle-message-count";
import Context from "./session/context";
import START_SCENE, { START_SCENE_ID } from "./scenes/start";

async function start(): Promise<Telegraf<Context>> {
    if (!ENV.TELEGRAM_TOKEN) {
        throw new Error("Telegram token not found");
    }

    await STORE.initialize();

    const stage = new Scenes.Stage<Context>([START_SCENE]);

    const bot = new Telegraf<Context>(ENV.TELEGRAM_TOKEN);
    bot.use(handleUserData); // writes the user's information to the database
    bot.use(checkIfBlocked); // if the user is blocked, they receive a message and are not passed further
    bot.use(handleMessageCount); // increments the user's message count and stores it in the database
    bot.use(session());
    bot.use(stage.middleware());
    bot.start(async context => context.scene.enter(START_SCENE_ID));
    bot.launch();
    return bot;
}

start();
