import { isGroup, isPrivate } from "../app/context";
import { EngineContext } from "../session/context";
import { INCOMING_UPDATE_QUEUE } from "../tasks/instances";

export default function queue(configuration: {
    private: boolean;
    group: boolean;
}): (context: EngineContext, next: () => Promise<void>) => Promise<void> {
    return (context, next) => {
        if (
            (configuration.private && isPrivate(context)) ||
            (configuration.group && isGroup(context))
        ) {
            return INCOMING_UPDATE_QUEUE.add(next);
        }

        return next();
    };
}
