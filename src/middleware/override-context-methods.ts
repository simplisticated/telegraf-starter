import { EngineContext } from "../session/context";
import { TELEGRAM_API_REQUEST_QUEUE } from "../tasks/instances";
import overrideObjectMethod from "../tasks/override";

export default function overrideContextMethods(
    context: EngineContext,
    next: () => Promise<void>
): Promise<void> {
    overrideObjectMethod(context.telegram, "callApi", (source, ...args) =>
        TELEGRAM_API_REQUEST_QUEUE.add(() => source(...args))
    );
    return next();
}
