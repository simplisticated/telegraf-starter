import { isPrivate } from "../../app/context";
import STORE from "../../data/store/store";
import { EngineContext } from "../../session/context";

export default async function messageTimestamp(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (!isPrivate(context)) return next();

    if (
        context.updateType !== "message" ||
        !("message" in context) ||
        context.message === undefined ||
        context.from === undefined
    ) {
        return next();
    }

    const sender = context.from;

    const user = await STORE.getUserByTelegramId(sender.id, context.botInfo.id);
    if (!user) return next();

    const { latestMessageTimestamp } = user.state;
    const currentMessageTimestamp = context.message.date * 1000;

    if (
        latestMessageTimestamp === undefined ||
        currentMessageTimestamp > latestMessageTimestamp
    ) {
        await STORE.updateUserState(
            context.from.id,
            context.botInfo.id,
            () => ({
                latestMessageTimestamp: currentMessageTimestamp,
            })
        );
    }

    if (
        latestMessageTimestamp !== undefined &&
        currentMessageTimestamp > latestMessageTimestamp
    ) {
        const difference = currentMessageTimestamp - latestMessageTimestamp;

        if (difference < 5000) {
            return context.reply(`You're sending too many messages.`, {
                reply_parameters: {
                    message_id: context.message.message_id,
                },
            });
        }
    }

    return next();
}
