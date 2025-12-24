import { isPrivate } from "../app/context";
import STORE from "../data/store/store";
import { EngineContext } from "../session/context";

export default async function messageCount(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (!isPrivate(context)) return next();
    if (context.updateType !== "message") return next();

    const sender = context.from;

    if (sender) {
        await STORE.updateUserState(
            sender.id,
            context.botInfo.id,
            previousState => ({
                messageCount: (previousState.messageCount ?? 0) + 1,
            })
        );
    }

    return next();
}
