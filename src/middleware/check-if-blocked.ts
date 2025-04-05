import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import STORE from "../data/store/store";

export default async function checkIfBlocked(
    context: Context<Update>,
    next: () => Promise<void>
) {
    const sender = context.from;
    if (!sender) {
        next();
        return;
    }

    const user = await STORE.getUserByTelegramId(sender.id);

    if (user && user.is_blocked) {
        context.reply(`You are blocked from using this bot.`);
        return;
    }

    next();
}
