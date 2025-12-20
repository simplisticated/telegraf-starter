import STORE from "../data/store/store";
import { EngineContext } from "../session/context";

export default async function messageCount(
    context: EngineContext,
    next: () => Promise<void>
) {
    const sender = context.from;

    if (sender) {
        await STORE.updateUserState(sender.id, previousState => ({
            messageCount: (previousState.messageCount ?? 0) + 1,
        }));
    }

    await next();
}
