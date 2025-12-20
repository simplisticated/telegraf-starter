import { EngineContext } from "../session/context";

export default function messageWithoutScene(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (
        !context.scene.current &&
        context.message &&
        "text" in context.message
    ) {
        return context.scene.enter("start-scene");
    }

    return next();
}
