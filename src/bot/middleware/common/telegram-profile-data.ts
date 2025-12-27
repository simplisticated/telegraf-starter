import STORE from "../../../data/store/store";
import { getUserDescription } from "../../common/users";
import { EngineContext } from "../../session/context";

export default async function telegramProfileData(
    context: EngineContext,
    next: () => Promise<void>
) {
    const sender = context.from;
    if (!sender) return next();

    const telegramProfileResult = await STORE.createOrUpdateTelegramProfile({
        telegram_id: sender.id.toString(),
        is_bot: sender.is_bot,
        first_name: sender.first_name,
        last_name: sender.last_name,
        username: sender.username,
        language_code: sender.language_code,
        is_premium: sender.is_premium ?? false,
    });
    if (!telegramProfileResult) return next();

    if (telegramProfileResult.isNewTelegramProfile) {
        const userDescription = getUserDescription(sender);
        console.log(`New user: ${userDescription}`);
    }

    // Here you can implement sending user information to the backend or analytics.

    return next();
}
