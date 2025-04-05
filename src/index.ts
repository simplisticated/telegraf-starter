import { Telegraf } from "telegraf";
import ENV from "./env";
import MIDDLEWARE_LIST from "./middleware";
import "reflect-metadata";
import STORE from "./data/store/store";

async function start(): Promise<Telegraf> {
    await STORE.initialize();

    if (!ENV.TELEGRAM_TOKEN) {
        throw new Error("Telegram token not found");
    }
    const bot = new Telegraf(ENV.TELEGRAM_TOKEN);
    MIDDLEWARE_LIST.forEach(middleware => bot.use(middleware));
    bot.launch();
    return bot;
}

start();
