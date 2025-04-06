import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import ENV from "./env";
import MIDDLEWARE_LIST from "./middleware";
import "reflect-metadata";
import STORE from "./data/store/store";
import handleTextMessage from "./messages/text";
import handleCommand from "./messages/command";
import handlePhotoMessage from "./messages/photo";

async function start(): Promise<Telegraf> {
    if (!ENV.TELEGRAM_TOKEN) {
        throw new Error("Telegram token not found");
    }

    await STORE.initialize();

    const bot = new Telegraf(ENV.TELEGRAM_TOKEN);
    MIDDLEWARE_LIST.forEach(middleware => bot.use(middleware));
    bot.command(/.*./s, context => {
        handleCommand(context);
    });
    bot.on(message("text"), context => handleTextMessage(context));
    bot.on(message("photo"), context => handlePhotoMessage(context));
    bot.launch();
    return bot;
}

start();
