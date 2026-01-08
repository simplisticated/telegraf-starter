import { QUEUE_INSTANCES } from "../../../tasks/instances";
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
            const result = await QUEUE_INSTANCES.telegramApiRequest.add(() =>
                source(...args)
            );
            return result!;
        }
    );
    return next();
}
