import { EngineContext } from "../session/context";

function handler(context: EngineContext, next: () => Promise<void>) {
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

export function commandWithoutScene(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (!context.scene?.current) {
        return handler(context, next);
    }
    return next();
}

export function commandWithActiveScene(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (context.scene?.current !== undefined) {
        return handler(context, next);
    }
    return next();
}
