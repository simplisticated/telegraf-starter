import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import STORE from "../data/store/store";
import { getUserDescription } from "../app/users";

export default async function handleUserData(
    context: Context<Update>,
    next: () => Promise<void>
) {
    const sender = context.from;
    if (!sender) {
        next();
        return;
    }

    const result = await STORE.createOrUpdateUserWithTelegramProfile({
        telegram_id: sender.id,
        is_bot: sender.is_bot,
        first_name: sender.first_name,
        last_name: sender.last_name,
        username: sender.username,
        language_code: sender.language_code,
        is_premium: sender.is_premium ?? false,
    });

    if (result?.isNewUser) {
        const userDescription = getUserDescription(sender);
        console.log(`New user: ${userDescription}`);
    }

    // Here you can implement sending user information to the backend or analytics.

    next();
}
