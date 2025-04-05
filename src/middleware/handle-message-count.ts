import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import STORE from "../data/store/store";

export default async function handleMessageCount(
    context: Context<Update>,
    next: () => Promise<void>
) {
    const sender = context.from;
    if (!sender) {
        next();
        return;
    }

    await STORE.updateUserState(sender.id, previousState => ({
        messageCount: (previousState.messageCount ?? 0) + 1,
    }));

    next();
}
