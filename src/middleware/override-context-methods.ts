import { EngineContext } from "../session/context";
import { TELEGRAM_API_REQUEST_QUEUE } from "../tasks/instances";
import overrideObjectMethod from "../tasks/override";

export default async function overrideContextMethods(
    context: EngineContext,
    next: () => Promise<void>
) {
    overrideObjectMethod(context.telegram, "callApi", (source, ...args) =>
        TELEGRAM_API_REQUEST_QUEUE.add(() => source(...args))
    );

    await next();
}
