import { EngineContext } from "../session/context";
import { INCOMING_UPDATE_QUEUE } from "../tasks/instances";

export default function queue(
    context: EngineContext,
    next: () => Promise<void>
): Promise<void> {
    return INCOMING_UPDATE_QUEUE.add(next);
}
