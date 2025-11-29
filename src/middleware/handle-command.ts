import { EngineContext } from "../session/context";

async function handler(context: EngineContext, next: () => Promise<void>) {
    if (
        context.message &&
        "text" in context.message &&
        context.message.text.startsWith("/")
    ) {
        const segments = context.message.text.split(" ");
        const commandFromMessage = segments[0].slice(1);
        switch (commandFromMessage) {
            case "start": {
                await context.scene.leave();
                await context.scene.enter("start-scene");
                return;
            }
            default: {
                break;
            }
        }
    }

    await next();
}

export function handleCommandWithoutScene(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (!context.scene?.current) {
        return handler(context, next);
    }
    return next();
}

export function handleCommandWithActiveScene(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (context.scene?.current !== undefined) {
        return handler(context, next);
    }
    return next();
}
