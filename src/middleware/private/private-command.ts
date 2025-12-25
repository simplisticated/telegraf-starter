import { isPrivate } from "../../app/context";
import { EngineContext } from "../../session/context";

export default function privateCommand(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (!isPrivate(context)) return next();

    if (
        context.message &&
        "text" in context.message &&
        context.message.text.startsWith("/")
    ) {
        const segments = context.message.text.split(" ");
        const commandFromMessage = segments[0].slice(1);
        switch (commandFromMessage) {
            case "start": {
                return context.scene.enter("start-scene");
            }
            default: {
                break;
            }
        }
    }

    return next();
}
