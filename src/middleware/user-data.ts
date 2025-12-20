import STORE from "../data/store/store";
import { getUserDescription } from "../app/users";
import { EngineContext } from "../session/context";

export default async function userData(
    context: EngineContext,
    next: () => Promise<void>
) {
    const sender = context.from;
    if (!sender) return next();

    const telegramProfileResult = await STORE.createOrUpdateTelegramProfile({
        telegram_id: sender.id,
        is_bot: sender.is_bot,
        first_name: sender.first_name,
        last_name: sender.last_name,
        username: sender.username,
        language_code: sender.language_code,
        is_premium: sender.is_premium ?? false,
    });
    if (!telegramProfileResult) return next();

    const bot = await STORE.getBotByTelegramId(context.botInfo.id);
    if (!bot) return next();

    const user = await (() => {
        const existingUser = STORE.getUserByTelegramId(
            sender.id,
            context.botInfo.id
        );
        if (!existingUser) {
            return STORE.createOrUpdateUser({
                telegramProfile: telegramProfileResult.telegramProfile,
                bot,
            });
        }
        return existingUser;
    })();
    if (!user) return next();

    if (telegramProfileResult.isNewTelegramProfile) {
        const userDescription = getUserDescription(sender);
        console.log(`New user: ${userDescription}`);
    }

    // Here you can implement sending user information to the backend or analytics.

    return next();
}
