import ENV from "../app/env";
import { createBot } from "../bot/common/create";
import BOT_MANAGER from "../bot/common/manager";

export async function initializeBots() {
    console.log(`Launching bots...`);

    const botList = ENV.TELEGRAM_TOKEN.map(createBot);
    if (botList.length === 0) {
        console.log(`Did not found bots to launch`);
        return;
    }

    BOT_MANAGER.add(botList);
    const launchedBotIdentifiers = await BOT_MANAGER.launch();
    launchedBotIdentifiers.forEach(botId => {
        const instance = BOT_MANAGER.get(botId);
        if (!instance) return;
        const { bot, state } = instance;
        if (!bot || !bot.botInfo) return;
        BOT_MANAGER.sendToAdministrators(
            state.isActive
                ? `Bot launched: @${bot.botInfo.username}`
                : `Bot is not launched: @${bot.botInfo.username}`,
            {
                botId,
            }
        );
    });

    if (launchedBotIdentifiers.length === botList.length) {
        console.log(`All bots launched`);
    } else {
        console.error(
            `${launchedBotIdentifiers.length} of ${botList.length} bots launched`
        );
    }
}
