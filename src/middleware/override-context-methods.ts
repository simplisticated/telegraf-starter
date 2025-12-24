import { isPrivate, isGroup } from "../app/context";
import { EngineContext } from "../session/context";
import { TELEGRAM_API_REQUEST_QUEUE } from "../tasks/instances";
import overrideObjectMethod from "../tasks/override";

export default function overrideContextMethods(configuration: {
    private: boolean;
    group: boolean;
}): (context: EngineContext, next: () => Promise<void>) => Promise<void> {
    return (context, next) => {
        if (
            (configuration.private && isPrivate(context)) ||
            (configuration.group && isGroup(context))
        ) {
            overrideObjectMethod(
                context.telegram,
                "callApi",
                (source, ...args) =>
                    TELEGRAM_API_REQUEST_QUEUE.add(() => source(...args))
            );
        }

        return next();
    };
}
