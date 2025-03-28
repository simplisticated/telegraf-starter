import { Telegraf } from "telegraf";
import ENV from "./env";

async function start(): Promise<Telegraf> {
    if (!ENV.TELEGRAM_TOKEN) {
        throw new Error("Telegram token not found");
    }
    const bot = new Telegraf(ENV.TELEGRAM_TOKEN);
    await bot.launch();
    return bot;
}

start();
