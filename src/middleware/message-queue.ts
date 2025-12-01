import { EngineContext } from "../session/context";
import { INCOMING_MESSAGE_QUEUE } from "../tasks/instances";

export default function messageQueue(
    context: EngineContext,
    next: () => Promise<void>
) {
    return INCOMING_MESSAGE_QUEUE.add(next);
}
