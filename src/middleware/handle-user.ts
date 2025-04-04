import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import DATABASE from "../data/store/database";

export default async function handleUser(
    context: Context<Update>,
    next: () => Promise<void>
) {
    const sender = context.from;
    if (!sender) {
        next();
        return;
    }

    const isNewUser = (await DATABASE.getUserByTelegramId(sender.id)) === null;
    await DATABASE.createOrUpdateUser({
        telegram_id: sender.id,
        is_bot: sender.is_bot,
        first_name: sender.first_name,
        last_name: sender.last_name,
        username: sender.username,
        language_code: sender.language_code,
        is_premium: sender.is_premium ?? false,
    });

    if (isNewUser) {
        console.log(`New user!`);
    }

    // Here you can implement sending user information to the backend or analytics.

    next();
}
