import STORE from "../../data/store/store";
import { EngineContext } from "../../session/context";

export default async function checkIfBlocked(
    context: EngineContext,
    next: () => Promise<void>
) {
    const sender = context.from;
    if (!sender) return next();

    const isBlocked = await STORE.isBlocked(sender.id, context.botInfo.id);

    if (isBlocked) {
        return context.reply(`You are blocked from using this bot.`);
    }

    return next();
}
