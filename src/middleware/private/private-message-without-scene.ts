import { isPrivate } from "../../app/context";
import { EngineContext } from "../../session/context";

export default function privateMessageWithoutScene(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (!isPrivate(context)) return next();
    if (context.updateType !== "message") return next();

    if (!context.scene.current) {
        return context.scene.enter("start-scene");
    }

    return next();
}
