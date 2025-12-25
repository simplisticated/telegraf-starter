import { Telegraf } from "telegraf";
import { EngineContext } from "../session/context";

export async function launchBot(
    bot: Telegraf<EngineContext>
): Promise<boolean> {
    return new Promise(resolve => {
        try {
            bot.launch(() => {
                resolve(true);
            });
        } catch (error) {
            console.error(error);
            resolve(false);
        }
    });
}
