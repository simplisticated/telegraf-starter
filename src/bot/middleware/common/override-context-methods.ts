import { TELEGRAM_API_REQUEST_QUEUE } from "../../../tasks/instances";
import overrideObjectMethod from "../../../tasks/override";
import { EngineContext } from "../../session/context";

export default function overrideContextMethods(
    context: EngineContext,
    next: () => Promise<void>
): Promise<void> {
    overrideObjectMethod(
        context.telegram,
        "callApi",
        async (source, ...args) => {
            const result = await TELEGRAM_API_REQUEST_QUEUE.add(() =>
                source(...args)
            );
            return result!;
        }
    );
    return next();
}
