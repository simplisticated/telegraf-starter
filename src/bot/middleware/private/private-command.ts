import { isPrivate } from "../../common/context";
import { parseCommand } from "../../common/message";
import { EngineContext } from "../../session/context";

export default function privateCommand(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (!isPrivate(context)) return next();
    if (context.updateType !== "message") return next();
    if (context.message === undefined) return next();
    if (!("text" in context.message)) return next();

    const data = parseCommand(context.message);
    if (!data) return next();

    switch (data.command) {
        case "start": {
            return context.scene.enter("start-scene");
        }
        default: {
            break;
        }
    }

    return next();
}
