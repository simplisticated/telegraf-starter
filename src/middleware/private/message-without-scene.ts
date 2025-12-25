import { isPrivate } from "../../app/context";
import { EngineContext } from "../../session/context";

export default function messageWithoutScene(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (!isPrivate(context)) return next();

    if (
        !context.scene.current &&
        context.updateType === "message" &&
        context.message !== undefined
    ) {
        return context.scene.enter("start-scene");
    }

    return next();
}
