import { isGroup } from "../../app/context";
import { EngineContext } from "../../session/context";

export default async function groupCommand(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (!isGroup(context)) return next();
    if (context.updateType !== "message") return next();
    if (context.message === undefined) return next();

    const sender = context.from;
    if (!sender) return next();

    const chatId = context.chat?.id;
    if (!chatId) return next();

    if ("text" in context.message && context.message.text.startsWith("/")) {
        const segments = context.message.text.split(" ");
        const command = segments[0].slice(1);
        switch (command) {
            // Here you can implement handler for the command
            default: {
                break;
            }
        }
    }

    return next();
}
