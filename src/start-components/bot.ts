import ENV from "../app/env";
import { createBot } from "../bot/common/create";
import BOT_MANAGER from "../bot/common/manager";

export async function initializeBots() {
    console.log(`Launching bots...`);
    const botList = ENV.TELEGRAM_TOKEN.map(createBot);
    BOT_MANAGER.add(botList);
    const launchedBotIdentifiers = await BOT_MANAGER.launch();
    launchedBotIdentifiers.forEach(botId => {
        const bot = BOT_MANAGER.get(botId)?.bot;
        if (!bot || !bot.botInfo) return;
        BOT_MANAGER.sendToAdministrators(
            `Bot launched: @${bot.botInfo.username}`,
            {
                botId,
            }
        );
    });
    console.log(`All bots launched`);
}
