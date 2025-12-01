import { Scenes, Telegraf } from "telegraf";
import "reflect-metadata";
import STORE from "./data/store/store";
import START_SCENE from "./scenes/start";
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

async function start(): Promise<Telegraf<EngineContext>> {
    if (!ENV.TELEGRAM_TOKEN) throw new Error("Telegram token not found");

    await STORE.initialize();

    const stage = new Scenes.Stage<EngineContext>([START_SCENE]);

    const bot = new Telegraf<EngineContext>(ENV.TELEGRAM_TOKEN);
    bot.use(messageQueue);
    bot.use(overrideContextMethods);
    bot.use(setupSession);
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
