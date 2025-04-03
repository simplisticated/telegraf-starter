import { Telegraf } from "telegraf";
import ENV from "./env";
import MIDDLEWARE_LIST from "./middleware";
import "reflect-metadata";

async function start(): Promise<Telegraf> {
    if (!ENV.TELEGRAM_TOKEN) {
        throw new Error("Telegram token not found");
    }
    const bot = new Telegraf(ENV.TELEGRAM_TOKEN);
    MIDDLEWARE_LIST.forEach(middleware => bot.use(middleware));
    bot.launch();
    return bot;
}

start();
