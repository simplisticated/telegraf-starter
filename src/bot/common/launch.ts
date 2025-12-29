import { Context, Telegraf } from "telegraf";

export async function launchBot<TelegrafContext extends Context>(
    bot: Telegraf<TelegrafContext>
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
