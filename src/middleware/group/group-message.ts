import { isGroup } from "../../app/context";
import { EngineContext } from "../../session/context";

export default async function groupMessage(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (!isGroup(context)) return next();
    if (context.updateType !== "message") return next();

    const sender = context.from;
    if (!sender) return next();

    const chatId = context.chat?.id;
    if (!chatId) return next();

    // Here you can implement handler for the group message

    return next();
}
