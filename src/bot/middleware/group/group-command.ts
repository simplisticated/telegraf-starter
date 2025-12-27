import { isGroup } from "../../common/context";
import { parseCommand } from "../../common/message";
import { EngineContext } from "../../session/context";

export default async function groupCommand(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (!isGroup(context)) return next();
    if (context.updateType !== "message") return next();
    if (context.message === undefined) return next();
    if (!("text" in context.message)) return next();

    const data = parseCommand(context.message);
    if (!data) return next();

    switch (data.command) {
        // Here you can implement handler for the command
        default: {
            break;
        }
    }

    return next();
}
