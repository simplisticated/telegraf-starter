import STORE from "../../data/store/store";
import { EngineContext } from "../../session/context";

export default async function userData(
    context: EngineContext,
    next: () => Promise<void>
) {
    const sender = context.from;
    if (!sender) return next();

    const telegramProfile = await STORE.getTelegramProfileByTelegramId(
        sender.id
    );
    if (!telegramProfile) return next();

    const bot = await STORE.getBotByTelegramId(context.botInfo.id);
    if (!bot) return next();

    const existingUser = await STORE.getUserByTelegramId(
        sender.id,
        context.botInfo.id
    );

    if (!existingUser) {
        await STORE.createOrUpdateUser({
            telegramProfile,
            bot,
        });
    }

    return next();
}
