import ENV from "../app/env";
import { createBot } from "../bot/common/create";
import BOT_MANAGER from "../bot/common/manager";

export async function initializeBots() {
    console.log(`Launching bots...`);
    const botList = ENV.TELEGRAM_TOKEN.map(createBot);
    BOT_MANAGER.add(botList);
    await BOT_MANAGER.launch();
    console.log(`All bots launched`);
}
