import { EngineContext } from "../session/context";

export default async function handleCommand(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (
        context.message &&
        "text" in context.message &&
        context.message.text.startsWith("/")
    ) {
        const segments = context.message.text.split(" ");
        const command = segments[0].slice(1);
        switch (command) {
            default: {
                await context.scene.leave();
                await context.scene.enter("start-scene");
                return;
            }
        }
    }

    next();
}
