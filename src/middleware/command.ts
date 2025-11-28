import { EngineContext } from "../session/context";

export default async function command(
    context: EngineContext,
    next: () => Promise<void>
) {
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
